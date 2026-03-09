import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send } from 'lucide-react';

const supabase = createClient(
  'https://jvpnulbwrjjryrqbzfpa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cG51bGJ3cmpqcnlycWJ6ZnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzU4MTEsImV4cCI6MjA4ODQxMTgxMX0.BDrz2DTfybunOlU0nuSNvURu8-ePgEK_pfrXIrxa7Ss'
);

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
    e.preventDefault();
    if (!input.trim()) return;
    await supabase.from('messages').insert([{ username: 'Fan_' + Math.floor(Math.random() * 1000), content: input }]);
    setInput('');
    setShowEmojis(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md bg-[#1e1f22] rounded-xl border border-[#2b2d31] overflow-hidden shadow-2xl">
      <div className="p-4 bg-[#2b2d31] border-b border-[#1e1f22] flex justify-between items-center">
        <h2 className="font-bold text-white">Live Match Chat ⚽</h2>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-xs text-green-400">LIVE</span></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[#949ba4] text-[10px] font-bold uppercase tracking-wide">{msg.username}</span>
            <div className="text-[#dbdee1] bg-[#2b2d31] px-3 py-2 rounded-lg mt-0.5 max-w-[90%] break-words">{msg.content}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-[#2b2d31] relative">
        <div className="flex items-center bg-[#383a40] rounded-lg px-3 py-1">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-[#b5bac1] hover:text-white transition-colors"><Smile size={22} /></button>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="w-full bg-transparent p-2 text-white outline-none" />
          <button type="submit" className="text-blue-400 hover:text-blue-300 transition-colors"><Send size={22} /></button>
        </div>
        {showEmojis && <div className="absolute bottom-20 left-4 z-50 shadow-2xl"><EmojiPicker theme="dark" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} /></div>}
      </form>
    </div>
  );
}
