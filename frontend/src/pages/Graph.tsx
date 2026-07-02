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
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <div className="mb-4 rounded-[22px] border border-shelf-line/90 bg-shelf-panel/80 px-5 py-4 shadow-shelf-sm">
          <h2 className="text-lg font-bold text-shelf-ink">全教材知识图谱</h2>
          <p className="mt-1 text-sm text-shelf-muted">
            展示整本教材的知识点与前置关系，和课堂中的本节图谱区分开来。
          </p>
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
      </div>

      <aside className="rounded-[30px] border border-shelf-line/90 bg-shelf-panel/80 p-5 shadow-shelf-sm">
        <h3 className="text-lg font-semibold text-shelf-ink">说明</h3>
        <p className="mt-3 text-sm leading-6 text-shelf-muted">
          这里是课程级别的总图谱视图。课堂页里展示的是当前课时相关的局部图谱，二者是父子层级关系。
        </p>
      </aside>
    </section>
  );
};
