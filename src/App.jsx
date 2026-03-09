import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Auth from './components/Auth';

export default function App() {
  // We track the username string now, not the user object
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for the username
    const savedUser = localStorage.getItem('chat_username');
    if (savedUser) {
      setUsername(savedUser);
    }
    setLoading(false);
  }, []);

  // Logout function to be used inside Chat
  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    setUsername(null);
  };

  if (loading) return <div className="text-white flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1012] flex items-center justify-center">
      {username ? (
        // Pass both the username and the logout function to the Chat
        <Chat username={username} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={setUsername} />
      )}
    </div>
  );
}
