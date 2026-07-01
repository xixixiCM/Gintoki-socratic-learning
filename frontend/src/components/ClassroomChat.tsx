import React, { useEffect, useRef } from 'react';
import type { LessonDetail, LessonMessage } from '../types/lesson';

// ========== Extended message for dynamic AI conversation ==========

export interface DynamicMessage {
  id: number;
  role: 'teacher' | 'student';
  speaker: string;
  content: string;
  fallback?: boolean;
}

interface ClassroomChatProps {
  lesson: LessonDetail;
  /** 动态追加的消息（学生输入 + AI 返回） */
  additionalMessages?: DynamicMessage[];
  /** 学生输入框内容 */
  studentInput?: string;
  /** 输入框变化回调 */
  onStudentInputChange?: (value: string) => void;
  /** "发送给导师" 回调 */
  onSendMessage?: () => void;
  /** "继续讲解" 回调 */
  onExplainMore?: () => void;
  /** "生成课堂总结" 回调 */
  onGenerateSummary?: () => void;
  /** AI 是否正在加载 */
  aiLoading?: boolean;
  /** AI 错误信息 */
  aiError?: string | null;
  showCompleteSummary?: boolean;
  completeResult?: { summary: string; nextLessonTitle: string } | null;
  onComplete?: () => void;
}

// ========== Message bubbles ==========

const TeacherBubble: React.FC<{ message: LessonMessage | DynamicMessage; fallback?: boolean }> = ({ message, fallback }) => (
  <div className="flex gap-3 max-w-[86%]">
    <div className="w-[38px] h-[38px] flex-shrink-0 grid place-items-center rounded-[14px] bg-[#ead2ad] border border-shelf-line text-[17px] font-black text-shelf-ink">
      银
    </div>
    <div>
      <span className="block mb-1 text-xs font-bold text-shelf-muted">{message.speaker}</span>
      <div className={`rounded-[18px] border px-[15px] py-3 shadow-[0_8px_18px_rgba(72,45,22,0.07)] ${
        fallback ? 'border-amber-300/80 bg-amber-50/90' : 'border-shelf-line/85 bg-white/80'
      }`}>
        <p className="text-sm leading-relaxed text-shelf-ink">{message.content}</p>
        {fallback && (
          <span className="inline-block mt-1.5 text-[11px] text-amber-600 bg-amber-100/70 rounded-full px-2 py-0.5">
            AI 服务暂时不可用，已使用基础提示
          </span>
        )}
      </div>
    </div>
  </div>
);

const StudentBubble: React.FC<{ message: LessonMessage | DynamicMessage }> = ({ message }) => (
  <div className="flex flex-row-reverse gap-3 max-w-[86%] self-end">
    <div className="w-[38px] h-[38px] flex-shrink-0 grid place-items-center rounded-[14px] bg-shelf-blue-soft border border-shelf-blue/20 text-[17px] font-black text-shelf-blue">
      生
    </div>
    <div>
      <span className="block mb-1 text-xs font-bold text-shelf-muted text-right">{message.speaker}</span>
      <div className="rounded-[18px] border border-shelf-blue/20 bg-shelf-blue-soft px-[15px] py-3 shadow-[0_8px_18px_rgba(72,45,22,0.07)]">
        <p className="text-sm leading-relaxed text-shelf-ink">{message.content}</p>
      </div>
    </div>
  </div>
);

// ========== Loading indicator ==========

const LoadingBubble: React.FC = () => (
  <div className="flex gap-3 max-w-[86%]">
    <div className="w-[38px] h-[38px] flex-shrink-0 grid place-items-center rounded-[14px] bg-[#ead2ad] border border-shelf-line text-[17px] font-black text-shelf-ink">
      银
    </div>
    <div>
      <span className="block mb-1 text-xs font-bold text-shelf-muted">银发导师</span>
      <div className="rounded-[18px] border border-shelf-line/85 bg-white/80 px-[15px] py-4 shadow-[0_8px_18px_rgba(72,45,22,0.07)]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-shelf-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="inline-block w-2 h-2 rounded-full bg-shelf-ink/40 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="inline-block w-2 h-2 rounded-full bg-shelf-ink/40 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-xs text-shelf-muted ml-1">思考中...</span>
        </div>
      </div>
    </div>
  </div>
);

// ========== Main component ==========

export const ClassroomChat: React.FC<ClassroomChatProps> = ({
  lesson,
  additionalMessages = [],
  studentInput = '',
  onStudentInputChange,
  onSendMessage,
  onExplainMore,
  onGenerateSummary,
  aiLoading = false,
  aiError = null,
  showCompleteSummary,
  completeResult,
  onComplete
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lesson.id, additionalMessages.length, showCompleteSummary, aiLoading]);

  const allMessages = [...lesson.messages, ...additionalMessages];

  return (
    <div className="flex h-full flex-col">
      {/* 课时标题栏 */}
      <div className="border-b border-shelf-line/70 px-5 py-5 bg-gradient-to-r from-shelf-panel/90 to-shelf-panel/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-shelf-ink mb-2">{lesson.title}</h2>
            <p className="text-[13px] text-shelf-muted leading-relaxed">
              本节目标：{lesson.objective}
            </p>
          </div>
          <div className="min-w-[140px] rounded-[18px] border border-shelf-line/90 bg-shelf-panel px-3.5 py-3 text-center">
            <small className="block text-xs text-shelf-muted mb-1">课堂时间</small>
            <strong className="block text-lg text-shelf-ink">{lesson.usedTime} / {lesson.maxTime}</strong>
          </div>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
        style={{
          background: 'radial-gradient(circle at 16% 10%, rgba(255,255,255,0.7), transparent 22%), rgba(255,250,241,0.58)'
        }}
      >
        {allMessages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {msg.role === 'teacher' ? (
              <TeacherBubble message={msg} fallback={('fallback' in msg ? (msg as DynamicMessage).fallback : undefined)} />
            ) : (
              <div className="flex justify-end">
                <StudentBubble message={msg} />
              </div>
            )}
          </div>
        ))}

        {/* AI 加载中 */}
        {aiLoading && <LoadingBubble />}

        {/* AI 错误提示 */}
        {aiError && !aiLoading && (
          <div className="mx-auto max-w-[90%] rounded-[16px] border border-red-200 bg-red-50/80 px-4 py-3">
            <p className="text-sm text-red-600">{aiError}</p>
            <p className="text-xs text-red-400 mt-1">当前 AI 服务暂时不可用，请稍后重试。你仍然可以根据本节课脚本和右侧知识图谱继续学习。</p>
          </div>
        )}

        {/* 完成课时总结 */}
        {showCompleteSummary && completeResult && (
          <div className="mx-auto max-w-[90%] my-6 rounded-[20px] border border-shelf-green/30 bg-shelf-green-soft/60 p-5">
            <p className="text-base font-bold text-shelf-green mb-2">🎉 本课已完成！</p>
            <p className="text-sm text-shelf-muted mb-2">{completeResult.summary}</p>
            <p className="text-xs text-shelf-muted">
              下一课：<strong className="text-shelf-ink">{completeResult.nextLessonTitle}</strong>
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 底部操作区 */}
      <div className="border-t border-shelf-line/70 bg-shelf-panel/80 px-4 py-4">
        <div className="flex gap-3 items-center">
          <input
            className="flex-1 h-11 rounded-[14px] border border-shelf-line bg-white/70 px-4 text-shelf-ink font-[inherit] outline-none text-sm placeholder:text-shelf-muted/60 transition focus:border-shelf-wood/50 focus:bg-white"
            placeholder="输入你的回答或想法..."
            value={studentInput}
            onChange={e => onStudentInputChange?.(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage?.();
              }
            }}
            disabled={aiLoading || showCompleteSummary}
          />
          <button
            type="button"
            onClick={onSendMessage}
            disabled={aiLoading || showCompleteSummary || !studentInput.trim()}
            className={`h-11 rounded-[14px] font-bold px-5 text-sm shadow-[0_10px_18px_rgba(92,57,34,0.22)] transition ${
              aiLoading || showCompleteSummary || !studentInput.trim()
                ? 'bg-shelf-muted/30 text-shelf-muted cursor-not-allowed'
                : 'bg-gradient-to-br from-shelf-wood to-shelf-wood-dark text-shelf-panel cursor-pointer hover:brightness-110'
            }`}
          >
            发送给导师
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-3">
          <button
            type="button"
            onClick={onExplainMore}
            disabled={aiLoading || showCompleteSummary}
            className={`rounded-[14px] border font-bold h-11 px-4 text-sm transition ${
              aiLoading || showCompleteSummary
                ? 'border-shelf-line/50 bg-shelf-panel/50 text-shelf-muted cursor-not-allowed'
                : 'border-shelf-line bg-shelf-panel text-shelf-ink cursor-pointer hover:bg-shelf-panel/90 hover:shadow-md'
            }`}
          >
            继续讲解
          </button>
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={aiLoading || showCompleteSummary}
            className={`rounded-[14px] border font-bold h-11 px-4 text-sm transition ${
              aiLoading || showCompleteSummary
                ? 'border-shelf-line/50 bg-shelf-panel/50 text-shelf-muted cursor-not-allowed'
                : 'border-shelf-line bg-shelf-panel text-shelf-ink cursor-pointer hover:bg-shelf-panel/90 hover:shadow-md'
            }`}
          >
            生成课堂总结
          </button>
          <button
            type="button"
            onClick={onComplete}
            disabled={showCompleteSummary}
            className={`rounded-[14px] font-bold h-11 px-4 text-sm shadow-[0_10px_18px_rgba(92,57,34,0.22)] transition ${
              showCompleteSummary
                ? 'bg-shelf-muted/30 text-shelf-muted cursor-default'
                : 'bg-gradient-to-br from-shelf-gold to-[#9b651c] text-white cursor-pointer hover:brightness-110'
            }`}
          >
            {showCompleteSummary ? '已完成' : '提前结束本课'}
          </button>
        </div>
      </div>
    </div>
  );
};
