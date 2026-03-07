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
    <div className="flex flex-col h-screen bg-[#0f1012] text-[#d1d1d1] font-sans text-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2">
            <span className="font-bold text-[#64db64]">Guest:</span>
            <span>{m.content}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area (PPV Style) */}
      <div className="p-3 bg-[#0f1012]">
        <form onSubmit={sendMessage} className="flex items-center bg-[#1e1f22] rounded-md px-2 py-1">
          <input 
            className="bg-transparent flex-1 outline-none text-white px-2 py-1"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-[#a0a0a0] hover:text-white p-1">
            <Smile size={18} />
          </button>
          <button type="submit" className="text-[#a0a0a0] hover:text-white p-1">
            <Send size={18} />
          </button>
        </form>
        
        {showEmoji && (
          <div className="absolute bottom-16 right-4 z-50">
            <EmojiPicker theme="dark" onEmojiClick={(e) => { setInput(prev => prev + e.emoji); setShowEmoji(false); }} />
          </div>
        )}
      </div>
    </div>
  );
}
