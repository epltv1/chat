import { useState, useEffect, useRef } from 'react';
import { supabase } from '../main';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, LogOut, Settings } from 'lucide-react';
import AdminPanel from './AdminPanel'; // Import the new component

const getNameColor = (username) => {
  const colors = ['#adff2f', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#9370db'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function Chat({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // New state for Drawer
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase.channel('realtime-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    
    await supabase.from('messages').insert([{ 
      username: username, 
      content: input 
    }]);
    
    setInput('');
    setShowEmojis(false);
  };

  return (
    <div className="relative flex flex-col h-[600px] w-full max-w-md bg-[#0f1012] border border-[#1c1d1f] overflow-hidden font-sans">
      
      {/* Admin Drawer Overlay */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Header with Logout & Admin Settings */}
      <div className="p-2 px-3 bg-[#0f1012] border-b border-[#1c1d1f] flex justify-between items-center">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-tight">chat</h2>
        <div className="flex items-center gap-3">
          {/* Admin Settings Icon - Only shows for Optimus */}
          {username.toLowerCase() === 'optimus' && (
            <button onClick={() => setIsAdminOpen(true)} className="text-[#949ba4] hover:text-white transition-colors">
              <Settings size={14} />
            </button>
          )}
          
          <span className="text-[11px] text-[#949ba4]">Hi, {username}</span>
          <button onClick={onLogout} className="text-[#949ba4] hover:text-red-500">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 bg-[#0b0c0d] scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className="text-[13px] leading-[1.4]">
            <span className="font-bold mr-1.5 uppercase tracking-wide" style={{ color: getNameColor(msg.username) }}>
              {msg.username}:
            </span>
            <span className="text-[#dbdee1]">{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 pt-1 bg-[#0f1012] relative">
        <div className="flex items-stretch gap-3">
          <div className="flex-1 bg-[#161719] rounded-md border border-[#262729] p-2 min-h-[75px]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Send a message"
              className="w-full bg-transparent text-[#dbdee1] outline-none resize-none text-[13px] placeholder-[#4f545c]"
              rows="3"
            />
          </div>

          <div className="flex flex-col justify-between py-0.5">
            <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-[#949ba4] hover:text-white transition-colors">
              <Smile size={22} />
            </button>
            <button type="submit" className="text-[#5865f2] hover:text-blue-400 transition-colors">
              <Send size={22} />
            </button>
          </div>
        </div>

        {showEmojis && (
          <div className="absolute bottom-[100px] right-2 z-50 shadow-2xl scale-[0.85] origin-bottom-right">
            <EmojiPicker theme="dark" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} />
          </div>
        )}
      </form>
    </div>
  );
}
