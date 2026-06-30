import { Link } from 'react-router-dom';

const Chat = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center px-6 py-16">
      <Link to="/" className="self-start text-cyan-400 text-lg mb-10 hover:underline">
        ← 返回首页
      </Link>
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">AI 苏格拉底对话交互</h1>
        <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur border border-white/10 shadow-lg shadow-cyan-900/20">
          <p className="text-slate-300 text-lg mb-4">模块开发中，后续功能：</p>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span> 用户与AI双向对话气泡
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span> AI逐字打字回复动画
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span> 对话历史、新建会话切换
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span> 知识图谱页面一键带入知识点提问
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;