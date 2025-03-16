import { useState, useEffect } from "react";

export const useCountUp = (targetValue, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = targetValue / (duration / 50); // Calcula el paso
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(interval);
      } else {
        setCount(Math.ceil(start)); // Redondea hacia arriba
      }
    }, 50);

    return () => clearInterval(interval);
  }, [targetValue, duration]);

  return count;
};
