import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Novo estado de sucesso
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/auth/register", { 
        username, 
        email, 
        password 
      });
      
      // SUCESSO! Ativa a tela de confirmação (sem alert)
      setSuccess(true);
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Decoração (Céu e Pássaros) */}
      <div className="absolute top-10 right-20 text-white text-4xl opacity-50">~~</div>
      <div className="absolute top-20 right-40 text-white text-2xl opacity-40">~~</div>

      {/* Coqueiros Laterais */}
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-50px] w-64 md:w-80 opacity-90" alt="coqueiro" />
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 right-[-50px] w-64 md:w-80 opacity-90 scale-x-[-1]" alt="coqueiro" />

      {/* Card Principal */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-96 text-center transform hover:scale-105 transition duration-500 min-h-[500px] flex flex-col justify-center">
        
        {/* CONDICIONAL: Mostra Sucesso OU Formulário */}
        {success ? (
          <div className="animate-pulse">
            <h2 className="text-6xl mb-4">🥥</h2>
            <h2 className="text-3xl font-hand text-blue-600 mb-4 font-bold">
              Bem-vindo!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Sua conta foi criada com sucesso. Agora você faz parte da ilha.
            </p>
            
            <button 
              onClick={() => navigate("/login")}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition shadow-lg w-full"
            >
              IR PARA LOGIN
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-hand text-blue-600 mb-6 font-bold">Crie sua Conta</h2>
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Nome de Usuário" 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <input 
                type="email" 
                placeholder="Seu melhor email" 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <input 
                type="password" 
                placeholder="Crie uma senha" 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              
              {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
              
              <button type="submit" className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md mt-2">
                REGISTRAR
              </button>
            </form>
            
            <div className="mt-6 text-sm">
              <p className="text-gray-400">Já tem uma conta?</p>
              <Link to="/login" className="text-blue-500 font-bold hover:underline">
                Faça Login aqui
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;