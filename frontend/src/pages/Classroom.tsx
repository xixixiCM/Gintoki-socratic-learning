import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { LessonRecordList } from '../components/LessonRecordList';
import { ClassroomChat } from '../components/ClassroomChat';
import { LessonKnowledgeGraph } from '../components/LessonKnowledgeGraph';
import { lessonRecords, lessonDetails, lessonGraphs } from '../mock/defaultTextbook';

export const Classroom = (): JSX.Element => {
  const [currentLessonId, setCurrentLessonId] = useState<number>(4); // 默认当前课时

  const currentLesson = useMemo(
    () => lessonDetails[currentLessonId] ?? lessonDetails[4],
    [currentLessonId]
  );

  const currentGraph = useMemo(
    () => lessonGraphs[currentLessonId] ?? lessonGraphs[4],
    [currentLessonId]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 左侧：课程记录 */}
      <aside className="w-72 flex-shrink-0 border-r border-white/10 bg-slate-950/50 backdrop-blur">
        <LessonRecordList
          records={lessonRecords}
          currentLessonId={currentLessonId}
          onSelectLesson={setCurrentLessonId}
        />
      </aside>

      {/* 中间：课堂对话 */}
      <main className="flex-1 bg-slate-950/30">
        <ClassroomChat lesson={currentLesson} />
      </main>

      {/* 右侧：局部知识图谱 */}
      <aside className="w-80 flex-shrink-0 border-l border-white/10 bg-slate-950/50 backdrop-blur">
        <LessonKnowledgeGraph graphData={currentGraph} />
      </aside>

      {/* 返回书架按钮 */}
      <Link
        to="/"
        className="fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 backdrop-blur transition hover:bg-slate-800"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回书架
      </Link>
    </div>
  );
};
