import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";
import Login from "./components/core/auth/login";
import Signup from "./components/core/auth/signUp";
import Home from "./components/crm/home";
import "./App.css";
import Dashboard from "./components/crm/layout/dashboard";
import CustomerForm from "./components/crm/forms/customerForm";
import CustomerList from "./components/crm/tables/customerList";
import CustomerFormUI from "./components/crm/forms/customerFormUI";
import CRMKanbanBoard3 from "./components/crm/modules/crmKanbanBoard3";
import CRMKanbanBoard2 from "./components/crm/modules/crmKanbanBoard2";
import SalesPipeline from "./components/crm/modules/salesPipeLine";

// Wrapper components to extract and pass URL parameters
const CustomerFormWithId = () => {
  const { id } = useParams();
  return <CustomerForm editId={id} />;
};

const CustomerViewWithId = () => {
  const { id } = useParams();
  return <CustomerForm editId={id} isViewOnly={true} />;
};

const App = () => {

  return (
    <>
     <BrowserRouter>
      <Routes>        
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        <Route path="/" element={<Home />}>
          <Route index element={< Dashboard/>} />
          <Route path="customerList" element={<CustomerList /> } />

          {/* Customer form routes - nested under Home */}
          <Route path="customerformv2/new" element={<CustomerFormUI />} />
          <Route path="customerform/new" element={<CustomerFormWithId />} />
          <Route path="customerform/edit/:id" element={<CustomerFormWithId />} />
          <Route path="customerform/view/:id" element={<CustomerViewWithId />} />
          
          <Route path="crmBoard" element={<CRMKanbanBoard3 /> } />
          <Route path="salesPipeline" element={<SalesPipeline /> } />

          <Route path="*" element={<h1>Not Found</h1>} />       
        </Route>              
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
