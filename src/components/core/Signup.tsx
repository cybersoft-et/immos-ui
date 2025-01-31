import React, { useState } from "react";

export default function Signup() {

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    console.log('Signup -> formData', formData);
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setSuccess("Account created successfully!");
  };

  return (
        <div className="flex h-screen bg-gray-100">
          {/* Left Section */}
          <div className="w-1/3 bg-white flex flex-col justify-center p-12">
            <h1 className="text-3xl font-bold">MTMS</h1>
            <p className="text-gray-600">Multimodal Transport Management</p>
    
            <h2 className="mt-8 text-2xl font-bold">Create account</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g: Abebe@gmail.com"
                  className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
                  required
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
                  required
                />
              </div>
    
              <div>
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}                  
                  placeholder="Confirm Password"
                  className="w-full p-2 mt-1 border rounded-lg bg-gray-100"
                  required
                />
              </div>
    
              <button  type="submit" className="w-full py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600">
                Create my account
              </button>
            </form> 
    
            <div className="mt-4 text-center text-gray-600">
              <p>
                <a href="/login">Already have an account? <span className="text-orange-500 cursor-pointer">Login</span></a>
              </p>
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


