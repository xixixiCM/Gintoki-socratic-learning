import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { CallbackDataParams, ECharts, EChartsOption } from 'echarts';

import type { GraphData, GraphLink, GraphNode } from '../types/graph';

interface KnowledgeGraphProps {
  graphData: GraphData;
}

const difficultyColorMap: Record<number, string> = {
  1: '#3b6b4b',
  2: '#29445f',
  3: '#8b5a34',
  4: '#c98a2e',
  5: '#9b651c'
};

const createNodeStyle = (node: GraphNode) => ({
  value: node.difficulty,
  symbolSize: 48 + node.difficulty * 10,
  itemStyle: {
    color: difficultyColorMap[node.difficulty] ?? '#475569'
  }
});

export const KnowledgeGraph = ({ graphData }: KnowledgeGraphProps): JSX.Element => {
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

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: CallbackDataParams) => {
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
              color: '#7b6a58'
            },
            lineStyle: {
              color: '#b9976a',
              width: 2,
              curveness: 0.18,
              opacity: 0.9,
              type: 'solid'
            }
          })),
          label: {
            show: true,
            color: '#2d241b',
            fontSize: 12,
            fontWeight: 600,
            formatter: '{b}'
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          lineStyle: {
            color: '#b9976a'
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3
            }
          }
        }
      ]
    };

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
              color: '#7b6a58'
            }
          }))
        }
      ]
    });
  }, [categories, graphData]);

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[30px] border border-shelf-line/90 bg-shelf-panel/90 p-4 shadow-shelf">
        <div ref={containerRef} className="h-[520px] w-full" />
      </div>
      <aside className="rounded-[30px] border border-shelf-line/90 bg-white/90 p-5 shadow-shelf">
        <h2 className="text-lg font-semibold text-shelf-ink">节点详情</h2>
        {selectedNode === null ? (
          <p className="mt-4 text-sm leading-6 text-shelf-muted">
            点击图谱中的节点，查看知识点名称、分类和难度。
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-shelf-muted">知识点名称</p>
              <p className="mt-1 text-lg font-semibold text-shelf-ink">{selectedNode.name}</p>
            </div>
            <div>
              <p className="text-sm text-shelf-muted">分类</p>
              <p className="mt-1 text-base text-shelf-ink/80">{selectedNode.category}</p>
            </div>
            <div>
              <p className="text-sm text-shelf-muted">难度</p>
              <p className="mt-1 text-base text-shelf-ink/80">Level {selectedNode.difficulty}</p>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
};
