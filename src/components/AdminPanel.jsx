import { useState, useEffect } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [members, setMembers] = useState([]);
  const [unbanUsername, setUnbanUsername] = useState('');

  // 1. Fetch members when the panel opens
  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    const { data } = await supabase.from('profiles').select('username, status');
    setMembers(data || []);
  };

  // 2. Lock/Unlock logic
  const updateLock = async (value) => {
    await supabase.from('chat_settings').update({ is_locked: value }).eq('id', 1);
    alert(`Chat ${value ? 'Locked' : 'Unlocked'}`);
  };

  // 3. Mute/Ban/Unban logic
  const updateStatus = async (username, status) => {
    await supabase.from('profiles').update({ status }).eq('username', username);
    fetchMembers();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-[280px] bg-[#161719] border-r border-[#262729] z-50 p-4 overflow-y-auto font-sans">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      
      {/* Lock Controls */}
      <h2 className="text-white font-bold mb-2">Chat Controls</h2>
      <div className="flex gap-2 mb-6">
        <button onClick={() => updateLock(true)} className="flex-1 bg-red-600 p-2 text-white text-xs rounded">Lock</button>
        <button onClick={() => updateLock(false)} className="flex-1 bg-green-600 p-2 text-white text-xs rounded">Unlock</button>
      </div>
      
      {/* Member List */}
      <h2 className="text-white font-bold mb-2">Members</h2>
      <div className="space-y-2 mb-6">
        {members.map((m) => (
          <div key={m.username} className="flex justify-between items-center bg-[#0f1012] p-2 rounded text-[10px]">
            <span className="text-white truncate w-16">{m.username}</span>
            <span className="text-[#949ba4] uppercase">{m.status}</span>
            <div className="flex gap-1">
              <button onClick={() => updateStatus(m.username, 'muted')} className="text-yellow-500 hover:text-yellow-300">Mute</button>
              <button onClick={() => updateStatus(m.username, 'banned')} className="text-red-500 hover:text-red-300">Ban</button>
              <button onClick={() => updateStatus(m.username, 'active')} className="text-blue-500 hover:text-blue-300">Act</button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Unban */}
      <div className="border-t border-[#262729] pt-4">
        <h3 className="text-white text-xs mb-2">Manual Unban</h3>
        <input 
          value={unbanUsername}
          onChange={(e) => setUnbanUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-2 bg-[#0f1012] text-white text-xs rounded border border-[#262729]"
        />
        <button 
          onClick={() => updateStatus(unbanUsername, 'active')} 
          className="w-full mt-2 bg-blue-600 p-2 text-white text-xs rounded"
        >
          Confirm Unban
        </button>
      </div>
    </div>
  );
}
