import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmojiPicker from 'emoji-picker-react';
import { Send, Smile } from 'lucide-react';

// Connect to Supabase (We will add the keys in Stormkit later)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef(null);

  // 1. Fetch & Listen for messages
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

  // 2. Auto-scroll to bottom
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await supabase.from('messages').insert([{ content: input, username: 'User' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-gray-700 shadow-2xl bg-chatBackground">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="group hover:bg-[#2e3035] p-2 rounded transition">
            <p className="text-xs text-blue-400 font-bold">Guest User</p>
            <p className="text-chatText">{m.content}</p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-chatBackground relative">
        <div className="flex items-center bg-chatInput rounded-lg p-2 gap-2">
          <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-gray-400 hover:text-white">
            <Smile size={24} />
          </button>
          <input 
            className="bg-transparent flex-1 outline-none text-chatText"
            placeholder="Message the group..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="text-gray-400 hover:text-white">
            <Send size={24} />
          </button>
        </div>
        
        {showEmoji && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPicker 
              theme="dark" 
              onEmojiClick={(emoji) => { setInput(prev => prev + emoji.emoji); setShowEmoji(false); }} 
            />
          </div>
        )}
      </form>
    </div>
  );
}
