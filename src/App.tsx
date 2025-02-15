import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./components/core/login";
import "./App.css";
import Signup from "./components/core/Signup";
import Formcustomer from "./components/crm/formcustomer";
import Home from "./components/crm/home";
import Dashboard from "./components/crm/layout/dashboard";
import GridCustomers from "./components/crm/gridCustomer";

const App = () => {

  return (
    <>
     <BrowserRouter>
      <Routes>        
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customerform" element={<Formcustomer /> } />   
          {/* <Route path="Customermanagment" element={<FormCustomerManagment /> } />    */}
          <Route path="customerform/:id" element={<Formcustomer /> } />    
          <Route path="gridcustomers" element={<GridCustomers /> } />
          <Route path="*" element={<h1>Not Found</h1>} />       
        </Route>              
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
