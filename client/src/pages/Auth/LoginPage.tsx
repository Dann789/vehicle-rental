import { useNavigate } from 'react-router-dom';
import React, { useEffect,useState } from 'react';
import {loginUser} from '../../services/userService';
import '../../index.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const result = await loginUser(email, password);
    if (!result || !result.token) {
      alert('Login gagal: token tidak ditemukan.');
      return;
    }

    window.location.href = '/dashboard';
  } catch (error) {
    alert((error as Error).message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 bg-[url(../../../public/bg-login.jpg)] bg-center p-12 flex flex-col justify-center items-center relative">
            
          </div>

          {/* Right Section - Login Form */}
          <div className="lg:w-1/2 p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <header className="text-center mb-8 p-0">
                <div className="flex flex-col items-center justify-center mb-6">
                  <h2 className="text-4xl font-bold text-gray-800">
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
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full bg-gray-100 border-gray-200 rounded-2xl px-6 py-7"
                      placeholder="Masukkan email"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-gray-600">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full bg-gray-100 border-gray-200 rounded-2xl px-6 py-7"
                      placeholder="Masukkan password"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm underline cursor-pointer"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-2xl cursor-pointer"
                  >
                    Masuk
                  </button>
                  <div className="flex flex-row justify-center items-center gap-2">
                    <p className="text-gray-600">Belum Punya Akun? </p>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 underline cursor-pointer" onClick={() => navigate('/register')}
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
    </div>
  );
};

export default LoginPage;
