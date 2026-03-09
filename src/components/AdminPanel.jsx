import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const updateLock = async (value) => {
    const { error } = await supabase
      .from('chat_settings')
      .update({ is_locked: value })
      .eq('id', 1);
    
    if (error) alert("Error: " + error.message);
    else alert(`Chat ${value ? 'Locked' : 'Unlocked'}`);
  };

  return (
    <div className="absolute top-0 left-0 h-full w-[250px] bg-[#161719] border-r border-[#262729] z-50 p-4 font-sans">
      <button onClick={onClose} className="text-white mb-6">✕ Close</button>
      
      <h2 className="text-white font-bold mb-4 text-sm">Chat Controls</h2>
      <div className="space-y-3">
        <button 
          onClick={() => updateLock(true)} 
          className="w-full bg-red-600 p-2 text-white text-xs rounded hover:bg-red-700"
        >
          Lock Chat
        </button>
        <button 
          onClick={() => updateLock(false)} 
          className="w-full bg-green-600 p-2 text-white text-xs rounded hover:bg-green-700"
        >
          Unlock Chat
        </button>
      </div>
    </div>
  );
}
