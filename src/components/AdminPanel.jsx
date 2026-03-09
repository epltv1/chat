import { useState } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [announcementText, setAnnouncementText] = useState('');
  if (!isOpen) return null;

  const broadcastViaBot = async () => {
    await supabase.from('messages').insert([{ username: 'Futbolx', content: announcementText }]);
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 h-full w-[250px] bg-[#161719] border-r border-[#262729] z-50 p-4 text-white">
      <button onClick={onClose} className="mb-4 text-xs">✕ Close</button>
      <h2 className="font-bold mb-2 text-sm">Bot Broadcast</h2>
      <textarea 
        className="w-full bg-[#0f1012] p-2 mb-2 text-xs rounded border border-[#262729]"
        onChange={(e) => setAnnouncementText(e.target.value)}
      />
      <button onClick={broadcastViaBot} className="w-full bg-cyan-600 p-2 rounded text-xs mb-6">Broadcast as Bot</button>
      {/* ... keep other buttons ... */}
    </div>
  );
}
