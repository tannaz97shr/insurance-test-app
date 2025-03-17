import { Link, Outlet } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Layout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-all duration-300 dark:bg-gray-900 dark:text-white flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          Smart Insurance Portal
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/apply"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition"
          >
            Apply Now
          </Link>

          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center p-4 text-gray-700 dark:text-gray-400 mt-auto">
        © 2025 Smart Insurance Portal
      </footer>
    </div>
  );
};

export default Layout;
