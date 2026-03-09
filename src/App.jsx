import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Auth from './components/Auth';
import { supabase } from './main'; // This now works because we exported it above

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1012] flex items-center justify-center">
      {user ? (
        <Chat user={user} />
      ) : (
        <Auth onAuthSuccess={setUser} />
      )}
    </div>
  );
}
