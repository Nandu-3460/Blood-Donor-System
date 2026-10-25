import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, Mail, Lock, Heart, CheckCircle2 } from 'lucide-react';
import Alert from '../components/Alert';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [wantToDonate, setWantToDonate] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      // If user indicated interest in becoming a donor, redirect to donor profile creation
      if (wantToDonate) {
        navigate('/donor-profile?welcome=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blood-600 items-center justify-center text-white shadow-lg shadow-blood-600/30 mb-3">
            <Droplet className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Join the community to find donors or pledge blood donations
          </p>
        </div>

        <div className="card p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-with-icon"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-with-icon"
                />
              </div>
            </div>

            <div>
              <label className="label">Password (Min 6 characters)</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-with-icon"
                />
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Donor Opt-in checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-blood-100 bg-blood-50/50 cursor-pointer hover:bg-blood-50 transition">
                <input
                  type="checkbox"
                  checked={wantToDonate}
                  onChange={(e) => setWantToDonate(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blood-600 focus:ring-blood-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-blood-600 fill-blood-600" />
                    I would like to register as a blood donor
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    You'll be prompted to provide your blood group and city after registering.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 font-semibold text-base mt-2"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blood-600 hover:text-blood-700 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
