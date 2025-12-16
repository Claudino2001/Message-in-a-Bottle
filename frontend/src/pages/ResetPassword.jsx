import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
        setStatus({ type: "error", message: "Token inválido ou ausente." });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validações no Front antes de enviar
    if (newPassword !== confirmPassword) {
        setStatus({ type: "error", message: "As senhas não coincidem." });
        return;
    }

    // Regex simples para garantir que não envie algo que o backend vai rejeitar
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,16})");
    if (!strongRegex.test(newPassword)) {
        setStatus({ type: "error", message: "A senha não atende aos requisitos de segurança." });
        return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { 
        token: token, 
        new_password: newPassword 
      });
      
      setStatus({ type: "success", message: "Senha alterada com sucesso! Redirecionando..." });
      
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
         // Pega erro de validação do Pydantic se houver
         const detail = err.response.data.detail;
         setStatus({ type: "error", message: Array.isArray(detail) ? detail[0].msg : detail });
      } else {
         setStatus({ type: "error", message: "Erro ao resetar. O link pode ter expirado." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="min-h-screen bg-blue-100 flex items-center justify-center">Link inválido.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-hand text-blue-600 mb-6 font-bold">Nova Senha</h2>

        {status.message && (
          <div className={`mb-4 p-3 rounded text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        {status.type !== "success" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* CAMPO NOVA SENHA COM BALÃO E OLHO */}
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nova senha" 
                    className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    onBlur={() => setShowPasswordRules(false)}
                    maxLength={16}
                    required
                />
                
                {/* Botão Olho */}
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

                {/* Balão de Regras */}
                {showPasswordRules && (
                    <div className="absolute bottom-14 left-0 w-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs text-left p-3 rounded-lg shadow-lg z-20">
                        <p className="font-bold mb-1">Sua senha precisa ter:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li className={newPassword.length >= 8 && newPassword.length <= 16 ? "text-green-600" : ""}>8 a 16 caracteres</li>
                            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>1 Letra Maiúscula</li>
                            <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>1 Letra Minúscula</li>
                            <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>1 Número</li>
                        </ul>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-100 border-b border-r border-yellow-300 rotate-45"></div>
                    </div>
                )}
            </div>

            <input 
                type={showPassword ? "text" : "password"}
                placeholder="Confirme a nova senha" 
                className={`p-3 border-2 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 
                    ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border-blue-100'}`}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            
            {confirmPassword && newPassword !== confirmPassword && (
                <span className="text-xs text-red-500 text-left -mt-2">As senhas não coincidem.</span>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition shadow-md disabled:opacity-50"
            >
                {loading ? "Salvando..." : "DEFINIR NOVA SENHA"}
            </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;