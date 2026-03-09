import { useState } from 'react';
import { supabase } from '../main';

export default function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAction = async (isRegister) => {
    // We treat the username as the email handle
    const email = `${username.toLowerCase()}@chat.com`;

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert("Signup failed: " + error.message);
      
      // Save profile so we can link the username to the ID
      await supabase.from('profiles').insert([{ id: data.user.id, username }]);
      onAuthSuccess(data.user);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert("Login failed: " + error.message);
      onAuthSuccess(data.user);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-[#161719] rounded-lg border border-[#262729]">
      <input 
        type="text" placeholder="Username" 
        onChange={(e) => setUsername(e.target.value)} 
        className="w-full p-2 mb-2 bg-[#0f1012] text-white border border-[#2b2d31]" 
      />
      <input 
        type="password" placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full p-2 mb-4 bg-[#0f1012] text-white border border-[#2b2d31]" 
      />
      <div className="flex gap-2">
        <button onClick={() => handleAction(true)} className="flex-1 bg-blue-600 text-white p-2">Register</button>
        <button onClick={() => handleAction(false)} className="flex-1 bg-gray-600 text-white p-2">Login</button>
      </div>
    </div>
  );
}
