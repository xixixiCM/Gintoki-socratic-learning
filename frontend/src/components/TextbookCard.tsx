import React from 'react';
import type { DefaultTextbook, PreparationResult, PrepareStatus } from '../types/textbook';

interface TextbookCardProps {
  textbook: DefaultTextbook;
  prepareStatus: PrepareStatus;
  preparationResult: PreparationResult | null;
  onPrepare: () => void;
  onEnterClassroom: () => void;
}

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

  const isPrepared = prepareStatus === 'done';

  return (
    <div className="group relative">
      {/* 书本主体 */}
<div className="relative z-20 w-60 h-[360px] -rotate-1 transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-2">
  {/* 书脊阴影 */}
  <div className="absolute left-3.5 -right-3 -bottom-4 h-5 bg-shelf-shadow/25 blur-lg rounded-[50%] -z-10" />

  {/* 书封面 */}
  <div
    className="relative h-full rounded-r-2xl rounded-l-xl overflow-hidden shadow-book"
    style={{
      background:
        'linear-gradient(90deg, rgba(0,0,0,0.24), transparent 15%), linear-gradient(145deg, #315878 0%, #23384f 48%, #17283b 100%)'
    }}
  >
    {/* 内边框装饰 */}
    <div className="absolute inset-[18px] border border-shelf-gold-light/45 rounded-r-xl rounded-l-md pointer-events-none" />

    {/* 封面内容 */}
    <div
      className="relative h-full flex flex-col px-6 pt-5 pb-5"
      style={{ paddingLeft: '34px' }}
    >
      {/* 徽章 */}
      <span className="inline-flex items-center self-start rounded-full border border-shelf-gold-light/70 bg-black/15 px-2.5 py-1 text-xs text-shelf-gold-light mb-4">
        体验教材 · 默认课程
      </span>

      {/* 书名 */}
      <h3 className="text-[27px] font-bold text-white leading-tight tracking-wide mb-3">
        机器学习入门
      </h3>

      <p className="text-sm text-white/80 mb-4">
        AI 虚拟导师模拟课堂
      </p>

      {/* 信息卡片 */}
      <div className="mt-auto space-y-2">
        <div className="rounded-xl bg-white/10 border border-white/10 backdrop-blur px-3 py-2">
          <small className="block text-shelf-gold-light/90 text-[11px] mb-1">
            当前课程名称
          </small>
          <strong className="block text-sm font-bold text-white">
            {textbook.courseName}
          </strong>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/10 backdrop-blur px-3 py-2">
          <small className="block text-shelf-gold-light/90 text-[11px] mb-1">
            当前课时名称
          </small>
          <strong className="block text-sm font-bold text-white">
            {textbook.currentLessonName}
          </strong>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/10 backdrop-blur px-3 py-2">
          <small className="block text-shelf-gold-light/90 text-[11px] mb-1">
            已点亮知识点
          </small>
          <strong className="block text-sm font-bold text-white">
            {textbook.illuminatedCount} / {textbook.totalKnowledgeCount} 个
          </strong>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* 备课摘要（备课完成后显示在书旁边） */}
      {isPrepared && preparationResult !== null && (
        <div className="absolute -right-64 top-6 w-56 rounded-2xl border border-shelf-line bg-shelf-panel/90 p-4 shadow-shelf-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wider text-shelf-green mb-3">✓ 备课完成</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-shelf-muted">课时</span><span className="font-bold">{preparationResult.lessonCount} 节</span></div>
            <div className="flex justify-between"><span className="text-shelf-muted">知识点</span><span className="font-bold">{preparationResult.nodeCount} 个</span></div>
            <div className="flex justify-between"><span className="text-shelf-muted">关系</span><span className="font-bold">{preparationResult.relationCount} 条</span></div>
            <div className="flex justify-between"><span className="text-shelf-muted">脚本</span><span className="font-bold">{preparationResult.scriptCount} 份</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
