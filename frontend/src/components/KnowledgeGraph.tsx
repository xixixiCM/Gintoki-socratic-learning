import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

import type { GraphData, GraphLink, GraphNode } from '../types/graph';

interface KnowledgeGraphProps {
  graphData: GraphData;
  // 新增：节点点击回调，接收节点名称
  onNodeClick: (nodeName: string) => void;
}

const difficultyColorMap: Record<number, string> = {
  1: '#2563eb',
  2: '#0f766e',
  3: '#7c3aed',
  4: '#ea580c',
  5: '#dc2626'
};

const createNodeStyle = (node: GraphNode) => ({
  value: node.difficulty,
  symbolSize: 48 + node.difficulty * 10,
  itemStyle: {
    color: difficultyColorMap[node.difficulty] ?? '#475569'
  }
});

export const KnowledgeGraph = ({ graphData, onNodeClick }: KnowledgeGraphProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(graphData.nodes.map((node) => node.category))),
    [graphData.nodes]
  );

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    // 监听图表节点点击
chart.on('click', (params: any) => {
  // 仅处理节点，忽略连线
  if (params.dataType === 'node') {
    const nodeName = params.name;
    onNodeClick(nodeName);
  }
});

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const node = params.data as GraphNode;
            return `${node.name}<br />分类：${node.category}<br />难度：${node.difficulty}`;
          }

          const link = params.data as GraphLink;
          return link.relationType;
        }
      },
      series: [
        {
          name: '知识图谱',
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,
          force: {
            repulsion: 260,
            edgeLength: [100, 180],
            gravity: 0.1
          },
          categories: categories.map((category) => ({ name: category })),
          data: graphData.nodes.map((node) => ({
            ...node,
            category: categories.indexOf(node.category),
            ...createNodeStyle(node)
          })),
          links: graphData.links.map((link) => ({
            source: link.source,
            target: link.target,
            value: link.relationType,
            label: {
              show: true,
              formatter: link.relationType,
              color: '#cbd5e1'
            },
            lineStyle: {
              color: '#94a3b8',
              width: 2,
              curveness: 0.18,
              opacity: 0.9,
              type: 'solid'
            }
          })),
          label: {
            show: true,
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: 600,
            formatter: '{b}'
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          lineStyle: {
            color: '#94a3b8'
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3
            }
          }
        }
      ]
    }as any;

    chart.setOption(option);
    chart.on('click', (params) => {
      if (params.dataType !== 'node') {
        return;
      }

      const clickedNodeId = (params.data as { id?: number }).id;
      if (clickedNodeId === undefined) {
        return;
      }

      const clickedNode = graphData.nodes.find((node) => node.id === clickedNodeId);
      if (clickedNode !== undefined) {
        setSelectedNode(clickedNode);
      }
    });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.off('click');
      chart.dispose();
      chartRef.current = null;
    };
  }, [categories, graphData.links, graphData.nodes]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart === null) {
      return;
    }

    chart.setOption({
      series: [
        {
          data: graphData.nodes.map((node) => ({
            ...node,
            category: categories.indexOf(node.category),
            ...createNodeStyle(node)
          })),
          links: graphData.links.map((link) => ({
            source: link.source,
            target: link.target,
            value: link.relationType,
            label: {
              show: true,
              formatter: link.relationType,
              color: '#cbd5e1'
            }
          }))
        }
      ]
    });
  }, [categories, graphData]);

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-glow backdrop-blur">
        <div ref={containerRef} className="h-[520px] w-full" />
      </div>
      <aside className="rounded-3xl border border-white/10 bg-white/90 p-5 shadow-glow backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-900">节点详情</h2>
        {selectedNode === null ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            点击图谱中的节点，查看知识点名称、分类和难度。
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-slate-500">知识点名称</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{selectedNode.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">分类</p>
              <p className="mt-1 text-base text-slate-700">{selectedNode.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">难度</p>
              <p className="mt-1 text-base text-slate-700">Level {selectedNode.difficulty}</p>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
};
