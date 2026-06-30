import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// 消息类型定义
interface MessageItem {
  id: number;
  type: 'user' | 'ai';
  content: string;
}

const Chat = () => {
  // 读取url参数
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');

  // 消息列表
  const [msgList, setMsgList] = useState<MessageItem[]>([]);
  // 输入框内容
  const [inputText, setInputText] = useState('');
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 滚动容器ref，自动滚到底部
  const scrollRef = useRef<HTMLDivElement>(null);

  // 页面加载：如果携带知识点，自动填充输入框
  useEffect(() => {
    if (topic) setInputText(topic);
  }, [topic]);

  // 消息更新后自动滚动到底
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgList]);

  // 模拟后端AI接口请求（后续替换成真实后端地址）
  const fetchAiReply = async (question: string): Promise<string> => {
    // 真实接口示例：
    // const res = await fetch('/api/chat/socrates', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ question })
    // });
    // const data = await res.json();
    // return data.answer;

    // 模拟延迟返回
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`苏格拉底思考回复：你提出的「${question}」这个问题，我们可以从多角度辩证探讨……`);
      }, 1200);
    });
  };

  // 发送消息逻辑
  const handleSend = async () => {
    const trimText = inputText.trim();
    if (!trimText || loading) return;

    // 新增用户消息
    const userMsg: MessageItem = {
      id: Date.now(),
      type: 'user',
      content: trimText,
    };
    setMsgList((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // 请求AI回复
      const aiText = await fetchAiReply(trimText);
      const aiMsg: MessageItem = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiText,
      };
      setMsgList((prev) => [...prev, aiMsg]);
    } catch (err) {
      // 异常消息
      const errMsg: MessageItem = {
        id: Date.now() + 1,
        type: 'ai',
        content: '接口请求失败，请稍后重试',
      };
      setMsgList((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // 清空全部对话
  const clearAllChat = () => setMsgList([]);

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10">
      {/* 返回头部 */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-cyan-400 text-lg hover:underline">
          ← 返回首页
        </Link>
        <h1 className="text-2xl font-bold">AI 苏格拉底对话</h1>
        <button
          onClick={clearAllChat}
          className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
        >
          清空对话
        </button>
      </div>

      {/* 消息滚动区域 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur border border-white/10 shadow-lg shadow-cyan-900/20 mb-6 max-h-[60vh]"
      >
        {msgList.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            {topic ? `已带入知识点：${topic}，直接发送提问` : '输入问题，开启苏格拉底式对话'}
          </div>
        ) : (
          <div className="space-y-4">
            {msgList.map((item) => (
              <div
                key={item.id}
                className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-xl whitespace-pre-wrap ${
                    item.type === 'user'
                      ? 'bg-cyan-500/80 text-white rounded-tr-none'
                      : 'bg-white/10 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-xl rounded-tl-none text-slate-400">
                  AI思考中...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部输入框区域 */}
      <div className="flex gap-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题，回车发送..."
          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition-all resize-none h-[60px]"
        />
        <button
          onClick={handleSend}
          disabled={loading || !inputText.trim()}
          className="px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100"
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default Chat;