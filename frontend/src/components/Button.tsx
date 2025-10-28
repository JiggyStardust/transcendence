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
    "px-6 py-3 rounded-xl font-semibold transition-colors duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-blue-700 hover:bg-gray-200",
  };

  const handleClick = () => {
    if (to) navigate(to);
    else if (onClick) onClick();
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={handleClick}>
      {children}
    </button>
  );
};
