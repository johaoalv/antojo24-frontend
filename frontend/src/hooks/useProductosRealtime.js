import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useProductosRealtime = (onProductUpdated) => {
  const callbackRef = useRef(onProductUpdated);

  useEffect(() => {
    callbackRef.current = onProductUpdated;
  }, [onProductUpdated]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_WEBSOCKET_URL;
    if (!socketUrl) return undefined;

    const socket = io(socketUrl, { transports: ["websocket"] });
    const handleProductUpdated = (product) => callbackRef.current(product);
    socket.on("product_updated", handleProductUpdated);

    return () => {
      socket.off("product_updated", handleProductUpdated);
      socket.disconnect();
    };
  }, []);
};

export default useProductosRealtime;
