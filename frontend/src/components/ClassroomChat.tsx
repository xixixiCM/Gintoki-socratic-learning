import React, { useEffect, useRef } from 'react';
import type { LessonDetail, LessonMessage } from '../types/lesson';

interface ClassroomChatProps {
  lesson: LessonDetail;
}

const TeacherBubble: React.FC<{ message: LessonMessage }> = ({ message }) => (
  <div className="flex gap-3">
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-slate-950">
      师
    </div>
    <div className="max-w-[80%]">
      <p className="mb-1 text-xs font-semibold text-cyan-300">{message.speaker}</p>
      <div className="rounded-2xl rounded-tl-sm border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-200">{message.content}</p>
      </div>
    </div>
  </div>
);

const StudentBubble: React.FC<{ message: LessonMessage }> = ({ message }) => (
  <div className="flex flex-row-reverse gap-3">
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-400 text-xs font-bold text-white">
      生
    </div>
    <div className="max-w-[80%]">
      <p className="mb-1 text-right text-xs font-semibold text-slate-400">{message.speaker}</p>
      <div className="rounded-2xl rounded-tr-sm border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-300">{message.content}</p>
      </div>
    </div>
  </div>
);

export const ClassroomChat: React.FC<ClassroomChatProps> = ({ lesson }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lesson.id]);

  return (
    <div className="flex h-full flex-col">
      {/* 课时标题栏 */}
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">课堂对话</p>
        <h3 className="mt-1 text-base font-semibold text-white">{lesson.title}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>🎯 {lesson.objective}</span>
          <span>📖 {lesson.textbookPages}</span>
          <span>
            ⏱ {lesson.usedTime} / {lesson.maxTime}
          </span>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-6">
          {lesson.messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'teacher' ? (
                <TeacherBubble message={msg} />
              ) : (
                <StudentBubble message={msg} />
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 底部提示 */}
      <div className="border-t border-white/10 px-5 py-3">
        <p className="text-center text-xs text-slate-600">
          以上为模拟课堂对话，真实 AI 追问功能将在后续版本接入
        </p>
      </div>
    </div>
  );
};
