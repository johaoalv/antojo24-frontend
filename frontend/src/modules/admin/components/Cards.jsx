import { Card, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const formatMoney = (v) => {
  if (typeof v === "number" && !isNaN(v)) return `$${v.toFixed(2)}`;
  if (v !== null && v !== undefined && !isNaN(Number(v))) return `$${Number(v).toFixed(2)}`;
  return "$0.00";
};

const CardInfo = ({ title, value, color, info, icon, subItems }) => {
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
        {formatMoney(value)}
      </div>
      {subItems && subItems.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
          {subItems.map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '0.75em', background: '#222', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>{item.label}</Text>
              <div style={{ fontSize: '0.95em', marginTop: 2 }}>{formatMoney(item.value)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CardInfo;
