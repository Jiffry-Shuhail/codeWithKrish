import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import OrderManagement from './components/order-management';
import CustomerManagement from './components/customer-management';
import ProductManagement from './components/inventory-managment';
import { MenuItem, Menu, Container } from 'semantic-ui-react'

function App() {

  const [activeName, setActiveName] = React.useState("Order");

  const MenuDetails = [
    { name: "Order", url: '/', element: <OrderManagement />},
    { name: "Customer", url: '/Customer', element:<CustomerManagement/> },
    { name: "Inventory", url: '/Inventory', element:<ProductManagement/> }
  ];

  return (
    <>
      <BrowserRouter>
        <Container>
          <Menu widths={3}>
            {MenuDetails.map(({ name, url }) =>
              <MenuItem as={Link} to={url} active={activeName===name} onClick={()=>setActiveName(name)}>
                {name}
              </MenuItem>)}
          </Menu>
        </Container>

        <Routes>
          {MenuDetails.map(({url, element})=><Route path={url} element={element} />)}
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
