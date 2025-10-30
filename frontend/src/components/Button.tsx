import { useNavigate } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  to?: string; // Optional route path
  onClick?: () => void; // Optional click handler
  variant?: "primary" | "secondary"; // optional style variants
}

export const Button = ({
  children,
  to,
  onClick,
  variant = "primary",
}: ButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else if (onClick) onClick();
  };

  return (
<button
  onClick={handleClick}
  className="relative px-[26px] py-[8px] rounded-[10px] font-[Chango] text-[18px] text-[var(text)] bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] hover:transition-all hover:duration-[var(--transition)] ease-in-out"
>
  <span
    className="absolute inset-0 rounded-[10px] p-[2px] bg-gradient-to-r from-[var(--btn-border-start)] to-[var(--btn-border-end)] -z-10"
  ></span>
  <span className="relative z-10">{children}</span>
</button>
  );
};