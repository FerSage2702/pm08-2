import React, { useEffect, useState } from "react";
import { getUserRole } from "./App";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addStatus, setAddStatus] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "", price: "" });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const token = localStorage.getItem("user_token");
  const role = getUserRole();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("https://exam.xn--80ahdri7a.site/products");
        if (!response.ok) throw new Error("Ошибка загрузки товаров");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Ошибка загрузки товаров");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) {
      setAddStatus((prev) => ({ ...prev, [productId]: { success: false, message: "Требуется войти в систему" } }));
      return;
    }
    try {
      const response = await fetch(`https://exam.xn--80ahdri7a.site/cart/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error("Ошибка добавления в корзину");
      setAddStatus((prev) => ({ ...prev, [productId]: { success: true, message: "Добавлено!" } }));
    } catch (err) {
      setAddStatus((prev) => ({ ...prev, [productId]: { success: false, message: err.message || "Ошибка" } }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот товар?")) return;
    try {
      const response = await fetch(`https://exam.xn--80ahdri7a.site/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Ошибка удаления товара");
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || "Ошибка удаления товара");
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({ name: product.name, description: product.description, price: product.price });
    setEditError("");
    setEditSuccess("");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setEditError("");
    setEditSuccess("");
    try {
      const response = await fetch(`https://exam.xn--80ahdri7a.site/product/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.error && data.error.code === 422) {
          setError("Ошибка валидации");
          return;
        }
        throw new Error("Ошибка изменения товара");
      }
      setProducts(products.map(p => p.id === id ? { ...p, ...editData } : p));
      setEditSuccess("Товар изменён!");
      setEditId(null);
    } catch (err) {
      setEditError(err.message || "Ошибка изменения товара");
    }
  };

  if (loading) return <div className="text-center p-3">Загрузка товаров...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <>
    <main style={{ minHeight: "70vh" }}>
      <h2 className="text-center text-white bg-primary m-2">Каталог товаров</h2>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100">
                <div className="card-body">
                  {editId === product.id ? (
                    <>
                      <input className="form-control mb-2" name="name" value={editData.name} onChange={handleEditChange} />
                      <textarea className="form-control mb-2" name="description" value={editData.description} onChange={handleEditChange} />
                      <input className="form-control mb-2" name="price" type="number" value={editData.price} onChange={handleEditChange} />
                      <button className="btn btn-success me-2" onClick={() => handleEditSave(product.id)}>Сохранить</button>
                      <button className="btn btn-secondary" onClick={() => setEditId(null)}>Отмена</button>
                      {editError && <div className="text-danger mt-2">{editError}</div>}
                      {editSuccess && <div className="text-success mt-2">{editSuccess}</div>}
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text fw-bold">Цена: {product.price} руб.</p>
                      {role === "admin" ? (
                        <>
                          <button className="btn btn-secondary rounded-pill m-2" onClick={() => startEdit(product)}>Изменить</button>
                          <button className="btn btn-danger rounded-pill" onClick={() => handleDelete(product.id)}>Удалить</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            Добавить в корзину
                          </button>
                          {addStatus[product.id] && (
                            <div className={`mt-2 ${addStatus[product.id].success ? "text-success" : "text-danger"}`}>
                              {addStatus[product.id].message}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <footer className="border-bottom bg-primary px-5">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2024</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default Products; 