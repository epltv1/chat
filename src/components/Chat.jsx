import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send } from 'lucide-react';

const supabase = createClient(
  'https://jvpnulbwrjjryrqbzfpa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cG51bGJ3cmpqcnlycWJ6ZnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzU4MTEsImV4cCI6MjA4ODQxMTgxMX0.BDrz2DTfybunOlU0nuSNvURu8-ePgEK_pfrXIrxa7Ss'
);

const getNameColor = (username) => {
  const colors = ['#adff2f', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#9370db'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
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
    await supabase.from('messages').insert([{ username: 'FAN_' + Math.floor(Math.random() * 999), content: input }]);
    setInput('');
    setShowEmojis(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md bg-[#0f1012] border border-[#2b2d31] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="p-2 px-3 bg-[#0f1012] border-b border-[#1c1d1f] flex justify-between items-center">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-tight">chat</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span className="text-[11px] text-[#949ba4]">connected</span>
        </div>
      </div>

      {/* Messages */}
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

      {/* Input Area - Tightened PPV Style */}
      <form onSubmit={sendMessage} className="p-2 pb-3 bg-[#0f1012] border-t border-[#1c1d1f] relative">
        <div className="flex items-end gap-2">
          
          {/* Compact Textarea */}
          <div className="flex-1 bg-[#161719] rounded border border-[#262729] p-2 min-h-[50px]">
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
              rows="2"
            />
          </div>

          {/* Tight Side Buttons */}
          <div className="flex flex-col gap-1 pb-1">
            <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-[#949ba4] hover:text-white">
              <Smile size={20} />
            </button>
            <button type="submit" className="text-[#5865f2] hover:text-blue-400">
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="absolute bottom-20 right-2 z-50 shadow-2xl scale-[0.85] origin-bottom-right">
            <EmojiPicker theme="dark" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} />
          </div>
        )}
      </form>
    </div>
  );
}
