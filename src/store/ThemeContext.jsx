import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const body = document.querySelector("body");

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || getSystemTheme();
  });

  const applyTheme = (selectedTheme) => {
    const finalTheme =
      selectedTheme === "system" ? getSystemTheme() : selectedTheme;

    body.classList.remove("light", "dark");
    body.classList.add(finalTheme);
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light",
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        setTheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook
export function useTheme() {
  return useContext(ThemeContext);
}
