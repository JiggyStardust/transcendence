import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";

const buttonStyles = cva("font-[Poppins] font-medium", {
  variants: {
    variant: {
      primary: "bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-gray-200 border-black dark:border-black",
      secondary: "bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-gray-200 border-black dark:border-black"
    },
    size: {
      sm: "text-sm py-1 px-2 rounded-sm border-[0.5px] shadow-md shadow-black-60",
      md: "text-base py-2 px-4 rounded-md border-[0.5px] shadow-lg shadow-black-60",
	    lg: "text-2xl py-2 px-4 rounded-lg border-[1px] shadow-lg shadow-black-60"
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