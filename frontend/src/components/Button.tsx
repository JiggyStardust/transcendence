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
  className="relative px-[26px] py-[8px] font-[Chango] text-[18px]"
>
  <span className="relative z-10">{children}</span>
</button>
  );
};