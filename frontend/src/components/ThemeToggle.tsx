import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export const ThemeToggle: React.FC = () => {

	const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
	
	const changeTheme = () => {
		const newDark = !isDark;
		document.documentElement.classList.toggle("dark", newDark);
		localStorage.setItem("theme", newDark ? "dark" : "light");
		setIsDark(newDark);
	}

  return (
    <button onClick={ changeTheme } className="flex gap-2 px-4 py-2 rounded-md bg-stone-300 dark:bg-stone-600 cursor-pointer">
			<span className="content-center" >{isDark ? <FiSun /> : <FiMoon />}</span>
			<span>{isDark ? "Switch to light theme" : "Switch to dark theme"}</span>
    </button>
  );
};
