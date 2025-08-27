import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { Eye, EyeOff, User, Lock, Truck, MapPin, Package } from 'lucide-react';

export default function LoginForm () {

  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [errorMsg, setError] = useState("");
  const [successMsg, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);


    if (!formData.userName || !formData.password ) {
      setError("All fields are required.");
      return;
    }

    try {
      const success = await login(formData.userName, formData.password);
      if (success) {
        navigate(from, { replace: true });
        setSuccess('Login Authenticated Successfully.');
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cyber-PAG-MTMS</h1>
            <p className="text-gray-600 font-medium">Multimodal Transport Management</p>
            {/* <p className="text-sm text-gray-500 mt-1">Welcome back </p> */}

            {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}
          </div>

          {/* Login Form Card */}
          {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"> */}
           <form className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8" onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your <b>Customer Relationship Management</b></p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                    placeholder="Enter your UserName"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  Sign Up
                </a>
              </p>
            </div>
            </form>
          {/* </div> */}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Panafric Global Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative Background */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 gap-4 h-full w-full p-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-lg animate-pulse"
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Central Globe */}
            <div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
              <div className="w-64 h-64 rounded-full bg-white/5 flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Panafric Global Logistics</h3>
                  <p className="text-lg opacity-80">Unsurpassed Professional Logistics Services & Excellence</p>
                </div>
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-8 left-8 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-16 right-16 animate-bounce" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute bottom-16 left-16 animate-bounce" style={{ animationDelay: '1.5s' }}>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-12 left-12 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Streamline Your Operations
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Manage your multimodal transport operations with our comprehensive logistics platform.
          </p>
        </div>
      </div>
    </div>
  );
};

