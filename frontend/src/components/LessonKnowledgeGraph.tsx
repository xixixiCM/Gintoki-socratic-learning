import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
import type { LessonGraphData, LessonGraphNode, LessonGraphNodeStatus } from '../types/graph';

interface LessonKnowledgeGraphProps {
  graphData: LessonGraphData;
}

const statusColorMap: Record<LessonGraphNodeStatus, string> = {
  completed: '#3b6b4b',
  current: '#c98a2e',
  review: '#29445f',
  support: '#ab9881'
};

const statusTextColorMap: Record<LessonGraphNodeStatus, string> = {
  completed: '#f8f4ec',
  current: '#2d241b',
  review: '#f8f4ec',
  support: '#2d241b'
};

const statusLabelMap: Record<LessonGraphNodeStatus, string> = {
  completed: '已学关联',
  current: '本节重点',
  review: '待复习',
  support: '辅助概念'
};

export const LessonKnowledgeGraph: React.FC<LessonKnowledgeGraphProps> = ({ graphData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    if (chartRef.current !== null) {
      chartRef.current.dispose();
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { dataType?: string; data?: LessonGraphNode };
          if (p.dataType === 'node' && p.data !== undefined) {
            const node = p.data;
            return `${node.name}<br />状态：${statusLabelMap[node.status] ?? node.status}`;
          }
          return '';
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,
          force: {
            repulsion: 200,
            edgeLength: [80, 150],
            gravity: 0.08
          },
          data: graphData.nodes.map((node) => ({
            name: node.name,
            value: node.status,
            symbolSize: node.status === 'current' ? 55 : 42,
            itemStyle: {
              color: statusColorMap[node.status] ?? '#ab9881',
              borderColor: node.status === 'current' ? '#c98a2e' : 'rgba(45,36,27,0.22)',
              borderWidth: node.status === 'current' ? 3 : 2,
              shadowBlur: node.status === 'current' ? 20 : 0,
              shadowColor: node.status === 'current' ? '#c98a2e' : 'transparent'
            },
            label: {
              show: true,
              color: statusTextColorMap[node.status] ?? '#2d241b',
              fontSize: 12,
              fontWeight: node.status === 'current' ? 700 : 500
            }
          })),
          links: graphData.links.map((link) => ({
            source: link.source,
            target: link.target,
            label: {
              show: true,
              formatter: link.relationType,
              color: '#7b6a58',
              fontSize: 10
            },
            lineStyle: {
              color: '#b9976a',
              width: 2,
              curveness: 0.15,
              opacity: 0.8
            }
          })),
          emphasis: {
            focus: 'adjacency',
            itemStyle: {
              borderColor: '#2d241b',
              borderWidth: 2
            }
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [graphData]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-shelf-line/70 px-5 py-4 bg-shelf-panel/70">
        <h2 className="text-lg font-bold text-shelf-ink">本节知识图谱</h2>
        <p className="mt-1 text-xs text-shelf-muted leading-relaxed">
          该区域只展示当前课时相关知识结构，不展示完整教材原文。
        </p>
      </div>

      <div ref={containerRef} className="flex-1" />

      {/* 图例 */}
      <div className="border-t border-shelf-line/70 px-5 py-3">
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {(['completed', 'current', 'review', 'support'] as LessonGraphNodeStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-shelf-line/70 bg-shelf-panel/70">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColorMap[status] }}
              />
              <span className="text-shelf-muted">{statusLabelMap[status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 节点列表 */}
      <div className="border-t border-shelf-line/70 px-5 py-4">
        <h3 className="text-[15px] font-bold text-shelf-ink mb-2.5">本课节点</h3>
        <div className="space-y-2">
          {graphData.nodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl border border-shelf-line/50 bg-white/50 text-xs">
              <strong className="text-[13px] text-shelf-ink">{node.name}</strong>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap"
                style={{
                  backgroundColor: node.status === 'completed' ? '#e6f0e8' :
                    node.status === 'current' ? '#fff0c9' :
                    node.status === 'review' ? '#e4edf5' : 'rgba(119,102,83,0.1)',
                  color: node.status === 'completed' ? '#3b6b4b' :
                    node.status === 'current' ? '#9b651c' :
                    node.status === 'review' ? '#29445f' : '#7b6a58'
                }}
              >
                {statusLabelMap[node.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
