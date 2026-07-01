import React from 'react';
import { TextbookCard } from './TextbookCard';
import { PreparationPanel } from './PreparationPanel';
import type { DefaultTextbook, LearningOverview, PreparationResult, PrepareStatus } from '../types/textbook';

interface TextbookShelfProps {
  textbook: DefaultTextbook;
  prepareStatus: PrepareStatus;
  currentStep: number;
  preparationResult: PreparationResult | null;
  learningOverview: LearningOverview;
  onPrepare: () => void;
  onEnterClassroom: () => void;
}

export const TextbookShelf: React.FC<TextbookShelfProps> = ({
  textbook,
  prepareStatus,
  currentStep,
  preparationResult,
  learningOverview,
  onPrepare,
  onEnterClassroom
}) => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 页头 */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold text-shelf-ink tracking-wide">教材书架</h1>
          <p className="mt-2 text-shelf-muted text-[15px] leading-relaxed">
            教材作为系统内部备课资料，用户从书架选择课程进入 AI 模拟课堂。
          </p>
        </div>

        {/* 右上角：当前学习状态 */}
        <div className="rounded-[18px] border border-shelf-line/90 bg-shelf-panel/80 px-5 py-4 shadow-shelf-sm min-w-[300px]">
          <p className="text-[13px] text-shelf-muted mb-2.5">当前学习状态</p>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4 text-[13px] py-1.5 border-t border-shelf-line/60 first:border-t-0 first:pt-0">
              <span className="text-shelf-muted">课程名称</span>
              <strong className="text-shelf-ink text-sm text-right max-w-[176px]">{learningOverview.courseName}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[13px] py-1.5 border-t border-shelf-line/60 first:border-t-0 first:pt-0">
              <span className="text-shelf-muted">当前课时</span>
              <strong className="text-shelf-ink text-sm text-right max-w-[176px]">{learningOverview.currentLessonName}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[13px] py-1.5 border-t border-shelf-line/60 first:border-t-0 first:pt-0">
              <span className="text-shelf-muted">已点亮</span>
              <strong className="text-shelf-ink text-lg text-right">{learningOverview.illuminatedCount} / {learningOverview.totalKnowledgeCount} 个知识点</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 书架场景 */}
      <div className="relative min-h-[560px] rounded-[30px] border border-shelf-line bg-gradient-to-b from-shelf-panel/70 to-shelf-panel/45 shadow-shelf overflow-hidden"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(139,90,52,0.08) 0 2px, transparent 2px 36px)',
        }}
      >
        {/* 顶部光晕 */}
        <div className="absolute inset-0 bg-radial from-white/85 to-transparent pointer-events-none"
          style={{ background: 'radial-gradient(circle at 72% 10%, rgba(255,255,255,0.85), transparent 24%)' }}
        />

        {/* 书架标题 */}
        <div className="relative z-10 flex justify-between items-center px-[46px] pt-[42px] mb-10">
          <div>
            <h2 className="text-2xl font-bold text-shelf-ink">我的教材</h2>
            <span className="text-sm text-shelf-muted">当前仅展示体验教材，添加教材按钮为后续功能入口。</span>
          </div>
        </div>

        {/* 书本行 + 木板书架板 */}
        <div className="relative z-10 flex items-end gap-[34px] min-h-[360px] px-[46px] pb-[34px]">
          {/* 木板书架板 */}
          <div className="absolute left-6 right-6 bottom-7 h-[34px] rounded-[10px] z-0 shadow-[0_15px_25px_rgba(65,39,19,0.25)]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.16), transparent 42%), linear-gradient(90deg, #8b5a34, #5c3922)',
              boxShadow: '0 15px 25px rgba(65,39,19,0.25), inset 0 2px 0 rgba(255,255,255,0.18)'
            }}
          />

          {/* 书本卡片 */}
          <div className="relative z-10">
            <TextbookCard
              textbook={textbook}
              prepareStatus={prepareStatus}
              preparationResult={preparationResult}
              onPrepare={onPrepare}
              onEnterClassroom={onEnterClassroom}
            />
          </div>

          {/* 添加教材按钮 */}
          <div className="relative z-10 w-[190px] h-[280px] mb-[3px] rounded-2xl border-2 border-dashed border-shelf-muted/35 bg-shelf-panel/55 flex flex-col items-center justify-center text-shelf-muted shadow-[0_14px_28px_rgba(80,50,24,0.08)]">
            <div className="w-[54px] h-[54px] rounded-full border-2 border-shelf-muted/40 grid place-items-center text-[30px] text-[#6b5641] bg-white/45 mb-3.5">
              +
            </div>
            <strong className="block text-[#5c4a39] text-base mb-2">添加教材</strong>
            <p className="max-w-[132px] text-center text-[13px] leading-relaxed">
              后续支持导入 PDF / Markdown 教材
            </p>
          </div>
        </div>

        {/* 底部提示条 */}
        <div className="relative z-10 mx-[46px] mb-0 mt-6 rounded-[18px] border border-shelf-line/90 bg-shelf-panel/80 px-5 py-4 flex justify-between items-center gap-5 flex-wrap">
          <p className="text-sm text-shelf-muted leading-relaxed m-0 flex-1 min-w-0">
            点击体验教材后，后续将进入该教材对应的课时学习流程：课程进度、40 分钟模拟课堂、课堂总结与知识图谱点亮。
          </p>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onPrepare}
              disabled={prepareStatus === 'preparing'}
              className="whitespace-nowrap rounded-full border border-shelf-gold/70 bg-shelf-panel text-shelf-ink font-bold px-5 py-3 text-sm shadow-[0_10px_18px_rgba(45,36,27,0.12)] hover:bg-shelf-bg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prepareStatus === 'preparing' ? '备课中...' : 'AI 备课'}
            </button>
            <button
              onClick={onEnterClassroom}
              className="whitespace-nowrap rounded-full bg-shelf-ink text-white font-bold px-5 py-3 text-sm shadow-[0_10px_18px_rgba(45,36,27,0.2)] hover:brightness-110 transition"
            >
              进入体验教材
            </button>
          </div>
        </div>
      </div>

      {/* 备课面板（备课时显示） */}
      {prepareStatus !== 'idle' && (
        <div className="mt-6">
          <PreparationPanel
            prepareStatus={prepareStatus}
            currentStep={currentStep}
            preparationResult={preparationResult}
          />
        </div>
      )}
    </main>
  );
};
