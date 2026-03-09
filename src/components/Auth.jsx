import { useState } from 'react';
import { supabase } from '../main';

export default function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState('');

  const handleEnter = async () => {
    if (!username.trim()) return alert("Enter a username!");

    // 1. Get user's current IP
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const { ip } = await res.json();

      // 2. Check if username exists in DB
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (existingUser) {
        // 3. If IP doesn't match, ask to update it (The Hard Reset)
        if (existingUser.ip_address !== ip) {
          const confirmUpdate = window.confirm("Detected new network connection. Would you like to update this username to this device?");
          if (!confirmUpdate) return;
          
          await supabase
            .from('users')
            .update({ ip_address: ip })
            .eq('username', username);
        }
        
        localStorage.setItem('chat_username', username);
        onAuthSuccess(username);
      } else {
        // 4. If user is brand new, register them
        const { error } = await supabase.from('users').insert([{ username, ip_address: ip }]);
        if (error) return alert("Error registering: " + error.message);
        
        localStorage.setItem('chat_username', username);
        onAuthSuccess(username);
      }
    } catch (err) {
      alert("Connection error: Could not verify IP address.");
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-[#161719] rounded-lg border border-[#262729]">
      <input 
        type="text" 
        placeholder="Choose your username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
        className="w-full p-2 mb-4 bg-[#0f1012] text-white border border-[#2b2d31] rounded" 
      />
      <button onClick={handleEnter} className="w-full bg-blue-600 text-white p-2 rounded">Enter Chat</button>
    </div>
  );
}
