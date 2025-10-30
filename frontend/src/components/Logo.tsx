// import React from "react"; this shouldn't be needed because of tsconfig

interface LogoProps {
  size? : number;
}

export const Logo = ({ size = 9 }: LogoProps) => {
  return (
    <span 
    className={`text-[${size}rem] font-extrabold text-white font-[Honk]`}
    >
      Ping of Pongs
    </span>
  );
};
