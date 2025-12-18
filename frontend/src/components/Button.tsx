
import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";

const buttonStyles = cva("font-tomorrow font-medium", {
  variants: {
    variant: {
      primary: "hover:bg-vintage-yellow/60 dark:bg-stone-600 bg-amber-50 dark:hover:bg-neutral-800",
      secondary: "hover:bg-vintage-yellow/60 text-stone-700 dark:text-stone-200 border border-stone-600 dark:border-amber-50 dark:hover:bg-neutral-800 "
    },
    size: {
      sm: "text-sm py-1 px-2 rounded-lg shadow-md shadow-black-80",
      md: "text-base py-2 px-4 rounded-lg shadow-lg shadow-black-80",
	    lg: "text-2xl py-2 px-4 rounded-lg shadow-lg shadow-black-80"
    },

    disabled: {
      false: "cursor-pointer",
      true: "opacity-30 cursor-not-allowed"
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
  },
});

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  to?: string; // Optional route path
  onClick?: () => void; // Optional click handler
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export const Button = ({ to, onClick, children, variant = "primary", size = "md", disabled} : ButtonProps) => {

  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
	    navigate(to);
  	} else if (onClick) {
  	  onClick();
  	}
  };

  return (
	<button disabled={disabled} onClick={handleClick} className={buttonStyles({ variant, size, disabled })}>
    <div className="flex gap-2 items-center">
			{children}
    </div>
	</button>
  );
};