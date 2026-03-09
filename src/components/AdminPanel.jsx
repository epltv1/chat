import { useState } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [announcementText, setAnnouncementText] = useState('');
  if (!isOpen) return null;

  const updateLock = async (value) => {
    await supabase.from('chat_settings').update({ is_locked: value }).eq('id', 1);
    onClose();
  };

  const broadcast = async () => {
    await supabase.from('announcements').update({ content: announcementText, is_active: true }).eq('id', 1);
    onClose();
  };

  const broadcastViaBot = async () => {
    await supabase.from('messages').insert([{ username: 'Futbolx', content: announcementText }]);
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 h-full w-[250px] bg-[#161719] border-r border-[#262729] z-50 p-4 text-white">
      <button onClick={onClose} className="mb-4 text-xs">✕ Close</button>
      
      <h2 className="font-bold mb-2 text-sm">Chat Controls</h2>
      <button onClick={() => updateLock(true)} className="w-full bg-red-600 p-2 mb-2 rounded text-xs">Lock Chat</button>
      <button onClick={() => updateLock(false)} className="w-full bg-green-600 p-2 mb-6 rounded text-xs">Unlock Chat</button>

      <h2 className="font-bold mb-2 text-sm">Announcement</h2>
      <textarea 
        className="w-full bg-[#0f1012] p-2 mb-2 text-xs rounded border border-[#262729]"
        onChange={(e) => setAnnouncementText(e.target.value)}
      />
      <button onClick={broadcast} className="w-full bg-blue-600 p-2 mb-2 rounded text-xs">Set Header Announcement</button>
      <button onClick={broadcastViaBot} className="w-full bg-cyan-600 p-2 rounded text-xs">Broadcast via Bot</button>
    </div>
  );
}
