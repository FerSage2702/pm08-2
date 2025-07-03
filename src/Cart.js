import React, { useEffect, useState, useCallback } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const token = localStorage.getItem("user_token");

 
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://exam.xn--80ahdri7a.site/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Ошибка загрузки корзины");
      const data = await response.json();
      console.log('Ответ сервера /cart:', data);
      setCart(data);
    } catch (err) {
      setError(err.message || "Ошибка загрузки корзины");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`https://exam.xn--80ahdri7a.site/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Ошибка удаления товара");
      // После удаления обновляем корзину
      setCart(cart.filter(item => item.id !== productId));
    } catch (err) {
      setError(err.message || "Ошибка удаления товара");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = async () => {
    setOrderError("");
    setOrderSuccess(false);
    try {
      const response = await fetch("https://exam.xn--80ahdri7a.site/order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error("Ошибка оформления заказа");
      setOrderSuccess(true);
      await fetchCart(); // теперь корзина обновится с сервера
    } catch (err) {
      setOrderError(err.message || "Ошибка оформления заказа");
    }
  };

  if (loading) return <div className="text-center p-3">Загрузка корзины...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <>
      <main style={{ minHeight: "70vh" }}>
        <h2 className="text-center text-white bg-primary m-2">Корзина</h2>
        {cart.length === 0 ? (
          <div className="text-center">Корзина пуста</div>
        ) : (
          <>
            {orderSuccess && (
              <div className="alert alert-success text-center">Заказ успешно оформлен!</div>
            )}
            {orderError && (
              <div className="alert alert-danger text-center">{orderError}</div>
            )}
            <table className="table my-3 mx-auto w-75 table-hover table-responsive">
              <thead>
                <tr>
                  <th scope="col">№ п/п</th>
                  <th scope="col">Наименование</th>
                  <th scope="col">Описание</th>
                  <th scope="col">Количество</th>
                  <th scope="col">Стоимость</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={item.id}>
                    <th scope="row">{idx + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>1</td>
                    <td>{item.price}</td>
                    <td>
                      <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="fw-bold text-end w-75 m-auto">Итого: {total} руб</p>
            <div className="text-end w-75 m-auto">
              <button className="btn btn-primary" onClick={handleOrder}>Оформить заказ</button>
            </div>
          </>
        )}
      </main>
      <footer className="border-bottom bg-primary px-5">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2024</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default Cart; 