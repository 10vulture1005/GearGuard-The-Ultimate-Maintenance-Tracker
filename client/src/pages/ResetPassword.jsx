import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // The provided edit changed the payload to { email, newPassword, confirmNewPassword }
      // and added `const { data } =`.
      // The original code used { token, newPassword: password }.
      // Assuming the intent is to use the new payload structure from the edit,
      // but keeping the `token` from the URL param as it's a reset password flow.
      // Also, correcting the syntax for headers.
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { token, newPassword: password, confirmNewPassword: password }, // Adjusted payload based on edit's structure and original context
        { headers: { 'Content-Type': 'application/json' } }
      );

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tighter">
          RESET PASSWORD
        </h2>

        {error && (
          <p className="mb-4 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              NEW PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black p-3"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 font-bold text-white"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
}
