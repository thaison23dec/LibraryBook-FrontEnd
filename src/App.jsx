import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/home';
import Register from './pages/Register';
import EditCustomer from './pages/admin/customer/edit';
import ListCustomer from './pages/admin/customer/list';
import ListBook from './pages/admin/book/list';
import EditBook from './pages/admin/book/edit';
import EditCategory from './pages/admin/category/edit';
import ListEmployee from './pages/admin/employee/list';
import EditEmployee from './pages/admin/employee/edit';
import ListInvoice from './pages/admin/invoice/list';
import InvoiceDetail from './pages/admin/invoice/detail';
import AdminChangePassword from './pages/admin/profile/changePassword';
import AdminProfile from './pages/admin/profile/profile';
import ListRental from './pages/admin/rental/list';
import RentalDetail from './pages/admin/rental/detail';
import Payment from './pages/admin/rental/payment';

import BookCase from './pages/user/bookCase';
import BookDetail from './pages/user/bookDetail';
import FavoriteBook from './pages/user/favoriteBook';
import Bill from './pages/user/bill';
import BillDetail from './pages/user/billDetail';
import Borrowed from './pages/user/borrowed';
import Borrowing from './pages/user/borrowing';
import ChangePassword from './pages/user/changePassword';
import Account from './pages/user/account';
import BookCart from './pages/user/bookCart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/editCustomer" element={<EditCustomer />} />
      <Route path="/listCustomer" element={<ListCustomer />} />
      <Route path="/listBook" element={<ListBook />} />
      <Route path="/editBook/:id?" element={<EditBook />} />
      <Route path="/editCategory/:id?" element={<EditCategory />} />
      <Route path="/listEmployee" element={<ListEmployee />} />
      <Route path="/editEmployee/:id?" element={<EditEmployee />} />
      <Route path="/listInvoice" element={<ListInvoice />} />
      <Route path="/invoiceDetail/:id?" element={<InvoiceDetail />} />
      <Route path="/adminChangePassword" element={<AdminChangePassword />} />
      <Route path="/adminProfile" element={<AdminProfile />} />
      <Route path="/listRental" element={<ListRental />} />
      <Route path="/rentalDetail/:id?" element={<RentalDetail />} />
      <Route path="/payment/:id?" element={<Payment />} />
      
      <Route path="/bookCase" element={<BookCase />} />
      <Route path="/bookDetail/:id?" element={<BookDetail />} />
      <Route path="/favoriteBook" element={<FavoriteBook />} />
      <Route path="/bill" element={<Bill />} />
      <Route path="/bill_detail" element={<BillDetail />} />
      <Route path="/borrowed" element={<Borrowed />} />
      <Route path="/borrowing" element={<Borrowing />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/account" element={<Account />} />
      <Route path="/bookCart" element={<BookCart />} />
    </Routes>
  );
}

export default App;
