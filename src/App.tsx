import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./components/core/login";
import "./App.css";
import Signup from "./components/core/Signup";
import Dashboard from "./components/crm/dashboard";

const App = () => {

  return (
    <>
     <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Login /> } /> 
        <Route path="/dashboard" element={<Dashboard /> } />                  
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
