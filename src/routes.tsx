import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ApplyForm from "./pages/ApplyForm";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/apply", element: <ApplyForm /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
