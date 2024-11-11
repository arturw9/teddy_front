import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import CustomerList from './components/CustomerList/CustomerList';
import FormPage from './components/FormPage/FormPage'; 

function App() {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<FormPage />} />  
        <Route path="/customer-list" element={<CustomerList />} />
      </Routes>
    </Router>
  );
}

export default App;
