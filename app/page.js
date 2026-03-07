'use client';
import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function ChatPage() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-500 italic">Chat started...</p>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-[#2d2d2d] bg-white dark:bg-[#0f1012]">
        {showEmoji && (
          <div className="mb-2">
            <EmojiPicker theme="dark" width="100%" onEmojiClick={(e) => setInput(prev => prev + e.emoji)} />
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea 
            className="flex-1 bg-gray-100 dark:bg-[#1e1f22] rounded-lg p-3 outline-none resize-none text-black dark:text-white"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="1"
          />
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-gray-500 hover:text-black dark:hover:text-white">
              <Smile size={24} />
            </button>
            <button className="p-2 text-blue-500 hover:text-blue-600">
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
