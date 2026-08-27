import { useTheme } from "@/store/ThemeContext";

// Thin adapter over the shared ThemeContext. Every call site used to hold its
// own independent useState (Header, dashboard charts, etc.) - each with its own
// mount-time localStorage read and its own effect toggling the "dark" class, with
// no coordination between them. A click in one component never updated the
// others until they happened to unmount/remount, and whichever instance's effect
// ran last could silently overwrite localStorage with a stale value - the exact
// "sometimes it works, sometimes it doesn't" bug. Routing everything through the
// single ThemeProvider instance fixes that: one state, read/written in one place,
// so every consumer re-renders in lockstep on every toggle.
const useDarkMode = () => {
  const { theme, setTheme } = useTheme();

  const darkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  return { darkMode, toggleDarkMode };
};

export default useDarkMode;
