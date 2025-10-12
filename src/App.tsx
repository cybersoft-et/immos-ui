import { Routes, Route, BrowserRouter, useParams } from "react-router-dom";
import Login from "./components/core/auth/LoginForm";
import Signup from "./components/core/auth/signUp";
import HomePage from "./components/crm/HomePage";
import Dashboard from "./components/crm/layout/dashboard";
import CustomerForm from "./components/crm/forms/customerForm";
import CustomerList from "./components/crm/tables/customerList";
import CustomerFormUI from "./components/crm/forms/customerFormUI";
import CrmKanbanBoard from "./components/crm/modules/crmKanbanBoard";
import SalesPipeline from "./components/crm/modules/salesPipeLine";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import "./App.css";
import SettingsPage from "./components/crm/layout/SettingsPage";
import QuoteRequestForm from "./components/crm/modules/QuoteRequestForm";
import QuoteRequestFormPortal from "./components/crm/modules/QuoteRequestFormPortal";
import QuoteList from "./components/crm/tables/QuoteList";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuoteRequestFormV2 from "./components/crm/modules/QuoteRequestFormV2";
import QuoteRequestFormV3 from "./components/crm/modules/QuoteRequestFormV3";


// Wrapper components to extract and pass URL parameters
const CustomerFormWithId = () => {
  const { id } = useParams();
  // @ts-ignore
  return <CustomerForm editId={id || null} />;
};

const CustomerViewWithId = () => {
  const { id } = useParams();
  // @ts-ignore
  return <CustomerForm editId={id || null} isViewOnly={true} />;
};

const queryClient = new QueryClient();


const App = () => {

  return (
    <>
     <AuthProvider>
       <BrowserRouter>
       <Routes>        
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>

          <Route path="/" element={<HomePage />}>
            <Route index element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }/>
            <Route path="customerList" element={ 
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }/>

            {/* Customer form routes - nested under Home */}
            <Route path="customerformv2/new" element={ 
              <ProtectedRoute>
                <CustomerFormUI />
              </ProtectedRoute>
            }/>

            <Route path="customerform/new" element={ 
              <ProtectedRoute>
                <CustomerFormWithId />
              </ProtectedRoute>
            }/>

            <Route path="customerform/edit/:id" element={ 
              <ProtectedRoute>
                <CustomerFormWithId />
              </ProtectedRoute>
            }/>

            <Route path="customerform/view/:id" element={ 
              <ProtectedRoute>
                <CustomerViewWithId />
              </ProtectedRoute>
            }/>

            <Route path="crmBoard" element={ 
              <ProtectedRoute>
                <CrmKanbanBoard />
              </ProtectedRoute>
            }/>

            <Route path="salesPipeline" element={ 
              <ProtectedRoute>
                <SalesPipeline />
              </ProtectedRoute>
            }/>

            <Route path="settings" element={ 
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }/>  

            <Route path="requestQuoteList" element={             
              <QueryClientProvider client={queryClient}>
                <QuoteList />
              </QueryClientProvider>
            }/>   

            {/* Quote Request Internal */}
            <Route path="requestquoteinternal" element={ 
              <ProtectedRoute>
                <QuoteRequestForm />
              </ProtectedRoute>
            }/> 

             {/* Quote Request Internal */}
            <Route path="requestquoteinternal" element={ 
              <ProtectedRoute>
                <QuoteRequestForm />
              </ProtectedRoute>
            }/> 
 
            {/* Trial */}
            <Route path="quoteRequestFormV2" element={ 
              <ProtectedRoute>
                <QuoteRequestFormV3 />
              </ProtectedRoute>
            }/>  
                      
            <Route path="*" element={<h1>Not Found</h1>} />       
          </Route>              
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
};

export default App;
