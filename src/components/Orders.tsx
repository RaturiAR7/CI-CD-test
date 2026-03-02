import Card from "./Card";
import { orderData } from "../constants/orderData";
import { useState } from "react";

const Orders = () => {
  const [orders] = useState(orderData);
  return (
    <div className="w-full h-screen text-center">
      <h1 className="text-5xl font-extrabold m-10">Order Cards</h1>
      <div className="flex gap-10 justify-center items-center w-full h-full">
        {orders.map((order) => {
          return <Card key={order.id} order={order} />;
        })}
      </div>
    </div>
  );
};

export default Orders;
