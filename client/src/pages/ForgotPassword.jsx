import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/auth/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Option 2: auto redirect with token
      if (data.resetToken) {
        navigate(`/reset-password?token=${data.resetToken}`);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tighter">
          FORGOT PASSWORD
        </h2>

        {error && (
          <p className="mb-4 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black p-3"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 font-bold text-white"
          >
            SEND RESET LINK
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-bold underline hover:no-underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
