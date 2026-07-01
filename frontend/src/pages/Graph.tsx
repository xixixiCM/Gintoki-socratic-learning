import { useEffect, useState } from 'react';

import { getGraphData } from '../api/graph';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import type { GraphData } from '../types/graph';

export const Graph = (): JSX.Element => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGraphData();
        setGraphData(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '加载知识图谱失败');
      } finally {
        setLoading(false);
      }
    };

    void loadGraphData();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold text-shelf-ink tracking-wide">机器学习知识图谱</h1>
          <p className="mt-2 text-shelf-muted text-[15px] leading-relaxed">完整课程知识图谱，展示所有知识点及其前置关系。</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[30px] border border-shelf-line/90 bg-shelf-panel/80 p-10 text-center text-shelf-muted shadow-shelf-sm">
          正在加载知识图谱数据...
        </div>
      ) : error !== null ? (
        <div className="rounded-[30px] border border-red-400/30 bg-red-50/60 p-10 text-center text-red-700 shadow-shelf-sm">
          {error}
        </div>
      ) : graphData === null || graphData.nodes.length === 0 || graphData.links.length === 0 ? (
        <div className="rounded-[30px] border border-shelf-line/90 bg-shelf-panel/80 p-10 text-center text-shelf-muted shadow-shelf-sm">
          暂无知识图谱数据。
        </div>
      ) : (
        <KnowledgeGraph graphData={graphData} />
      )}
    </main>
  );
};
