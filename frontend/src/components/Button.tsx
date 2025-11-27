import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";

const buttonStyles = cva("font-[Poppins] font-medium", {
  variants: {
    variant: {
      primary: "hover:bg-vintage-yellow dark:bg-neutral-600 bg-stone-200 dark:hover:bg-neutral-800 border-black dark:border-black",
      secondary: "hover:bg-vintage-yellow dark:bg-neutral-600 bg-stone-200 dark:hover:bg-neutral-800 border-black dark:border-black"
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
	<button onClick={handleClick} className={buttonStyles({ variant, size, disabled })}>
    <div className="flex gap-2 items-center">
			{children}
    </div>
	</button>
  );
};