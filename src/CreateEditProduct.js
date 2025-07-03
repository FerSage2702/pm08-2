import React, { useState } from "react";

function CreateEditProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("user_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const response = await fetch("https://exam.xn--80ahdri7a.site/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description, price })
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.error && data.error.code === 422) {
          setError("Ошибка валидации");
          return;
        }
        throw new Error("Ошибка добавления товара");
      }
      setSuccess(true);
      setName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      setError(err.message || "Ошибка добавления товара");
    }
  };

  return (
    <>
      <main style={{ minHeight: "70vh" }}>
        <h2 className="text-center text-white bg-primary m-2">Добавление товара</h2>
        <div className="p-3">
          {success && (
            <div className="alert alert-success text-center">Товар успешно добавлен!</div>
          )}
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          <form className="w-50 m-auto border border-primary p-3" style={{ minWidth: "300px" }} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="product" className="form-label">
                Введите наименование товара:
              </label>
              <input type="text" className="form-control" id="product" value={name} onChange={e => setName(e.target.value)} required />
              <div className="form-text">Обязательное поле</div>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Цена товара:
              </label>
              <input type="number" className="form-control" id="price" value={price} onChange={e => setPrice(e.target.value)} required />
              <div className="form-text">Обязательное поле</div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Описание товара:
              </label>
              <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
              <div className="form-text">Обязательное поле.</div>
            </div>
            <input type="submit" className="btn btn-primary form-control" value="Отправить" />
          </form>
        </div>
      </main>
      <footer className="border-bottom bg-primary">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2022</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default CreateEditProduct; 