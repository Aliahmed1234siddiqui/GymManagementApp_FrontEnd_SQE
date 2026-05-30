import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import ScrollToTopOnPageChange from "../components/ui/scroll-top";



function RouterProvider() {
  return (
    <BrowserRouter>
      <ScrollToTopOnPageChange />
      <Routes>
        {routes.map((r, key) => (
          <Route path={r.path} element={r.element} key={key} />
        ))}
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path={"*"} element={<Navigate to={"/error"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterProvider;
