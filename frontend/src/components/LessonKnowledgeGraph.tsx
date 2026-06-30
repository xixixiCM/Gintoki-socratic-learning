import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
import type { LessonGraphData, LessonGraphNode, LessonGraphNodeStatus } from '../types/graph';

interface LessonKnowledgeGraphProps {
  graphData: LessonGraphData;
}

const statusColorMap: Record<LessonGraphNodeStatus, string> = {
  completed: '#10b981',
  current: '#06b6d4',
  review: '#8b5cf6',
  support: '#f59e0b'
};

const statusLabelMap: Record<LessonGraphNodeStatus, string> = {
  completed: '已完成',
  current: '当前',
  review: '复习',
  support: '辅助'
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
              color: statusColorMap[node.status] ?? '#475569',
              borderColor: node.status === 'current' ? '#06b6d4' : 'transparent',
              borderWidth: node.status === 'current' ? 3 : 0,
              shadowBlur: node.status === 'current' ? 20 : 0,
              shadowColor: node.status === 'current' ? '#06b6d4' : 'transparent'
            },
            label: {
              show: true,
              color: '#f8fafc',
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
              color: '#94a3b8',
              fontSize: 10
            },
            lineStyle: {
              color: '#64748b',
              width: 1.5,
              curveness: 0.15,
              opacity: 0.7
            }
          })),
          emphasis: {
            focus: 'adjacency',
            itemStyle: {
              borderColor: '#fff',
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
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">本节知识图谱</p>
        <h3 className="mt-1 text-base font-semibold text-white">局部知识图谱</h3>
      </div>

      <div ref={containerRef} className="flex-1" />

      {/* 图例 */}
      <div className="border-t border-white/10 px-5 py-3">
        <div className="flex flex-wrap gap-3 text-xs">
          {(['completed', 'current', 'review', 'support'] as LessonGraphNodeStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColorMap[status] }}
              />
              <span className="text-slate-500">{statusLabelMap[status]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
