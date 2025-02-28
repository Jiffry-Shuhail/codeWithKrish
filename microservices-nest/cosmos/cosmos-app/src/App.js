import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import OrderManagement from './components/order-management';

function App() {
  return (
    <>
    <BrowserRouter>
      <div>
        <nav>
          <Navigation nav={"Order Managment"} url={"/order-management"}></Navigation>
        </nav>
      </div>

      <Routes>
        <Route path="/order-management" element={<OrderManagement/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

const Navigation=({nav, url})=>(
  <li>
    <Link to={url}>{nav}</Link>
  </li>
)

export default App;
