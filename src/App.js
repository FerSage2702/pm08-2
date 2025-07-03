import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Auth from "./Auth";
import Cart from "./Cart";
import CreateEditProduct from "./CreateEditProduct";
import Orders from "./Orders";
import Registration from "./Registration";
import Products from "./Products";

function Navigation() {
  const role = getUserRole();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/logo192.jpg" className="w-25 rounded-3" alt="logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Каталог</Link>
            </li>
            {role === "guest" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/registration">Регистрация</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Вход в систему</Link>
                </li>
              </>
            )}
            {role === "client" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Корзина</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">Оформленные заказы</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Выход</Link>
                </li>
              </>
            )}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-edit-product">Добавить товар</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">Выход</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create-edit-product" element={<CreateEditProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;

export function getUserRole() {
  const token = localStorage.getItem("user_token");
  const email = localStorage.getItem("user_email");
  if (!token) return "guest";
  if (email === "admin@souvenir.ru") return "admin";
  return "client";
}
