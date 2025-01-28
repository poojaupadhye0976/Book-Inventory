import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import Categories from './Components/Categories'; // Import the Categories component
import { jwtDecode } from 'jwt-decode';
// import authors from './Components/Authors';
import 'bootstrap/dist/css/bootstrap.min.css';
import Authors from './Components/Authors';
import Books from './Components/Books';
import { useEffect } from 'react';

function App() {


  return (

    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} /> {/* Add the Categories route */}
        <Route path="/authors" element={<Authors/>} />
        <Route path="/books" element={<Books/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
