import React from "react";
import { Button } from "antd";

const colors = {
  background: "#FFD60A",
  content: "#000000",
  disabledBg: "#FFE58F",
  disabledContent: "#666666",
};

const SecondaryButton = ({
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
      type="default"
      size="large"
      block
      disabled={disabled}
      icon={renderIcon}
      style={{
        backgroundColor,
        borderColor: backgroundColor,
        color: textColor,
        border: `3px solid ${backgroundColor}`,
        fontWeight: 700,
        fontSize: "2em",
        height: 70,
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={["secondary-button", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;
