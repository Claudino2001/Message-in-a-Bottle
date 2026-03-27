import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3 || username.length > 50) {
      setError(t('register.error_username_length'));
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError(t('register.error_password_length'));
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
        setError(t('register.error_generic'));
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
            <h2 className="text-6xl mb-4">📧</h2>
            <h2 className="text-3xl font-hand text-blue-600 mb-4 font-bold">
              {t('register.success_title')}
            </h2>
            <div className="text-gray-600 text-lg mb-8 space-y-2">
              <p>{t('register.success_msg_1')}</p>
              <p className="font-bold text-orange-600 bg-orange-100 p-2 rounded">
                {t('register.success_msg_2')}
              </p>
              <p className="text-sm">{t('register.success_msg_3')}</p>
            </div>
            
            <button 
              onClick={() => navigate("/login")}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition shadow-lg w-full"
            >
              {t('register.btn_go_login')}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-hand text-blue-600 mb-6 font-bold">{t('register.form_title')}</h2>
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4 relative">
              <input 
                type="text" 
                placeholder={t('register.placeholder_username')} 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={username}
                onChange={e => setUsername(e.target.value)}
                minLength={3}
                maxLength={50}
              />

              <input 
                type="email" 
                placeholder={t('register.placeholder_email')} 
                className="p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('register.placeholder_password')}
                  className="w-full p-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 bg-blue-50 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                  maxLength={16}
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
                            <li className={password.length >= 8 && password.length <= 16 ? "text-green-600" : ""}>{t('common.password_rule_length')}</li>
                            <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>{t('common.password_rule_uppercase')}</li>
                            <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>{t('common.password_rule_lowercase')}</li>
                            <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>{t('common.password_rule_number')}</li>
                        </ul>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-100 border-b border-r border-yellow-300 rotate-45"></div>
                    </div>
                )}
              </div>
              
              {error && <span className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded border border-red-100">{error}</span>}
              
              <button type="submit" className="bg-orange-400 text-white font-bold py-3 rounded-lg hover:bg-orange-500 transition shadow-md mt-2">
                {t('register.btn_register')}
              </button>
            </form>
            
            <div className="mt-6 text-sm">
              <p className="text-gray-400">{t('register.login_prompt')}</p>
              <Link to="/login" className="text-blue-500 font-bold hover:underline">
                {t('register.login_link')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;