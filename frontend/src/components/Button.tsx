import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  to?: string; // Optional route path
  onClick?: () => void; // Optional click handler
  variant?: "primary" | "secondary"; // optional style variants
}

export const Button: React.FC<ButtonProps> = ({
  children,
  to,
  onClick,
  variant = "primary",
}) => {
  const navigate = useNavigate();

  const baseStyles =
    "px-26 py-2 rounded-[10px] font-[Chango] transition-colors duration-200 border-4 border-transparent"; // px = padding horizontal, py = padding vertical
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-blue-700 hover:bg-gray-200",
  };

  const handleClick = () => {
    if (to) navigate(to);
    else if (onClick) onClick();
  };

  // Our styling comes from index.css

    const style: React.CSSProperties = {
    backgroundColor: "var(--btn-bg)",
    color: "var(--btn-text)",
    borderImage: "linear-gradient(to right, var(--btn-border-start), var(--btn-border-end)) 1",
  };

  return (
    <button
      style={style}
      className={baseStyles + " hover:bg-[var(--btn-hover)]"}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
