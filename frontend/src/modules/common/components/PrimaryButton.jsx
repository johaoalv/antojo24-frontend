import React from "react";
import { Button } from "antd";

const colors = {
  background: "#000000",
  content: "#FFD60A",
  disabledBg: "#333333",
  disabledContent: "#999999",
};

const PrimaryButton = ({
  children,
  icon = null,
  style = {},
  disabled = false,
  className = "",
  ...props
}) => {
  const textColor = disabled ? colors.disabledContent : colors.content;
  const backgroundColor = disabled ? colors.disabledBg : colors.background;
  const renderIcon =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon, {
          style: { color: textColor, ...(icon.props?.style || {}) },
        })
      : icon;

  return (
    <Button
      type="primary"
      size="large"
      block
      disabled={disabled}
      icon={renderIcon}
      style={{
        backgroundColor,
        borderColor: backgroundColor,
        color: textColor,
        fontWeight: 700,
        fontSize: "2em",
        height: 70,
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: disabled ? "none" : "0 4px 12px rgba(0, 0, 0, 0.2)",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={["primary-button", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
