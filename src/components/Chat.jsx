import { useState, useEffect, useRef } from 'react';
import { supabase } from '../main';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, LogOut, Settings, Trash2, Megaphone } from 'lucide-react';
import AdminPanel from './AdminPanel';

const getNameColor = (username) => {
  const colors = ['#adff2f', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#9370db'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Chat({ username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [announcement, setAnnouncement] = useState({ content: '', is_active: false });
  const chatEndRef = useRef(null);

  const fetchData = async () => {
    const { data: msgs } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (msgs) setMessages(msgs);
    
    const { data: setting } = await supabase.from('chat_settings').select('is_locked').eq('id', 1).single();
    if (setting) setIsLocked(setting.is_locked);

    const { data: ann } = await supabase.from('announcements').select('*').eq('id', 1).single();
    if (ann) setAnnouncement(ann);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const { error } = await supabase.from('messages').insert([{ username, content: input }]);
    if (!error) { setInput(''); setShowEmojis(false); fetchData(); }
  };

  const deleteMessage = async (id) => { await supabase.from('messages').delete().eq('id', id); fetchData(); };

  return (
    <div className="relative flex flex-col h-[600px] w-full max-w-md bg-[#0f1012] border border-[#1c1d1f] overflow-hidden font-sans">
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      
      <div className="p-2 px-3 bg-[#0f1012] border-b border-[#1c1d1f] flex justify-between items-center">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-tight">chat</h2>
        <div className="flex items-center gap-3">
          {username.toLowerCase() === 'optimus' && <button onClick={() => setIsAdminOpen(true)} className="text-[#949ba4]"><Settings size={14} /></button>}
          <span className="text-[11px] text-[#949ba4]">Hi, {username}</span>
          <button onClick={onLogout} className="text-[#949ba4]"><LogOut size={14} /></button>
        </div>
      </div>

      {announcement.is_active && (
        <div className="bg-[#2b2d31] text-white text-[11px] py-1.5 px-3 border-b border-[#1c1d1f] flex items-center">
          <Megaphone size={12} className="mr-2 shrink-0 text-yellow-500" />
          <span className="truncate">{announcement.content}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 bg-[#0b0c0d]">
        {messages.map((msg) => (
          <div key={msg.id} className="group flex items-center gap-2 text-[13px]">
            {username.toLowerCase() === 'optimus' && <button onClick={() => deleteMessage(msg.id)} className="text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>}
            <span className="font-bold uppercase" style={{ color: getNameColor(msg.username) }}>{msg.username}:</span>
            <span className="text-[#dbdee1]">{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {isLocked && username.toLowerCase() !== 'optimus' ? (
        <div className="p-4 text-center text-[#949ba4] text-xs border-t border-[#1c1d1f]">Chat is locked.</div>
      ) : (
        <form onSubmit={sendMessage} className="p-3 bg-[#0f1012] border-t border-[#1c1d1f] relative">
          <div className="flex items-center gap-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-[#161719] p-2 text-[13px] rounded border border-[#262729] text-white outline-none" rows="2" placeholder="Send a message" />
            <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="text-[#949ba4] hover:text-white"><Smile size={22} /></button>
            <button type="submit" className="text-[#5865f2]"><Send size={22} /></button>
          </div>
          {showEmojis && (
            <div className="absolute bottom-[80px] right-2 z-50">
              <EmojiPicker theme="dark" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
