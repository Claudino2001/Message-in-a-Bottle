import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Novo estado
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3 || username.length > 50) {
      setError("O nome deve ter entre 3 e 50 caracteres.");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("A senha deve ter entre 8 e 16 caracteres.");
      return;
    }

    try {
      await api.post("/auth/register", { 
        username, 
        email, 
        password 
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
             setError(detail[0].msg.replace('Value error, ', ''));
        } else {
             setError(detail);
        }
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center overflow-hidden font-sans">

      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-50px] w-64 md:w-80 opacity-90" alt="coqueiro" />
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 right-[-50px] w-64 md:w-80 opacity-90 scale-x-[-1]" alt="coqueiro" />

      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-96 text-center transform hover:scale-105 transition duration-500 min-h-[500px] flex flex-col justify-center relative">
        
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
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4 relative">
              <input 
                type="text" 
                placeholder="Nome de Usuário (3-50 chars)" 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={username}
                onChange={e => setUsername(e.target.value)}
                minLength={3}
                maxLength={50}
              />

              <input 
                type="email" 
                placeholder="Seu melhor email" 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} // Alterna o tipo
                  placeholder="Crie uma senha forte" 
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                  maxLength={16}
                />

                {/* BOTÃO DO OLHO */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-500 transition z-10"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
                
                {/* O BALÃO / POP-UP INTEGRADO */}
                {showPasswordRules && (
                    <div className="absolute bottom-14 left-0 w-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs text-left p-3 rounded-lg shadow-lg z-20">
                        <p className="font-bold mb-1">Requisitos da senha:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li className={password.length >= 8 && password.length <= 16 ? "text-green-600" : ""}>8 a 16 caracteres</li>
                            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>1 Letra Maiúscula</li>
                            <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>1 Letra Minúscula</li>
                            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>1 Número</li>
                        </ul>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-100 border-b border-r border-yellow-300 rotate-45"></div>
                    </div>
                )}
              </div>
              
              {error && <span className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded border border-red-100">{error}</span>}
              
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