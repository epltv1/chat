import { useState, useEffect, useRef } from 'react';
import { supabase } from '../main';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, LogOut, Settings, Trash2, Megaphone, ShieldCheck, Bot } from 'lucide-react';
import AdminPanel from './AdminPanel';

export default function Chat({ username, onLogout }) {
  // ... (existing states) ...
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    fetchData();
    // Inject system message on mount
    setMessages([{ 
      id: 'system', 
      username: 'Futbolx', 
      content: 'Welcome to the chat! Play fair and enjoy.', 
      isSystem: true 
    }]);
    
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    // ... (rest of your component) ...
    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0b0c0d]">
      {messages.map((msg) => {
        const isOwner = msg.username.toLowerCase() === 'optimus';
        
        return (
          <div key={msg.id} className="group flex items-center gap-2 text-[13px]">
            {/* System Bot Icon */}
            {msg.isSystem && <Bot size={14} className="text-blue-400" />}
            
            {/* Owner Styling */}
            <span 
              className={`font-bold uppercase flex items-center gap-1 ${isOwner ? 'text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]' : ''}`}
              style={{ color: !isOwner ? getNameColor(msg.username) : undefined }}
            >
              {msg.username}:
              {isOwner && <ShieldCheck size={12} className="text-[#00ffcc]" />}
            </span>
            
            <span className="text-[#dbdee1]">{msg.content}</span>
          </div>
        );
      })}
    </div>
  );
}
