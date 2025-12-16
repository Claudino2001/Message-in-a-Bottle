import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // Chama o backend para validar o token assim que a tela abre
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center font-sans p-4 relative overflow-hidden">
      
      {/* Decoração */}
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-40px] w-48 opacity-80" alt="coqueiro" />

      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-full max-w-md text-center transform transition-all">
        
        {status === "loading" && (
          <div className="animate-pulse">
            <h2 className="text-4xl mb-4">⏳</h2>
            <h2 className="text-2xl font-hand text-blue-600 font-bold">Verificando...</h2>
            <p className="text-gray-500 mt-2">Validando sua passagem para a ilha.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-6xl mb-4">🥥</h2>
            <h2 className="text-3xl font-hand text-green-600 font-bold mb-4">Conta Ativada!</h2>
            <p className="text-gray-700 text-lg mb-8">
              Seu e-mail foi confirmado com sucesso. Agora você pode entrar e lançar suas mensagens.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition w-full"
            >
              IR PARA O LOGIN
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-6xl mb-4">🚫</h2>
            <h2 className="text-3xl font-hand text-red-500 font-bold mb-4">Ops!</h2>
            <p className="text-gray-700 mb-8">
              O link de verificação é inválido ou já expirou.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline font-bold"
            >
              Voltar para o início
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;