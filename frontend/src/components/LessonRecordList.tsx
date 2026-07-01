import React from 'react';
import type { LessonRecord } from '../types/lesson';

interface LessonRecordListProps {
  records: LessonRecord[];
  currentLessonId: number;
  onSelectLesson: (lessonId: number) => void;
}

export const LessonRecordList: React.FC<LessonRecordListProps> = ({
  records,
  currentLessonId,
  onSelectLesson
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-shelf-line/70 px-5 py-4 bg-shelf-panel/70">
        <h2 className="text-lg font-bold text-shelf-ink">课程记录</h2>
        <p className="mt-1 text-xs text-shelf-muted leading-relaxed">
          只显示已完成课时和当前课，不提前展示后续课程。
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {records.map((record) => {
          const isActive = record.id === currentLessonId;
          const isCompleted = record.status === 'completed';

          return (
            <button
              key={record.id}
              onClick={() => onSelectLesson(record.id)}
              className={`w-full text-left px-3.5 py-3.5 rounded-[18px] border transition-all font-[inherit] cursor-pointer ${
                isActive
                  ? 'border-shelf-gold bg-gradient-to-br from-[#fff6e6] to-[#f6e2c4] shadow-[inset_4px_0_0_#c98a2e,0_12px_24px_rgba(72,45,22,0.12)]'
                  : isCompleted
                    ? 'border-shelf-line/90 bg-shelf-green-soft/60 text-shelf-ink'
                    : 'border-shelf-line/90 bg-shelf-panel/80 text-shelf-ink'
              } hover:-translate-y-0.5 hover:shadow-shelf-sm transition-transform`}
            >
              <div className="flex items-center justify-between gap-3 mb-2 text-xs text-shelf-muted">
                <span>第 {record.lessonOrder} 课</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isCompleted
                    ? 'bg-shelf-green/10 text-shelf-green'
                    : 'bg-shelf-gold/10 text-[#9b651c]'
                }`}>
                  {isCompleted ? '已完成' : '当前课'}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-shelf-ink leading-snug mb-1.5">{record.title}</h3>
              <div className="space-y-1 pt-2.5 border-t border-dashed border-shelf-line/80 text-xs text-shelf-muted">
                <div className="flex justify-between gap-2">
                  <span>主题</span>
                  <em className="not-italic text-shelf-ink font-bold text-right">{record.summary.slice(0, 20)}...</em>
                </div>
                <div className="flex justify-between gap-2">
                  <span>{isCompleted ? '课堂用时' : '已用时间'}</span>
                  <em className="not-italic text-shelf-ink font-bold text-right">{record.usedTime}</em>
                </div>
                <div className="flex justify-between gap-2">
                  <span>{isCompleted ? '教材页数' : '本课教材'}</span>
                  <em className="not-italic text-shelf-ink font-bold text-right">{record.textbookPages}</em>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
