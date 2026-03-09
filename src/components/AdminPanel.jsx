import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const updateSetting = async (value) => {
    const { error } = await supabase
      .from('chat_settings')
      .update({ is_locked: value })
      .eq('id', 1);
    
    if (error) alert("Error: " + error.message);
  };

  return (
    <div className="absolute top-0 left-0 h-full w-[250px] bg-[#161719] border-r border-[#262729] z-50 p-4">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      <h2 className="text-white font-bold mb-4">Admin Controls</h2>
      
      <div className="space-y-4">
        <button onClick={() => updateSetting(true)} className="w-full bg-red-600 p-2 text-white rounded">
          Lock Chat
        </button>
        <button onClick={() => updateSetting(false)} className="w-full bg-green-600 p-2 text-white rounded">
          Unlock Chat
        </button>
      </div>
    </div>
  );
}
