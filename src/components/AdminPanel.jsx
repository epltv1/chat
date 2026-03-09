import { useState } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [targetUser, setTargetUser] = useState('');

  const updateStatus = async (username, status) => {
    if (!username.trim()) return alert("Please enter a username!");
    
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('username', username);
    
    if (error) alert("Error: " + error.message);
    else alert(`User ${username} is now ${status}`);
  };

  const updateLock = async (value) => {
    const { error } = await supabase.from('chat_settings').update({ is_locked: value }).eq('id', 1);
    if (!error) alert(`Chat ${value ? 'Locked' : 'Unlocked'}`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-[280px] bg-[#161719] border-r border-[#262729] z-50 p-4 flex flex-col font-sans">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      
      {/* 1. Chat Lock */}
      <h2 className="text-white font-bold mb-2 text-sm">Chat Controls</h2>
      <div className="flex gap-2 mb-8">
        <button onClick={() => updateLock(true)} className="flex-1 bg-red-600 p-2 text-white text-xs rounded">Lock</button>
        <button onClick={() => updateLock(false)} className="flex-1 bg-green-600 p-2 text-white text-xs rounded">Unlock</button>
      </div>

      {/* 2. Manual User Commands */}
      <h2 className="text-white font-bold mb-2 text-sm">Manual User Command</h2>
      <input 
        value={targetUser}
        onChange={(e) => setTargetUser(e.target.value)}
        placeholder="Paste Username Here"
        className="w-full p-2 bg-[#0f1012] text-white text-xs rounded border border-[#262729] mb-4"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => updateStatus(targetUser, 'muted')} className="bg-yellow-600 p-2 text-white text-xs rounded">Mute</button>
        <button onClick={() => updateStatus(targetUser, 'active')} className="bg-blue-600 p-2 text-white text-xs rounded">Unmute</button>
        <button onClick={() => updateStatus(targetUser, 'banned')} className="bg-red-600 p-2 text-white text-xs rounded col-span-2">Ban</button>
        <button onClick={() => updateStatus(targetUser, 'active')} className="bg-green-600 p-2 text-white text-xs rounded col-span-2">Unban</button>
      </div>
    </div>
  );
}
