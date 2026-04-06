import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageNotFound from "./layout/PageNotFound";
import { routesAccess } from "./routes/RoutesAccess";
import { routesDeveloper } from "./routes/RoutesDeveloper";
import { StoreProvider } from "./store/StoreContext";
import { ThemeProvider } from "./store/ThemeContext.jsx";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "*",
      element: <PageNotFound />,
    },
    ...routesAccess,
    ...routesDeveloper,
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StoreProvider>
            <RouterProvider router={router} />
          </StoreProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
