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

  // 排除最后一步"备课完成"，它由底部摘要卡片展示
  const processSteps = prepareSteps.slice(0, -1);
  const isComplete = prepareStatus === 'done';
  const isFailed = prepareStatus === 'failed';

  return (
    <div className="rounded-[30px] border border-shelf-line/90 bg-shelf-panel/80 p-6 shadow-shelf-sm backdrop-blur">
      <h3 className="mb-6 text-lg font-bold text-shelf-ink">
        {isComplete ? '✅ AI 备课流程' : isFailed ? '❌ AI 备课失败' : 'AI 备课进行中…'}
      </h3>

      {/* 失败提示 */}
      {isFailed && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">备课任务执行失败</p>
          <p className="mt-1 text-xs text-red-500">
            请检查后端日志后重试。可能是 AI 接口调用异常或数据格式问题。
          </p>
          <p className="mt-2 text-xs text-red-400">
            提示：点击「AI 备课」按钮可重新开始。
          </p>
        </div>
      )}

      {/* 步骤列表 */}
      <div className="space-y-3">
        {processSteps.map((step, index) => {
          const isDone = isComplete || index < currentStep;
          const isCurrent = !isComplete && !isFailed && index === currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                isCurrent
                  ? 'bg-shelf-gold/10 border border-shelf-gold/30 text-shelf-ink'
                  : isDone
                    ? 'text-shelf-muted'
                    : isFailed && index === currentStep
                      ? 'bg-red-50 border border-red-200 text-red-600'
                      : 'text-shelf-muted/40'
              }`}
            >
              {/* 状态图标 */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <svg className="h-5 w-5 text-shelf-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isFailed && index === currentStep ? (
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : isCurrent ? (
                  <svg className="h-5 w-5 animate-spin text-shelf-gold" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-shelf-muted/30" />
                )}
              </div>

              {/* 步骤文字 */}
              <span className={`text-sm ${isCurrent ? 'font-semibold' : ''}`}>
                {step}
              </span>

              {/* 当前步骤提示 */}
              {isCurrent && !isComplete && !isFailed && (
                <span className="ml-auto text-xs text-shelf-gold/70 animate-pulse">
                  等待 AI 响应…
                </span>
              )}

              {/* 失败步骤提示 */}
              {isFailed && index === currentStep && (
                <span className="ml-auto text-xs text-red-500">
                  执行失败
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 备课完成摘要 */}
      {isComplete && preparationResult !== null && (
        <div className="mt-6 rounded-2xl border border-shelf-green/30 bg-shelf-green-soft/60 p-4">
          <p className="mb-1 text-sm font-semibold text-shelf-green">🎉 备课完成！</p>
          <p className="text-xs text-shelf-muted">
            已生成 {preparationResult.lessonCount} 节课时，{preparationResult.nodeCount} 个知识点，
            {preparationResult.relationCount} 条知识关系，{preparationResult.scriptCount} 份课堂脚本。
          </p>
        </div>
      )}
    </div>
  );
};
