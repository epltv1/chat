import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send } from 'lucide-react';

const supabase = createClient(
  'https://jvpnulbwrjjryrqbzfpa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your Anon Key
);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const chatEndRef = useRef(null);

  // 1. Fetch existing & Listen for new messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase.channel('realtime-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await supabase.from('messages').insert([
      { username: 'Fan_User', content: input } // You can randomize usernames for now
    ]);
    setInput('');
    setShowEmojis(false);
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-[#1e1f22] rounded-lg border border-[#2b2d31] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-[#2b2d31] border-b border-[#1e1f22] font-bold text-white flex justify-between">
        <span>Match Day Chat ⚽</span>
        <span className="text-green-400 text-xs flex items-center">● Online</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className="group flex flex-col">
            <span className="text-[#949ba4] text-xs font-semibold">{msg.username}</span>
            <p className="text-[#dbdee1] bg-[#2b2d31] p-2 rounded-md mt-1 inline-block max-w-fit">
              {msg.content}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-[#2b2d31] relative">
        <div className="flex items-center bg-[#383a40] rounded-md px-3">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-[#b5bac1] hover:text-white mr-2">
            <Smile size={20} />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message #general"
            className="w-full bg-transparent py-2 text-white outline-none placeholder-[#949ba4]"
          />
          
          <button type="submit" className="text-[#b5bac1] hover:text-white ml-2">
            <Send size={20} />
          </button>
        </div>

        {showEmojis && (
          <div className="absolute bottom-20 left-0 z-50">
            <EmojiPicker theme="dark" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} />
          </div>
        )}
      </form>
    </div>
  );
}
