// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./hooks";

export default function Signup() {

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errorMsg , setErrMsg] = useState("");
  const [successMsg , setSuccMsg] = useState("");

  const navigate = useNavigate();
  const mutation = useRegister();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    setSuccMsg("");

    console.log('Signup -> formData', formData);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrMsg("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }

    mutation.mutate(
      { email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword },
      {
        onSuccess: (data) => {
          console.log('Success:', data);
          navigate('/login');
        },
        onError: (error) => {
          console.log('Error:', error);
        },
      }
    );
  };

  return (
        <div className="flex h-screen bg-gray-100">
          {/* Left Section */}
          <div className="w-1/3 bg-white flex flex-col justify-center p-12">
            <h1 className="text-3xl font-bold">MTMS</h1>
            <p className="text-gray-600">Multimodal Transport Management</p>
    
            <h2 className="mt-8 text-2xl font-bold">Create account</h2>
            {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}
            
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

