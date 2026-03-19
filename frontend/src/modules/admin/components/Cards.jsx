import { Card, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CardInfo = ({ title, value, color, info, icon }) => {
  return (
    <Card
      style={{
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10px", 
      }}
      bordered={false}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
        <Text type="secondary" style={{ fontSize: '1.1em' }}>{title}</Text>
        {info && (
          <Tooltip title={info}>
            <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
          </Tooltip>
        )}
      </div>
      <div style={{ fontSize: "2.2em", fontWeight: "bold", color: color || "#1a1a1a" }}>
        {icon && <span style={{ marginRight: '8px', fontSize: '0.8em' }}>{icon}</span>}
        {typeof value === "number" && !isNaN(value) 
          ? `$${value.toFixed(2)}` 
          : (value !== null && value !== undefined && !isNaN(Number(value)) ? `$${Number(value).toFixed(2)}` : "$0.00")}
      </div>
    </Card>
  );
};

export default CardInfo;
