import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => { 
  const [darkMode, setDarkMode] = useState(localStorage.theme === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode((prev) => !prev)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};
