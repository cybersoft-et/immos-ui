import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/core/login";
import "./App.css";
import Signup from "./components/core/Signup";
import Dashboard from "./crm/dashboard";

const App = () => {

  return (
    <Router>
      <Routes>        
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Login /> } /> 
        <Route path="/dashboard" element={<Dashboard /> } />                  
      </Routes>
    </Router>
  );
};

export default App;
