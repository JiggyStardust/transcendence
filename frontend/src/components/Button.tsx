import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";

const buttonStyles = cva("font-[Poppins]", {
  variants: {
    variant: {
      primary: "bg-white-600 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-gray-200 border-black-900 dark:border-black-400",
      secondary: "bg-white-700 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-gray-200 border-black-800 dark:border-black-500"
    },
    size: {
      sm: "text-sm py-1 px-2 rounded-sm border-[0.5px] shadow-md shadow-black-400/60 dark:shadow-pink-600/60",
      md: "text-base py-2 px-4 rounded-md border-[0.5px] shadow-lg shadow-black-400/60 dark:shadow-pink-500/60",
	    lg: "text-2xl py-2 px-4 rounded-lg border-[1px] shadow-lg shadow-black-400/60 dark:shadow-pink-500/60"
    },

    disabled: {
      false: "cursor-pointer",
      true: "opacity-70 cursor-not-allowed"
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
		{/* <p className="bg-linear-to-b from-pink-700 to-yellow-300 dark:from-pink-500 dark:to-yellow-500 bg-clip-text text-transparent">
			{children}
		</p> */}
			{children}
	</button>
  );
};