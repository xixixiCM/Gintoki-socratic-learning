import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGraphData } from '../api/graph';
import { KnowledgeGraph } from '../components/KnowledgeGraph';
import type { GraphData } from '../types/graph';

export const Graph = (): JSX.Element => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Knowledge Graph</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">机器学习知识图谱</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-slate-100 backdrop-blur">
          正在加载知识图谱数据...
        </div>
      ) : error !== null ? (
        <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-10 text-center text-red-100">
          {error}
        </div>
      ) : graphData === null || graphData.nodes.length === 0 || graphData.links.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-slate-100 backdrop-blur">
          暂无知识图谱数据。
        </div>
      ) : (
        <KnowledgeGraph
  graphData={graphData!}
  onNodeClick={(nodeName: string) => {
    navigate(`/chat?topic=${encodeURIComponent(nodeName)}`);
  }}
/>
      )}
    </main>
  );
};
