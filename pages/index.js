import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmojiPicker from 'emoji-picker-react';
import { Send, Smile } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase.channel('chat').on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages' }, 
      (payload) => setMessages((prev) => [...prev, payload.new])
    ).subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await supabase.from('messages').insert([{ content: input, username: 'User' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f1012] text-[#d1d1d1]">
      {/* 1. Scrollable message area (Takes all available space) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="text-[14px]">
            <span className="font-bold text-[#64db64] mr-2">Guest:</span>
            <span>{m.content}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 2. Fixed Input Container at the bottom */}
      <div className="p-3 bg-[#0f1012] border-t border-[#2d2d2d]">
        
        {/* Emoji Picker container: Sits directly above input */}
        {showEmoji && (
          <div className="mb-2">
            <EmojiPicker 
              theme="dark" 
              width="100%" 
              height="300px"
              onEmojiClick={(e) => { setInput(prev => prev + e.emoji); setShowEmoji(false); }} 
            />
          </div>
        )}

        <form onSubmit={sendMessage} className="flex items-center bg-[#1e1f22] rounded-md px-3 py-2 gap-2">
          <input 
            className="bg-transparent flex-1 outline-none text-white text-sm"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-[#a0a0a0] hover:text-white transition">
            <Smile size={20} />
          </button>
          <button type="submit" className="text-[#a0a0a0] hover:text-white transition">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
