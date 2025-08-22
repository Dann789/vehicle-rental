import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { loginUser } from '../../services/userService';
import '../../index.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi wajib isi
    let hasError = false;
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password tidak boleh kosong');
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    setError('');
    try {
      const result = await loginUser(email, password);
      if (!result || !result.token) {
        setError('Login gagal: token tidak ditemukan.');
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md shadow-2xl border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Section - Illustration & Tagline */}
          <div className="lg:w-1/2 bg-[url(../../../public/bg-login.jpg)] bg-cover bg-center p-8 flex flex-col justify-center items-center relative">
          </div>

          {/* Right Section - Login Form */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-white/80">
            <div className="max-w-md mx-auto w-full">
              <header className="text-center mb-8 p-0">
                <div className="flex flex-col items-center justify-center mb-6">
                  <h2 className="text-4xl font-bold text-gray-800 animate-slide-up">
                    VEHICLE <span className="text-blue-600">RENTAL</span>
                  </h2>
                </div>
              </header>

              <div className="p-0">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-gray-600">
                      Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim()) setEmailError('');
                      }}
                      className={`h-12 w-full bg-gray-100 border-2 rounded-2xl px-6 py-7 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${emailError ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Masukkan email"
                      autoComplete="username"
                    />
                    {emailError && (
                      <span className="text-red-500 text-sm">{emailError}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-gray-600">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.trim()) setPasswordError('');
                      }}
                      className={`h-12 w-full bg-gray-100 border-2 rounded-2xl px-6 py-7 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${passwordError ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                    />
                    {passwordError && (
                      <span className="text-red-500 text-sm">{passwordError}</span>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center animate-shake">
                      {error}
                    </div>
                  )}

                  <div className="text-right">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm underline cursor-pointer transition-colors duration-200"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-2xl cursor-pointer shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mr-2 inline-block align-middle"></span>
                    ) : null}
                    {loading ? 'Memproses...' : 'Masuk'}
                  </button>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <p className="text-gray-600">Belum Punya Akun? </p>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors duration-200"
                      onClick={() => navigate('/register')}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loader CSS */}
      <style>{`
        .loader {
          border-top-color: #3498db;
          animation: spinner 0.6s linear infinite;
        }
        @keyframes spinner {
          to {transform: rotate(360deg);}
        }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.8s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes slideDown {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.3s linear;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
