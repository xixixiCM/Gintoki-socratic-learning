import React from 'react';
import { TextbookCard } from './TextbookCard';
import { PreparationPanel } from './PreparationPanel';
import { learningOverview } from '../mock/defaultTextbook';
import type { DefaultTextbook, PreparationResult, PrepareStatus } from '../types/textbook';

interface TextbookShelfProps {
  textbook: DefaultTextbook;
  prepareStatus: PrepareStatus;
  currentStep: number;
  preparationResult: PreparationResult | null;
  onPrepare: () => void;
  onEnterClassroom: () => void;
}

export const TextbookShelf: React.FC<TextbookShelfProps> = ({
  textbook,
  prepareStatus,
  currentStep,
  preparationResult,
  onPrepare,
  onEnterClassroom
}) => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 页面标题 + 学习状态 */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Textbook Shelf</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">教材书架</h1>
        </div>

        {/* 右上角：当前学习状态 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-slate-500">当前学习状态</p>
          <div className="mt-1 space-y-1 text-sm">
            <div>
              <span className="text-slate-400">课程：</span>
              <span className="text-white">{learningOverview.courseName}</span>
            </div>
            <div>
              <span className="text-slate-400">课时：</span>
              <span className="text-cyan-300">{learningOverview.currentLessonName}</span>
            </div>
            <div>
              <span className="text-slate-400">已点亮：</span>
              <span className="text-white">{learningOverview.illuminatedCount} / {learningOverview.totalKnowledgeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主区域：教材卡片 + 备课面板 / 添加教材 */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* 左侧：教材卡片 */}
        <TextbookCard
          textbook={textbook}
          prepareStatus={prepareStatus}
          preparationResult={preparationResult}
          onPrepare={onPrepare}
          onEnterClassroom={onEnterClassroom}
        />

        {/* 右侧：备课面板 或 添加教材占位 */}
        <div className="space-y-6">
          {prepareStatus !== 'idle' ? (
            <PreparationPanel
              prepareStatus={prepareStatus}
              currentStep={currentStep}
              preparationResult={preparationResult}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center backdrop-blur">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
                <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-400">添加教材</p>
              <p className="mt-1 text-xs text-slate-600">
                当前仅支持默认体验教材，上传功能敬请期待
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
