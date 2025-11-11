import React from "react";
import { notification } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";

const COLORS = {
  background: "#0c0c0c",
  border: "#ffd60a",
  text: "#ffd60a",
  success: "#52c41a",
  error: "#ff4d4f",
  warning: "#faad14",
  info: "#40a9ff",
};

const iconMap = {
  success: <CheckCircleFilled style={{ color: COLORS.success, fontSize: 28 }} />,
  error: <CloseCircleFilled style={{ color: COLORS.error, fontSize: 28 }} />,
  warning: (
    <ExclamationCircleFilled style={{ color: COLORS.warning, fontSize: 28 }} />
  ),
  info: <InfoCircleFilled style={{ color: COLORS.info, fontSize: 28 }} />,
};

const openCorporateNotification = ({
  type = "info",
  message,
  description,
  placement = "topRight",
  duration = 4,
  ...rest
}) => {
  const baseStyle = {
    backgroundColor: COLORS.background,
    border: `2px solid ${COLORS.border}`,
    borderRadius: 20,
    padding: "0",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
  };

  notification.open({
    className: "corporate-notification",
    style: baseStyle,
    message: (
      <span style={{ fontSize: "1.4em", fontWeight: 700 }}>{message}</span>
    ),
    description: description ? (
      <span style={{ fontSize: "1.2em", color: "#f5f5f5" }}>{description}</span>
    ) : null,
    icon: iconMap[type] || iconMap.info,
    placement,
    duration,
    closeIcon: (
      <CloseOutlined
        style={{ color: COLORS.text, fontSize: 18, padding: "8px" }}
      />
    ),
    ...rest,
  });
};

export const notifySuccess = (options) =>
  openCorporateNotification({ ...options, type: "success" });

export const notifyError = (options) =>
  openCorporateNotification({ ...options, type: "error" });

export const notifyWarning = (options) =>
  openCorporateNotification({ ...options, type: "warning" });

export const notifyInfo = (options) =>
  openCorporateNotification({ ...options, type: "info" });

export const closeNotifications = () => notification.destroy();
