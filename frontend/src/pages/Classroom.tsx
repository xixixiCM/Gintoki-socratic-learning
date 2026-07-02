import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

import { LessonRecordList } from '../components/LessonRecordList';
import { ClassroomChat } from '../components/ClassroomChat';
import type { DynamicMessage } from '../components/ClassroomChat';
import { LessonKnowledgeGraph } from '../components/LessonKnowledgeGraph';
import {
  lessonRecords as mockLessonRecords,
  lessonDetails as mockLessonDetails,
  lessonGraphs as mockLessonGraphs
} from '../mock/defaultTextbook';
import {
  getLessonRecords,
  getLessonDetail,
  getLessonGraph,
  startLesson,
  completeLesson
} from '../api/lesson';
import {
  explainLesson,
  socraticFollowup,
  generateLessonSummary
} from '../api/ai';
import { getLearningOverview } from '../api/textbook';
import type { LessonRecord, LessonDetail } from '../types/lesson';
import type { LessonGraphData } from '../types/graph';
import type { LearningOverview } from '../types/textbook';

export const Classroom = (): JSX.Element => {
  const [currentLessonId, setCurrentLessonId] = useState<number>(4);
  const [records, setRecords] = useState<LessonRecord[]>(mockLessonRecords);
  const [lessonDetailMap, setLessonDetailMap] = useState<Record<number, LessonDetail>>(mockLessonDetails);
  const [lessonGraphMap, setLessonGraphMap] = useState<Record<number, LessonGraphData>>(mockLessonGraphs);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showCompleteSummary, setShowCompleteSummary] = useState(false);
  const [completeResult, setCompleteResult] = useState<{ summary: string; nextLessonTitle: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [learningOverview, setLearningOverview] = useState<LearningOverview | null>(null);

  // session 初始化锁，防止重复创建
  const sessionInitRef = useRef<Set<number>>(new Set());

  // ========== V0.5: AI 动态对话状态 ==========
  const [chatMessages, setChatMessages] = useState<DynamicMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 初始化：从后端加载课时记录 + 学习概览
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [backendRecords, overview] = await Promise.all([
          getLessonRecords(),
          getLearningOverview()
        ]);
        if (!cancelled) {
          setRecords(backendRecords);
          setLearningOverview(overview);
          // 默认选中 current 课时
          const currentRecord = backendRecords.find(r => r.status === 'current');
          if (currentRecord) {
            setCurrentLessonId(currentRecord.id);
          } else if (backendRecords.length > 0) {
            setCurrentLessonId(backendRecords[backendRecords.length - 1].id);
          }
        }
      } catch (err) {
        console.warn('[Classroom] Failed to load records from backend, fallback to mock.', err);
        if (!cancelled) setRecords(mockLessonRecords);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // 当前课时变化时，加载详情 + 图谱 + 创建 session
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [detail, graph] = await Promise.all([
          getLessonDetail(currentLessonId),
          getLessonGraph(currentLessonId)
        ]);
        if (!cancelled) {
          setLessonDetailMap(prev => ({ ...prev, [currentLessonId]: detail }));
          setLessonGraphMap(prev => ({ ...prev, [currentLessonId]: graph }));
        }
      } catch (err) {
        console.warn(`[Classroom] Failed to load lesson ${currentLessonId} from backend, fallback to mock.`, err);
        if (!cancelled) {
          setLessonDetailMap(prev => ({ ...prev, [currentLessonId]: mockLessonDetails[currentLessonId] ?? mockLessonDetails[4] }));
          setLessonGraphMap(prev => ({ ...prev, [currentLessonId]: mockLessonGraphs[currentLessonId] ?? mockLessonGraphs[4] }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    // 为新课时创建 session（仅当该课时尚未创建过 session 时）
    if (!sessionInitRef.current.has(currentLessonId)) {
      sessionInitRef.current.add(currentLessonId);
      const initSession = async () => {
        try {
          const result = await startLesson(currentLessonId);
          if (!cancelled) setSessionId(result.sessionId);
        } catch (err) {
          console.warn('[Classroom] Failed to start lesson session.', err);
        }
      };
      initSession();
    }

    return () => { cancelled = true; };
  }, [currentLessonId]);

  const currentLesson = useMemo(
    () => lessonDetailMap[currentLessonId] ?? lessonDetailMap[4] ?? mockLessonDetails[4],
    [lessonDetailMap, currentLessonId]
  );

  const currentGraph = useMemo(
    () => lessonGraphMap[currentLessonId] ?? lessonGraphMap[4] ?? mockLessonGraphs[4],
    [lessonGraphMap, currentLessonId]
  );

  const handleSelectLesson = useCallback((lessonId: number) => {
    setCurrentLessonId(lessonId);
    setShowCompleteSummary(false);
    setCompleteResult(null);
    // 切换课时时清空动态对话和旧 session
    setChatMessages([]);
    setStudentInput('');
    setAiError(null);
    setSessionId(null);
    // 清空该课时的 session 初始化标记，让 useEffect 重新创建
    sessionInitRef.current.delete(lessonId);
  }, []);

  const handleCompleteLesson = useCallback(async () => {
    if (sessionId === null) {
      console.warn('[Classroom] Cannot complete lesson: no active session.');
      return;
    }
    try {
      const result = await completeLesson(currentLessonId, {
        sessionId,
        endType: 'early_finish'
      });
      setCompleteResult({
        summary: result.summary,
        nextLessonTitle: result.nextLesson?.title ?? '无'
      });
      setShowCompleteSummary(true);
      // 刷新课时记录
      try {
        const backendRecords = await getLessonRecords();
        setRecords(backendRecords);
        // 如果有下一课，自动选中
        if (result.nextLesson) {
          setCurrentLessonId(result.nextLesson.id);
          setSessionId(null);
          setChatMessages([]);
          setStudentInput('');
          setAiError(null);
          sessionInitRef.current.delete(result.nextLesson.id);
        }
      } catch { /* ignore */ }
    } catch (err) {
      console.warn('[Classroom] Failed to complete lesson.', err);
      alert('完成课时失败，请稍后重试。');
    }
  }, [currentLessonId, sessionId]);

  // ========== V0.5: AI 交互处理 ==========

  /** "继续讲解" */
  const handleExplainMore = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await explainLesson({
        lessonId: currentLessonId,
        sessionId
      });
      const newMsg: DynamicMessage = {
        id: Date.now(),
        role: 'teacher',
        speaker: response.speaker,
        content: response.content,
        fallback: response.fallback
      };
      setChatMessages(prev => [...prev, newMsg]);
    } catch (err: any) {
      console.warn('[Classroom] explainLesson failed:', err);
      setAiError('AI 讲解请求失败，请稍后重试。');
      // 追加本地 fallback 消息
      const fallbackMsg: DynamicMessage = {
        id: Date.now(),
        role: 'teacher',
        speaker: '银发导师',
        content: '当前 AI 服务暂时不可用，请稍后重试。你仍然可以根据本节课脚本和右侧知识图谱继续学习。',
        fallback: true
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setAiLoading(false);
    }
  }, [currentLessonId, sessionId]);

  /** "发送给导师" */
  const handleSendMessage = useCallback(async () => {
    const answer = studentInput.trim();
    if (!answer) return;

    // 先追加学生消息
    const studentMsg: DynamicMessage = {
      id: Date.now(),
      role: 'student',
      speaker: '学生',
      content: answer
    };
    setChatMessages(prev => [...prev, studentMsg]);
    setStudentInput('');
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await socraticFollowup({
        lessonId: currentLessonId,
        sessionId,
        studentAnswer: answer
      });
      const aiMsg: DynamicMessage = {
        id: Date.now() + 1,
        role: 'teacher',
        speaker: response.speaker,
        content: response.content,
        fallback: response.fallback
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('[Classroom] socraticFollowup failed:', err);
      setAiError('AI 追问请求失败，请稍后重试。');
      const fallbackMsg: DynamicMessage = {
        id: Date.now() + 1,
        role: 'teacher',
        speaker: '银发导师',
        content: '当前 AI 服务暂时不可用，请稍后重试。你仍然可以根据本节课脚本和右侧知识图谱继续学习。',
        fallback: true
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setAiLoading(false);
    }
  }, [currentLessonId, sessionId, studentInput]);

  /** "生成课堂总结" */
  const handleGenerateSummary = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await generateLessonSummary({
        lessonId: currentLessonId,
        sessionId
      });
      const newMsg: DynamicMessage = {
        id: Date.now(),
        role: 'teacher',
        speaker: response.speaker,
        content: response.content,
        fallback: response.fallback
      };
      setChatMessages(prev => [...prev, newMsg]);
    } catch (err: any) {
      console.warn('[Classroom] generateLessonSummary failed:', err);
      setAiError('AI 总结请求失败，请稍后重试。');
      const fallbackMsg: DynamicMessage = {
        id: Date.now(),
        role: 'teacher',
        speaker: '银发导师',
        content: '当前 AI 服务暂时不可用，请稍后重试。你仍然可以根据本节课脚本和右侧知识图谱继续学习。',
        fallback: true
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setAiLoading(false);
    }
  }, [currentLessonId, sessionId]);

  const isLoading = loading && !currentLesson;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* 顶部信息栏 */}
      <div className="flex-shrink-0 mx-4 mt-4 mb-3 min-h-[74px] flex flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-[24px] border border-shelf-line/90 bg-shelf-panel/80 shadow-shelf-sm backdrop-blur">
        {/* 左侧品牌 */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            to="/home"
            className="w-[42px] h-[42px] grid place-items-center rounded-[14px] bg-[#f4e6d1] border border-shelf-line text-shelf-ink font-black transition hover:-translate-y-0.5 hover:shadow-shelf-sm"
            title="返回教材书架"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-shelf-ink tracking-wide">课程</h1>
            <p className="text-xs text-shelf-muted">
              这是所选教材下的课程页，左侧查看课时记录，中间进行课堂对话，右侧查看本课知识图谱。
            </p>
          </div>
        </div>

        {/* 中间课时信息 */}
        <div className="flex-1 min-w-[240px] text-center">
          <strong className="block text-lg text-shelf-ink">{currentLesson.title}</strong>
          <span className="block text-xs text-shelf-muted">{currentLesson.objective}</span>
        </div>

        {/* 右侧状态 */}
        <div className="flex items-center justify-end gap-2.5 min-w-0 flex-wrap">
          <div className="rounded-full border border-shelf-line/90 bg-shelf-panel px-3 py-2 text-xs text-shelf-muted whitespace-nowrap">
            课程：<strong className="text-shelf-ink">{currentLesson.courseName}</strong>
          </div>
          <div className="rounded-full border border-shelf-line/90 bg-shelf-panel px-3 py-2 text-xs text-shelf-muted whitespace-nowrap">
            已点亮：<strong className="text-shelf-ink">{learningOverview?.illuminatedCount ?? 0} / {learningOverview?.totalKnowledgeCount ?? 0}</strong>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-shelf-muted text-lg">加载中...</p>
        </div>
      ) : (
        /* 三栏内容区 */
        <div className="flex-1 grid grid-cols-1 gap-[18px] px-4 pb-4 min-h-0 xl:grid-cols-[260px_minmax(420px,1fr)_350px] 2xl:grid-cols-[280px_minmax(460px,1fr)_390px]">
          {/* 左侧：课程记录 */}
          <aside className="rounded-[26px] border border-shelf-line/90 bg-shelf-panel/80 shadow-shelf-sm overflow-hidden xl:order-1">
            <LessonRecordList
              records={records}
              currentLessonId={currentLessonId}
              onSelectLesson={handleSelectLesson}
            />
          </aside>

          {/* 中间：课堂对话 */}
          <main className="rounded-[26px] border border-shelf-line/90 bg-shelf-panel/80 shadow-shelf-sm overflow-hidden min-w-0 xl:order-2">
            <ClassroomChat
              lesson={currentLesson}
              additionalMessages={chatMessages}
              studentInput={studentInput}
              onStudentInputChange={setStudentInput}
              onSendMessage={handleSendMessage}
              onExplainMore={handleExplainMore}
              onGenerateSummary={handleGenerateSummary}
              aiLoading={aiLoading}
              aiError={aiError}
              showCompleteSummary={showCompleteSummary}
              completeResult={completeResult}
              onComplete={handleCompleteLesson}
            />
          </main>

          {/* 右侧：局部知识图谱 */}
          <aside className="rounded-[26px] border border-shelf-line/90 bg-shelf-panel/80 shadow-shelf-sm overflow-hidden xl:order-3">
            <LessonKnowledgeGraph graphData={currentGraph} />
          </aside>
        </div>
      )}
    </div>
  );
};
