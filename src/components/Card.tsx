import type { OrderType } from "../constants/types";

interface CardProps {
  order: OrderType;
}

const Card: React.FC<CardProps> = ({ order }) => (
  <div className="w-72 p-4 border rounded space-y-2">
    <div>
      <p>
        <strong>User:</strong> {order.id}
      </p>
      <p>
        <strong>Total:</strong> ${order.total}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
    </div>

    <div>
      <p className="font-semibold">Products</p>
      <ul className="list-disc list-inside">
        {order.products.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </div>

    <div>
      <p className="font-semibold">Tags</p>
      <ul className="list-disc list-inside">
        {order.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default Card;
