import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
        setStatus({ type: "error", message: t('reset_password.error_invalid_token') });
    }
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validações no Front antes de enviar
    if (newPassword !== confirmPassword) {
        setStatus({ type: "error", message: t('reset_password.error_mismatch') });
        return;
    }

    // Regex simples
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,16})");
    if (!strongRegex.test(newPassword)) {
        setStatus({ type: "error", message: t('reset_password.error_weak') });
        return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { 
        token: token, 
        new_password: newPassword 
      });
      
      setStatus({ type: "success", message: t('reset_password.success_msg') });
      
      setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
         const detail = err.response.data.detail;
         setStatus({ type: "error", message: Array.isArray(detail) ? detail[0].msg : detail });
      } else {
         setStatus({ type: "error", message: t('reset_password.error_expired') });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="min-h-screen bg-blue-100 flex items-center justify-center">{t('reset_password.link_invalid_screen')}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-hand text-blue-600 mb-6 font-bold">{t('reset_password.title')}</h2>

        {status.message && (
          <div className={`mb-4 p-3 rounded text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        {status.type !== "success" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t('reset_password.placeholder_new')} 
                    className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    onFocus={() => setShowPasswordRules(true)}
                    onBlur={() => setShowPasswordRules(false)}
                    maxLength={16}
                    required
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-500 transition z-10"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

                {showPasswordRules && (
                    <div className="absolute bottom-14 left-0 w-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs text-left p-3 rounded-lg shadow-lg z-20">
                        <p className="font-bold mb-1">{t('common.password_rules_title')}</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li className={newPassword.length >= 8 && newPassword.length <= 16 ? "text-green-600" : ""}>{t('common.password_rule_length')}</li>
                            <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>{t('common.password_rule_uppercase')}</li>
                            <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>{t('common.password_rule_lowercase')}</li>
                            <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>{t('common.password_rule_number')}</li>
                        </ul>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-100 border-b border-r border-yellow-300 rotate-45"></div>
                    </div>
                )}
            </div>

            <input 
                type={showPassword ? "text" : "password"}
                placeholder={t('reset_password.placeholder_confirm')} 
                className={`p-3 border-2 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 
                    ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border-blue-100'}`}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            
            {confirmPassword && newPassword !== confirmPassword && (
                <span className="text-xs text-red-500 text-left -mt-2">{t('reset_password.error_mismatch')}</span>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition shadow-md disabled:opacity-50"
            >
                {loading ? t('reset_password.btn_saving') : t('reset_password.btn_default')}
            </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;