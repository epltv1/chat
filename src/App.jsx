import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Auth from './components/Auth';
import { supabase } from './main';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1012] flex items-center justify-center">
      {user ? <Chat user={user} /> : <Auth onAuthSuccess={setUser} />}
    </div>
  );
}
