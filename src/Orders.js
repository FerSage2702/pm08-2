import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    async function fetchOrdersAndProducts() {
      setLoading(true);
      setError("");
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("https://exam.xn--80ahdri7a.site/order", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://exam.xn--80ahdri7a.site/products")
        ]);
        if (!ordersRes.ok) throw new Error("Ошибка загрузки заказов");
        if (!productsRes.ok) throw new Error("Ошибка загрузки товаров");
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || "Ошибка загрузки заказов");
      } finally {
        setLoading(false);
      }
    }
    fetchOrdersAndProducts();
  }, [token]);

  const getProductName = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : `ID ${id}`;
  };

  if (loading) return <div className="text-center p-3">Загрузка заказов...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <>
      <main style={{ minHeight: "70vh" }}>
        <h2 className="text-center text-white bg-primary m-2">Оформленные заказы</h2>
        {orders.length === 0 ? (
          <div className="text-center">У вас нет оформленных заказов</div>
        ) : (
          <table className="table my-3 mx-auto w-75 table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col">№ заказа</th>
                <th scope="col">Товары</th>
                <th scope="col">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id || idx}>
                  <th scope="row">{order.id || idx + 1}</th>
                  <td>
                    {order.products && Array.isArray(order.products)
                      ? order.products.map((pid, i) => (
                          <div key={i}>{getProductName(pid)}</div>
                        ))
                      : "-"}
                  </td>
                  <td>{order.order_price || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <footer className="border-bottom bg-primary px-5">
        <p className="text-white p-3">МАТРЕШКА © Copyright, 2024</p>
        <p className="text-white p-3">Все права защищены</p>
      </footer>
    </>
  );
}

export default Orders; 