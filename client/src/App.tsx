import { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import PrivateRoute from "./router/PrivateRoute";

import ThemeToggle from "./components/ThemeToggle";
import { useLanguage } from "./context/useLanguage";

export default function App() {
  const { user, token, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useLanguage();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {language === "en" ? "Budget Tracker" : "Бюджетний Трекер"}
          </Typography>

          <Button color="inherit" onClick={toggleLanguage}>
            {language === "en" ? "UK" : "EN"}
          </Button>

          <ThemeToggle />

          {token ? (
            <Button color="inherit" onClick={logout}>
              {language === "en" ? "Logout" : "Вийти"} ({user})
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              {language === "en" ? "Login" : "Увійти"}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </Container>
    </>
  );
}
