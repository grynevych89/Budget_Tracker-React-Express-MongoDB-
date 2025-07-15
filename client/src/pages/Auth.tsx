import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";
import axios from "axios";

export default function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password || (isRegister && !confirmPassword)) {
      setError(t.pleaseFillAllFields);
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError(t.passwordsNotMatch);
      return;
    }

    try {
      const url = isRegister ? "/auth/register" : "/auth/login";
      const res = await axios.post(url, { username, password });

      // Сохраняем токен и username
      login(res.data.token, res.data.username);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === "string"
      ) {
        const typedErr = err as { response: { data: { error: string } } };
        setError(typedErr.response.data.error);
      } else {
        setError(isRegister ? "Registration failed" : t.incorrectCredentials);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        {isRegister ? t.register : t.login}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label={t.username}
          fullWidth
          margin="normal"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label={t.password}
          type="password"
          fullWidth
          margin="normal"
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegister && (
          <TextField
            label={t.confirmPassword}
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isRegister ? t.register : t.login}
        </Button>
      </form>

      <Button
        color="secondary"
        fullWidth
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
          setPassword("");
          setConfirmPassword("");
        }}
        sx={{ mt: 1 }}
      >
        {isRegister ? t.alreadyHaveAccount : t.dontHaveAccount}
      </Button>
    </Box>
  );
}
