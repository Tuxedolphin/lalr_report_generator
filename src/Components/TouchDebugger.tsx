import React, { useState, useEffect } from "react";

const TouchDebugger: React.FC = () => {
  const [touchInfo, setTouchInfo] = useState<string>("No touch detected");
  const [scrollInfo, setScrollInfo] = useState<string>("No scroll detected");

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchInfo(
        `Touch at: ${touch.clientX}x${touch.clientY}, prevented: ${e.defaultPrevented}`
      );
    };

    const handleScroll = () => {
      setScrollInfo(`Scrolled to: ${window.scrollY}px`);
    };

    document.addEventListener("touchstart", handleTouch);
    document.addEventListener("touchmove", handleTouch);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("touchstart", handleTouch);
      document.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "8px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div>{touchInfo}</div>
      <div>{scrollInfo}</div>
    </div>
  );
};

export default TouchDebugger;
