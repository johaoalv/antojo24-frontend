import { Card } from "antd";

const CardInfo = ({ title, value }) => {
  return (
    <Card
      style={{
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        flex: "1 1 250px", // Hace que las cards se adapten
        maxWidth: "300px", // Evita que sean muy anchas
      }}
    >
      <p style={{ color: "#666" }}>{title}</p>
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
        {typeof value === "number" ? `$${value.toFixed(2)}` : value}
      </h2>
    </Card>
  );
};

export default CardInfo;
