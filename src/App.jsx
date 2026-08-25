import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageNotFound from "./layout/PageNotFound";
import { routesAccess } from "./routes/RoutesAccess";
import { routesDeveloper } from "./routes/RoutesDeveloper";
import { StoreProvider } from "./store/StoreContext";
import { ThemeProvider } from "./store/ThemeContext.jsx";
import { ExportProvider } from "./store/ExportContext.jsx";
import ExportProgressWidget from "./components/widgets/ExportProgressWidget.jsx";
import { routesAdmin } from "./routes/RoutesAdmin";
import { routesCashier } from "./routes/ProductCashier";
import { routesProductOwner } from "./routes/RoutesProductOwner";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter(
    [
      {
        path: "*",
        element: <PageNotFound />,
      },
      ...routesAccess,
      ...routesDeveloper,
      ...routesAdmin,
      ...routesCashier,
      ...routesProductOwner,
    ],
    {
      basename: "/",
    },
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StoreProvider>
            <ExportProvider>
              <RouterProvider router={router} />
              <ExportProgressWidget />
            </ExportProvider>
          </StoreProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
