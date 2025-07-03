import React, { useState, useEffect } from "react";
import './bootstrap.min.css';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const response = await fetch("https://exam.xn--80ahdri7a.site/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error && data.error.code === 422) {
          setError("Неправильный email или пароль");
          return;
        }
        if (data.error && data.error.code === 401) {
          setError("Неправильный email или пароль");
          return;
        }
        setError("Неправильный email или пароль");
        return;
      }
      if (data.data && data.data.user_token) {
        localStorage.setItem("user_token", data.data.user_token);
        localStorage.setItem("user_email", email);
        setSuccess(true);
        setIsLoggedIn(true);
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      setError(err.message || "Неправильный логин или пароль");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    setSuccess(false);
    setEmail("");
    setPassword("");
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <>
      <main style={{ minHeight: "70vh" }}>
        <h2 className="text-center text-white bg-primary m-2">Аутентификация</h2>
        <div className="p-3">
          {isLoggedIn ? (
            <div className="text-center">
              <div className="alert alert-info">Вы уже вошли в систему.</div>
              <button className="btn btn-danger" onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
          ) : (
            <>
              {success && (
                <div className="alert alert-success text-center">Вход выполнен успешно! Токен сохранён.</div>
              )}
              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}
              <form className="w-50 m-auto border p-3" style={{ minWidth: "300px" }} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Введите адрес электронной почты
                  </label>
                  <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  <div className="form-text">
                    Мы никогда не делимся Вашими e-mail ни с кем. Обязательное поле
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Введите пароль:
                  </label>
                  <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  <div className="form-text">Обязательное поле</div>
                </div>
                <input type="submit" className="btn btn-primary" value="Войти" />
              </form>
            </>
          )}
        </div>
      </main>
      <footer className="border-bottom bg-primary px-5">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2024</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default Auth; 