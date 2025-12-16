import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.access_token);
      navigate("/write"); 
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Email ou senha incorretos. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center overflow-hidden font-sans">

      <img 
        src="https://cdn-icons-png.flaticon.com/512/433/433539.png" 
        className="absolute bottom-0 left-[-50px] w-64 md:w-80 opacity-90" 
        alt="coqueiro" 
      />
      <img 
        src="https://cdn-icons-png.flaticon.com/512/433/433539.png" 
        className="absolute bottom-0 right-[-50px] w-64 md:w-80 opacity-90 scale-x-[-1]" 
        alt="coqueiro" 
      />

      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-96 text-center transform hover:scale-105 transition duration-500">
        <h2 className="text-4xl font-hand text-blue-600 mb-8 font-bold">Login</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Seu email" 
            className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          
          {/* Campo de Senha com Botão de Visualizar */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} // Alterna o tipo
              placeholder="Sua senha" 
              className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10" // pr-10 para o texto não ficar sob o ícone
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button" // Importante ser type="button" para não submeter o form
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-500 transition"
            >
              {showPassword ? (
                // Ícone Olho Aberto (SVG)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                // Ícone Olho Fechado (SVG)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
          
          {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
          
          <button type="submit" className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md mt-4">
            ENTRAR NA ILHA
          </button>
        </form>
        
        {/* LINK PARA RECUPERAR SENHA */}
        <div className="mt-4 text-right">
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-600 hover:underline">
                Esqueci minha senha
            </Link>
        </div>
        
        <div className="mt-6 text-sm">
          <p className="text-gray-400">Ainda não tem cadastro?</p>
          <Link to="/register" className="text-blue-500 font-bold hover:underline">
            Crie sua conta agora
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;