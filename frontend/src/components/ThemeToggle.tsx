import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";

export const ThemeToggle: React.FC = () => {

	const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
	
	const changeTheme = () => {
		const newDark = !isDark;
		document.documentElement.classList.toggle("dark", newDark);
		localStorage.setItem("theme", newDark ? "dark" : "light");
		setIsDark(newDark);
	}

  return (
<<<<<<< HEAD
    <button onClick={ changeTheme } className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 cursor-pointer">
			<span className="content-center" >{isDark ? <FiSun /> : <FiMoon />}</span>
			<span>{isDark ? "Switch to light theme" : "Switch to dark theme"}</span>
=======
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="min-w-48 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
>>>>>>> 5b98853 (Basic of navbar and other small layout changes)
    </button>
  );
};
