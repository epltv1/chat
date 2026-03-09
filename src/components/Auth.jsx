import { useState } from 'react';
import { supabase } from '../main';

export default function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAction = async (isRegister) => {
    const email = `${username.toLowerCase()}@chat.com`; // Fake email
    
    if (isRegister) {
      // 1. Sign up
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      
      // 2. Save unique username to profiles table
      await supabase.from('profiles').insert([{ id: data.user.id, username }]);
      onAuthSuccess(data.user);
    } else {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Invalid username or password");
      else onAuthSuccess(data.user);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-[#161719] rounded-lg border border-[#262729]">
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="w-full p-2 mb-2 bg-[#0f1012] text-white border border-[#2b2d31]" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 bg-[#0f1012] text-white border border-[#2b2d31]" />
      <button onClick={() => handleAction(true)} className="w-full bg-blue-600 text-white p-2 mb-2">Register</button>
      <button onClick={() => handleAction(false)} className="w-full text-[#949ba4] text-sm">Already have an account? Login</button>
    </div>
  );
}
