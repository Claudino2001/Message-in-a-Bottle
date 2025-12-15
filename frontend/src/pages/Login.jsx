import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para armazenar mensagens de erro
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores ao tentar novamente

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Salva o token no navegador
      localStorage.setItem("token", response.data.access_token);
      
      // Redireciona direto para a tela de escrever (sem alert)
      navigate("/write"); 
    } catch (err) {
      console.error(err);
      // Define a mensagem de erro para aparecer na tela
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Decoração: Pássaros e Nuvens */}
      <div className="absolute top-10 right-20 text-white text-4xl opacity-50">~~</div>
      <div className="absolute top-20 right-40 text-white text-2xl opacity-40">~~</div>

      {/* Coqueiros Laterais (Imagens decorativas) */}
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

      {/* Card de Login (Quadrado Branco) */}
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
          <input 
            type="password" 
            placeholder="Sua senha" 
            className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          {/* Exibe mensagem de erro se houver */}
          {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
          
          <button type="submit" className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md mt-4">
            ENTRAR NA ILHA
          </button>
        </form>
        
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