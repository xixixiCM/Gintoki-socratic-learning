import React from 'react';
import type { LessonRecord } from '../types/lesson';

interface LessonRecordListProps {
  records: LessonRecord[];
  currentLessonId: number;
  onSelectLesson: (lessonId: number) => void;
}

const statusBadge = (status: string) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
        已完成
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-medium text-cyan-300">
      进行中
    </span>
  );
};

export const LessonRecordList: React.FC<LessonRecordListProps> = ({
  records,
  currentLessonId,
  onSelectLesson
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">课程记录</p>
        <h3 className="mt-1 text-base font-semibold text-white">机器学习入门</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {records.map((record) => {
          const isActive = record.id === currentLessonId;

          return (
            <button
              key={record.id}
              onClick={() => onSelectLesson(record.id)}
              className={`w-full border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/5 ${
                isActive ? 'border-l-2 border-l-cyan-400 bg-cyan-500/10' : ''
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  第 {record.lessonOrder} 课
                </span>
                {statusBadge(record.status)}
              </div>
              <p className={`text-sm font-semibold ${isActive ? 'text-cyan-200' : 'text-white'}`}>
                {record.title}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span>⏱ {record.usedTime}</span>
                <span>📖 {record.textbookPages}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                {record.summary}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
