import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
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

    // Toggle on <html>, not <body>: every `dark:` utility already keys off it
    // (@custom-variant dark (&:where(.dark, .dark *)) in index.css), and <html>
    // is never torn down/replaced the way page content is on route changes.
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(finalTheme);
  };

  // This is the ONLY place that writes "theme" to localStorage now - see
  // useDarkMode.jsx, which used to keep its own separate copy of this state.
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
