import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    // Username validation
    if (!username) {
      newErrors.username = "Username is required.";
    }
    // Password validations
    if (!password) {
      newErrors.password = "Password is required.";
    } else {
      if (password === username) {
        newErrors.password = "Password cannot be the same as username.";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password =
          "Password must include at least one special character.";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    await signup({ email, username, password });
    navigate("/subscription");
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
            Sign Up
          </h1>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <div className="text-red-400 text-sm mt-1">{errors.email}</div>
              )}
            </div>
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && (
                <div className="text-red-400 text-sm mt-1">
                  {errors.username}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-transparent text-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && (
                <div className="text-red-400 text-sm mt-1">
                  {errors.password}
                </div>
              )}
            </div>
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
