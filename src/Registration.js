import React, { useState } from "react";

function Registration() {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validate = () => {
    const newErrors = {};
  
   
    const nameParts = full_name.trim().split(/\s+/);
    if (nameParts.length < 2 || !/^[А-Яа-яЁё\s\-]+$/.test(full_name)) {
      newErrors.full_name = "Введите полное имя на кириллице (минимум 2 слова)";
    }
  

  
   
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Пароль должен содержать минимум 6 символов, включая заглавную и строчную буквы, цифру и спецсимвол";
    }
  
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccess(false);

    if (!validate()) return;

    try {
      const response = await fetch("https://exam.xn--80ahdri7a.site/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 422) {
          setGlobalError("Ошибка валидации на сервере");
        } else {
          setGlobalError("Ошибка регистрации: " + (data.message || "Неизвестная ошибка"));
        }
        return;
      }

      if (data.data?.user_token) {
        setSuccess(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
        setGlobalError("Не удалось получить токен. Ответ сервера: " + JSON.stringify(data));
      }
    } catch (err) {
      setGlobalError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <>
      <main style={{ minHeight: "70vh" }}>
        <h2 className="text-center text-white bg-primary m-2">Регистрация</h2>
        <div className="p-3">
          {success && (
            <div className="alert alert-success text-center">Регистрация успешна! Токен получен.</div>
          )}
          {globalError && (
            <div className="alert alert-danger text-center">{globalError}</div>
          )}
          <form className="w-50 m-auto border p-3" style={{ minWidth: "300px" }} onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Введите ФИО:</label>
              <input
                type="text"
                className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                id="name"
                value={full_name}
                onChange={e => setFullName(e.target.value)}
                required
              />
              {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Введите адрес электронной почты</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              <div className="form-text">Мы никогда не делимся Вашими e-mail ни с кем. Обязательное поле</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Введите пароль:</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="confirm_password" className="form-label">Повторите пароль:</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                id="confirm_password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <input type="submit" className="btn btn-primary" value="Зарегистрироваться" />
          </form>
        </div>
      </main>
      <footer className="border-bottom bg-primary px-5">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2024</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default Registration;
