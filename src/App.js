import { Suspense } from "react";
import "./template/css/main.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./template/ProtectedRoute";
import GuardRoute from "./template/GuardRoute";
import { routes } from "./app/http/routes";
import GuestRoute from "./template/GuestRoute";
import Home from "./pages/Home";

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        {routes.guest.map((page, i) => (
          <Route
            exact
            key={i}
            path={page.url}
            element={<GuardRoute>{page.element}</GuardRoute>}
          />
        ))}
        {routes.protected.map((page, i) => (
          <Route
            exact
            key={i}
            path={page.url}
            element={<ProtectedRoute>{page.element}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default App;
