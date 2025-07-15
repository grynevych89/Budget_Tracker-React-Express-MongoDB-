import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Загрузка...</div>;  // можно заменить на спиннер
  }

  return user ? children : <Navigate to="/login" replace />;
}
