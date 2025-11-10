import React from "react";
import "../../common/styles/loader.css";

const Loader = ({ size = 48, className = "" }) => {
  return (
    <span
      className={["corporate-loader", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    />
  );
};

export default Loader;
