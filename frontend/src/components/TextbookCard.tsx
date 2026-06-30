import React from 'react';
import type { DefaultTextbook, PreparationResult, PrepareStatus } from '../types/textbook';

interface TextbookCardProps {
  textbook: DefaultTextbook;
  prepareStatus: PrepareStatus;
  preparationResult: PreparationResult | null;
  onPrepare: () => void;
  onEnterClassroom: () => void;
}

const statusLabelMap: Record<string, string> = {
  idle: '未备课',
  not_prepared: '未备课',
  preparing: '备课中...',
  done: '已备课',
  prepared: '已备课'
};

const statusColorMap: Record<string, string> = {
  idle: 'bg-slate-600 text-slate-300',
  not_prepared: 'bg-slate-600 text-slate-300',
  preparing: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  done: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  prepared: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
};

export const TextbookCard: React.FC<TextbookCardProps> = ({
  textbook,
  prepareStatus,
  preparationResult,
  onPrepare,
  onEnterClassroom
}) => {
  const progressPercent = textbook.totalKnowledgeCount > 0
    ? Math.round((textbook.illuminatedCount / textbook.totalKnowledgeCount) * 100)
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-6 shadow-2xl backdrop-blur transition hover:border-cyan-400/30">
      {/* 状态标签 */}
      <div className="mb-4 flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColorMap[prepareStatus] ?? statusColorMap.not_prepared}`}>
          {statusLabelMap[prepareStatus] ?? '未知'}
        </span>
        <span className="text-xs text-slate-400">
          已点亮知识点：{textbook.illuminatedCount} / {textbook.totalKnowledgeCount}
        </span>
      </div>

      {/* 教材信息 */}
      <h3 className="mb-1 text-xl font-bold text-white">{textbook.title}</h3>
      <p className="mb-4 text-sm text-slate-400">默认体验教材</p>

      <div className="mb-6 space-y-2 text-sm text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">当前课程</span>
          <span>{textbook.courseName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">当前课时</span>
          <span className="text-cyan-300">{textbook.currentLessonName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">教材页数</span>
          <span>{textbook.totalPages} 页</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>学习进度</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 备课结果摘要 */}
      {preparationResult !== null && prepareStatus === 'done' && (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">备课完成</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">课时</span>
              <span>{preparationResult.lessonCount} 节</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">知识点</span>
              <span>{preparationResult.nodeCount} 个</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">关系</span>
              <span>{preparationResult.relationCount} 条</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">脚本</span>
              <span>{preparationResult.scriptCount} 份</span>
            </div>
          </div>
        </div>
      )}

      {/* 按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onPrepare}
          disabled={prepareStatus === 'preparing'}
          className="flex-1 rounded-full bg-cyan-500/20 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prepareStatus === 'preparing' ? '备课中...' : 'AI 备课'}
        </button>
        <button
          onClick={onEnterClassroom}
          className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          进入体验教材
        </button>
      </div>
    </div>
  );
};
