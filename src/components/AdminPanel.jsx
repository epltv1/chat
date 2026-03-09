import { useState, useEffect } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [members, setMembers] = useState([]);
  const [unbanUsername, setUnbanUsername] = useState('');

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    // Ensure you have a 'profiles' table with 'username' and 'status'
    const { data } = await supabase.from('profiles').select('username, status');
    setMembers(data || []);
  };

  const updateLock = async (value) => {
    await supabase.from('chat_settings').update({ is_locked: value }).eq('id', 1);
  };

  const updateStatus = async (username, status) => {
    await supabase.from('profiles').update({ status }).eq('username', username);
    fetchMembers(); // Refresh list
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-[280px] bg-[#161719] border-r border-[#262729] z-50 p-4 flex flex-col font-sans">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      
      {/* 1. Chat Controls */}
      <h2 className="text-white font-bold mb-2 text-sm">Chat Controls</h2>
      <div className="flex gap-2 mb-6">
        <button onClick={() => updateLock(true)} className="flex-1 bg-red-600 p-2 text-white text-xs rounded">Lock</button>
        <button onClick={() => updateLock(false)} className="flex-1 bg-green-600 p-2 text-white text-xs rounded">Unlock</button>
      </div>

      {/* 2. Manual Unban Section */}
      <h3 className="text-white text-sm font-bold mb-2">Manual Unban</h3>
      <div className="mb-6">
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

      {/* 3. Member List (Takes up all remaining space) */}
      <h2 className="text-white font-bold mb-2 text-sm">Members ({members.length})</h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {members.length === 0 ? (
          <p className="text-[#949ba4] text-xs">No members found.</p>
        ) : (
          members.map((m) => (
            <div key={m.username} className="flex justify-between items-center bg-[#0f1012] p-2 rounded text-[10px]">
              <span className="text-white font-bold">{m.username}</span>
              <span className="text-[#949ba4] uppercase">{m.status || 'active'}</span>
              <div className="flex gap-1">
                <button onClick={() => updateStatus(m.username, 'muted')} className="text-yellow-500 hover:text-yellow-300">Mute</button>
                <button onClick={() => updateStatus(m.username, 'banned')} className="text-red-500 hover:text-red-300">Ban</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
