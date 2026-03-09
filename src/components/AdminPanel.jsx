import { useState, useEffect } from 'react';
import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  const [members, setMembers] = useState([]);
  const [unbanUsername, setUnbanUsername] = useState('');

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    const { data } = await supabase.from('profiles').select('username, status');
    setMembers(data || []);
  };

  const updateStatus = async (username, status) => {
    await supabase.from('profiles').update({ status }).eq('username', username);
    fetchMembers();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-[280px] bg-[#161719] border-r border-[#262729] z-50 p-4 overflow-y-auto">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      <h2 className="text-white font-bold mb-2">Members</h2>
      
      <div className="space-y-2 mb-6">
        {members.map((m) => (
          <div key={m.username} className="flex justify-between items-center bg-[#0f1012] p-2 text-xs">
            <span className="text-white">{m.username} ({m.status})</span>
            <div className="flex gap-1">
              <button onClick={() => updateStatus(m.username, 'muted')} className="text-yellow-500">Mute</button>
              <button onClick={() => updateStatus(m.username, 'banned')} className="text-red-500">Ban</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#262729] pt-4">
        <h3 className="text-white text-xs mb-2">Unban User</h3>
        <input 
          value={unbanUsername}
          onChange={(e) => setUnbanUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-2 bg-[#0f1012] text-white text-xs"
        />
        <button onClick={() => updateStatus(unbanUsername, 'active')} className="w-full mt-2 bg-blue-600 p-2 text-white">Unban</button>
      </div>
    </div>
  );
}
