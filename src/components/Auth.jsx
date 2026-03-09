import { useState } from 'react';
import { supabase } from '../main'; // Ensure you export your client from main.jsx

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) onAuthSuccess(data.user);
    else alert(error.message);
  };

  return (
    <div className="p-4 bg-[#1e1f22] rounded-lg">
      <h2 className="text-white mb-4">Login to Chat</h2>
      <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 bg-[#383a40] text-white" placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 bg-[#383a40] text-white" placeholder="Password" />
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2">Login</button>
    </div>
  );
}
