import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesAccess } from "./routes/RoutesAccess";
import { routesDeveloper } from "./routes/RoutesDeveloper";
import { StoreProvider } from "./store/StoreContext";
import { ThemeProvider } from "./store/ThemeContext.jsx";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "*",
      element: <h3 className="text-red-500">404xxxx</h3>,
    },
    ...routesAccess,
    ...routesDeveloper,
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </StoreProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
