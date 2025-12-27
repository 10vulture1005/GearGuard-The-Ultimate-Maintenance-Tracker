import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <nav className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
        <h1 className="text-2xl font-black tracking-tighter">APP NAME</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border-2 border-black bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-black hover:text-white"
        >
          LOGOUT
        </button>
      </nav>
      
      <main className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-3xl font-bold">Welcome, {user.name || `User #${user.id}`}</h2>
          <div className="space-y-2">
             <p className="text-xl"><strong>Email:</strong> {user.email}</p>
             <p className="text-xl"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
