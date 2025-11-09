import { Card } from "antd";

const CardInfo = ({ title, value }) => {
  return (
    <Card
      style={{
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        flex: "1 1 300px",
        maxWidth: "400px", 
        padding: "20px", 
      }}
    >
      <p style={{ color: "#666", fontSize: "1.2em", marginBottom: "10px" }}>{title}</p>
      <h2 style={{ fontSize: "36px", fontWeight: "bold" }}>
        {typeof value === "number" ? `$${value.toFixed(2)}` : value}
      </h2>
    </Card>
  );
};

export default CardInfo;
