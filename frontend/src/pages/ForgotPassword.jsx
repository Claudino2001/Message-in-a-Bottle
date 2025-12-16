import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // O backend espera { email: "..." }
      await api.post("/auth/forgot-password", { email });
      setStatus({ 
        type: "success", 
        message: "Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes." 
      });
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: "error", 
        message: "Ocorreu um erro ao tentar enviar o e-mail. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-hand text-blue-600 mb-4 font-bold">Recuperar Senha 🔐</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Digite seu e-mail abaixo e enviaremos um link mágico para você redefinir sua senha.
        </p>

        {status.message && (
          <div className={`mb-4 p-3 rounded text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Seu e-mail cadastrado" 
            className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Enviando..." : "ENVIAR LINK"}
          </button>
        </form>

        <div className="mt-6">
          <Link to="/login" className="text-blue-500 hover:underline text-sm font-bold">
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;