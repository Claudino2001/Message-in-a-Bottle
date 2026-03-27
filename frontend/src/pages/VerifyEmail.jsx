import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTranslation } from "react-i18next";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

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
      
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-40px] w-48 opacity-80" alt="coqueiro" />

      <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-full max-w-md text-center transform transition-all">
        
        {status === "loading" && (
          <div className="animate-pulse">
            <h2 className="text-4xl mb-4">⏳</h2>
            <h2 className="text-2xl font-hand text-blue-600 font-bold">{t('verify.loading_title')}</h2>
            <p className="text-gray-500 mt-2">{t('verify.loading_desc')}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-6xl mb-4">🥥</h2>
            <h2 className="text-3xl font-hand text-green-600 font-bold mb-4">{t('verify.success_title')}</h2>
            <p className="text-gray-700 text-lg mb-8">
              {t('verify.success_desc')}
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition w-full"
            >
              {t('verify.btn_login')}
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-6xl mb-4">🚫</h2>
            <h2 className="text-3xl font-hand text-red-500 font-bold mb-4">{t('verify.error_title')}</h2>
            <p className="text-gray-700 mb-8">
              {t('verify.error_desc')}
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline font-bold"
            >
              {t('verify.btn_back')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;