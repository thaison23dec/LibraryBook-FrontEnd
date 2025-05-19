import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import BookDetail from './pages/BookDetail'; 


function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      {!hideNav && <NavBar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
           
        </Routes>
      </main>
    </div>
  );
}

export default App;
