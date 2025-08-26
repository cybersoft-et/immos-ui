import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

export default function LoginForm () {

  const [formData, setFormData] = useState({ userName: "PAGAdmin", password: "RipeApricot2025" });
  const [errorMsg, setError] = useState("");
  const [successMsg, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    console.log("Login -> formData", formData);

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
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white flex flex-col justify-center p-12">
        <h1 className="text-3xl font-bold">MTMS</h1>
        <p className="text-gray-600">Multimodal Transport Management</p>

        <h2 className="mt-8 text-2xl font-bold">Login </h2>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}                  
              placeholder="e.g: admin@pag.com"
              className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
              
            />
          </div>

          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}                  
              placeholder="Password"
              className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
              
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600">
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          <p>
            Do you have an account? <span className="text-orange-500 cursor-pointer"> <a href="/signup">SignUp </a></span>
          </p>
          <p className="mt-1 cursor-pointer"><a href="/forgotCredentials">Forgot your password? </a></p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-orange-500 font-bold text-lg">Panafric</p>
          <p className="text-gray-600">Global Logistics</p>
        </div>
      </div>
      
      <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('./src/assets/crm_background.jpg')" }}></div>
    </div>
  );  
};

