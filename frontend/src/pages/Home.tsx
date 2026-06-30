import { Link } from 'react-router-dom';

export const Home = (): JSX.Element => {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* 顶部导航栏补充AI对话入口（新增） */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur border-b border-white/10 z-10">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-white">AI 苏格拉底学习系统</span>
          <div className="flex gap-6">
            <Link to="/" className="text-white hover:text-cyan-300 transition">首页</Link>
            <Link to="/graph" className="text-white hover:text-cyan-300 transition">知识图谱</Link>
            {/* 新增AI对话导航 */}
            <Link to="/chat" className="text-white hover:text-cyan-300 transition">AI对话</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8 pt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
              V0.1 本地可运行基础框架
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                AI 虚拟人物苏格拉底式学习系统
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                这是一个面向课程实训的本地 B/S 项目，V0.1 版本先提供健康检查、知识图谱接口和
                可视化图谱页面，便于后续逐步扩展学习路径、AI 追问和管理功能。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/graph"
                className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                进入知识图谱
              </Link>
              {/* 新增AI对话主按钮 */}
              <Link
                to="/chat"
                className="inline-flex items-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                进入AI苏格拉底对话
              </Link>
              <a
                href="http://localhost:3001/api/graph"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                查看接口返回
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-glow backdrop-blur">
            <div className="space-y-4 rounded-[1.5rem] bg-slate-950/70 p-6 text-slate-100">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">V0.1 功能</p>
              <ul className="space-y-3 text-sm leading-6 text-slate-300">
                <li>后端健康检查接口</li>
                <li>mock 知识图谱接口</li>
                <li>前端 ECharts Graph 可视化</li>
                <li>数据库与 Workspace 基础文件</li>
                {/* 新增AI对话功能描述 */}
                <li>AI苏格拉底对话交互模块（前端开发中）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};