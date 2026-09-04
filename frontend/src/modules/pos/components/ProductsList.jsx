import React from "react";
import { Row, Col, Card, Typography } from "antd";
import { formatCurrency } from "../utils/formatters";
import { getProductImage } from "../utils/imageMapper";

const { Title, Text } = Typography;

const ProductsList = ({ productos, onAddProduct, loading }) => {
  if (loading) {
    return <div style={{ padding: 20, color: "#888", fontSize: 16, textAlign: "center", width: "100%" }}>Cargando productos...</div>;
  }
  if (!productos || productos.length === 0) {
    return <div style={{ padding: 20, color: "#888", fontSize: 16, textAlign: "center", width: "100%" }}>No hay productos disponibles</div>;
  }

  return (
    <div style={{ padding: "8px 4px 20px 4px" }}>
      <Row gutter={[16, 16]}>
        {productos.map((item) => {
          const nombre = item.nombre || item.producto;
          const precio = item.precio;

          return (
            <Col xs={12} sm={12} md={8} xl={6} xxl={4} key={item.id || nombre}>
              <Card
                hoverable
                onClick={() => onAddProduct(nombre)}
                styles={{ body: { padding: "12px 10px" } }}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                  }}>
                      <img
                        src={getProductImage(item)}
                        alt={nombre}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                          transition: "transform 0.2s ease-in-out"
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                  </div>
                }
              >
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
                  <Title level={5} style={{ margin: "0 0 10px 0", fontSize: "0.95rem", lineHeight: 1.2, color: "#222" }}>
                    {nombre.toUpperCase()}
                  </Title>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Text strong style={{ 
                        color: "#FFD60A", 
                        background: "#111", 
                        padding: "3px 10px", 
                        borderRadius: "8px", 
                        fontSize: "1.05rem" 
                    }}>
                      {formatCurrency(precio)}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ProductsList;
