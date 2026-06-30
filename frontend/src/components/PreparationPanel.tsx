import React from 'react';
import { prepareSteps } from '../mock/defaultTextbook';
import type { PreparationResult, PrepareStatus } from '../types/textbook';

interface PreparationPanelProps {
  prepareStatus: PrepareStatus;
  currentStep: number;
  preparationResult: PreparationResult | null;
}

export const PreparationPanel: React.FC<PreparationPanelProps> = ({
  prepareStatus,
  currentStep,
  preparationResult
}) => {
  if (prepareStatus === 'idle') return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 shadow-2xl backdrop-blur">
      <h3 className="mb-6 text-lg font-bold text-white">AI 备课流程</h3>

      {/* 步骤列表 */}
      <div className="space-y-3">
        {prepareSteps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === prepareSteps.length - 1;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                isCurrent
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                  : isDone
                    ? 'text-slate-400'
                    : 'text-slate-600'
              }`}
            >
              {/* 状态图标 */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <svg className="h-5 w-5 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
                )}
              </div>

              {/* 步骤文字 */}
              <span className={`text-sm ${isCurrent ? 'font-semibold' : ''}`}>
                {step}
              </span>

              {/* 完成标记 */}
              {isDone && !isLast && (
                <div className="ml-auto h-0.5 w-8 rounded bg-emerald-500/30" />
              )}
            </div>
          );
        })}
      </div>

      {/* 备课完成摘要 */}
      {prepareStatus === 'done' && preparationResult !== null && (
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="mb-1 text-sm font-semibold text-emerald-300">🎉 备课完成！</p>
          <p className="text-xs text-slate-400">
            已生成 {preparationResult.lessonCount} 节课时，{preparationResult.nodeCount} 个知识点，
            {preparationResult.relationCount} 条知识关系，{preparationResult.scriptCount} 份课堂脚本。
          </p>
        </div>
      )}
    </div>
  );
};
