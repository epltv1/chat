import { supabase } from '../main';

export default function AdminPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const updateSetting = async (column, value) => {
    const { error } = await supabase
      .from('chat_settings')
      .update({ [column]: value })
      .eq('id', 1);
    
    if (error) alert("Error updating: " + error.message);
    else alert(`Setting updated!`);
  };

  return (
    <div className="absolute top-0 left-0 h-full w-[250px] bg-[#161719] border-r border-[#262729] z-50 p-4">
      <button onClick={onClose} className="text-white mb-4">✕ Close</button>
      <h2 className="text-white font-bold mb-4">Admin Controls</h2>
      
      <div className="space-y-4">
        <button onClick={() => updateSetting('is_locked', true)} className="w-full bg-red-600 p-2 text-white">Lock Chat</button>
        <button onClick={() => updateSetting('is_locked', false)} className="w-full bg-green-600 p-2 text-white">Unlock Chat</button>
        
        <div className="pt-4 border-t border-[#262729]">
          <label className="text-white text-xs">Slow Mode (seconds)</label>
          <input 
            type="number" 
            placeholder="0"
            onChange={(e) => updateSetting('slow_mode_seconds', parseInt(e.target.value))} 
            className="w-full mt-1 bg-[#0f1012] text-white p-2 border border-[#262729]" 
          />
        </div>
      </div>
    </div>
  );
}
