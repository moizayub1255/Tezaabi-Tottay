import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ email, password });
    navigate("/home");
  };

  return (
    <div className="min-h-screen w-full flex flex-col hero-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-3xl font-extrabold text-white">
          Tezaabi Tottay
        </Link>
      </header>
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/80 rounded-lg shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold text-center text-white mb-4">
            Login
          </h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>
          </form>
          <div className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
