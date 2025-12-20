import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Importação do hook

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // 2. Inicialização do hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t('login.error_missing_fields')); //
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.access_token);
      navigate("/write");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        // Erros vindos do backend geralmente já vêm com texto específico. 
        // Se quiser traduzir erros de backend, precisaria mapear os códigos de erro.
        // Mantive a lógica original para exibir a mensagem do servidor se existir.
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail[0].msg);
        } else if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError(t('login.error_unknown')); //
        }
      } else {
        setError(t('login.error_connection')); //
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center overflow-hidden font-sans">
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-50px] w-64 md:w-80 opacity-90" alt="coqueiro" />
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 right-[-50px] w-64 md:w-80 opacity-90 scale-x-[-1]" alt="coqueiro" />

      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-96 text-center transform hover:scale-105 transition duration-500">

        <h2 className="text-4xl text-blue-600 mb-8 font-bold">{t('login.title')}</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t('login.email_placeholder')} //
            className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 text-base"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('login.password_placeholder')} //
              className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10 text-base"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-500 transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <span className="text-red-500 text-sm font-bold">{error}</span>}

          <button type="submit" className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md mt-4 text-lg">
            {t('login.submit_button')}
          </button>
        </form>

        <div className="mt-4 text-right">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-600 hover:underline">
            {t('login.forgot_password')}
          </Link>
        </div>

        <div className="mt-6 text-sm">
          <p className="text-gray-400">{t('login.no_account')}</p>
          <Link to="/register" className="text-blue-500 font-bold hover:underline text-base">
            {t('login.register_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;