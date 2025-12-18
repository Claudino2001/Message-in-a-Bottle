import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasSentToday, setHasSentToday] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Limites de Caracteres
  const MAX_TITLE = 100;
  const MAX_CONTENT = 3000;

  const [touched, setTouched] = useState({ title: false, content: false });
  const [errors, setErrors] = useState({ title: "", content: "" });

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/bottles/check-daily")
      .then(res => {
        setHasSentToday(res.data.has_sent_today);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao verificar status", err);
        setLoading(false);
      });
  }, []);

  const validateField = (field, value) => {
    let errorMsg = "";
    if (!value.trim()) {
        errorMsg = "Este campo é obrigatório.";
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    return errorMsg === "";
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSend = async () => {
    setTouched({ title: true, content: true });
    
    const isTitleValid = validateField("title", title);
    const isContentValid = validateField("content", content);

    if (!isTitleValid || !isContentValid) return;

    try {
      await api.post("/bottles/", { title, content });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-orange-100"></div>;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-orange-200 to-yellow-100 flex items-center justify-center font-sans">
      <div className="absolute top-10 w-40 h-40 bg-orange-400 rounded-full blur-2xl opacity-40"></div>
      
      <div className="bg-[#fffdf0] p-8 md:p-12 rounded-sm shadow-xl z-10 w-full max-w-2xl relative border border-orange-100 min-h-[400px] flex flex-col justify-center">
        
        {hasSentToday ? (
           <div className="text-center">
              <h2 className="text-3xl text-blue-600 font-hand font-bold mb-4">🌊 Garrafa lançada!</h2>
              <p className="text-xl text-gray-700 font-hand">Você já lançou a sua garrafa diária ao oceano.</p>
              <button onClick={() => navigate("/")} className="mt-8 text-blue-500 hover:underline">Voltar ao início</button>
           </div>
        ) : success ? ( 
          <div className="text-center animate-bounce-slow">
              <h2 className="text-4xl mb-4">🍾</h2>
              <h2 className="text-3xl text-orange-800 font-hand font-bold mb-4">Mensagem Enviada!</h2>
              <p className="text-xl text-gray-700 font-hand">Sua garrafa está flutuando no oceano digital.</p>
              <button onClick={() => navigate("/")} className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-full">Voltar</button>
          </div>
        ) : (
          <>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-200 opacity-60 rotate-2"></div>
            <h2 className="text-3xl text-orange-800 font-hand font-bold mb-6 text-center">Escreva sua Mensagem</h2>

            <div className="space-y-6"> 
              {/* Campo Título */}
              <div className="pt-2"> 
                  <div className="flex justify-between items-end mb-1 px-1">
                    <label className="text-orange-900 font-hand font-bold">Título</label>
                    <span className={`text-xs ${title.length === MAX_TITLE ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      {title.length}/{MAX_TITLE}
                    </span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Título da sua história..." 
                    maxLength={MAX_TITLE}
                    className={`w-full p-4 text-xl border-b-2 bg-transparent focus:outline-none text-gray-700 placeholder-orange-300 font-hand transition-colors
                        ${touched.title && errors.title ? "border-red-400 placeholder-red-300" : "border-orange-200 focus:border-orange-500"}
                    `}
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value);
                        if (touched.title) validateField("title", e.target.value);
                    }}
                    onBlur={() => handleBlur("title", title)}
                  />
                  {touched.title && errors.title && (
                      <p className="text-red-500 text-sm mt-1 font-bold animate-pulse">⚠️ {errors.title}</p>
                  )}
              </div>
              
              {/* Campo Conteúdo */}
              <div>
                  <div className="flex justify-between items-end mb-1 px-1">
                    <label className="text-orange-900 font-hand font-bold">Sua História</label>
                    <span className={`text-xs ${content.length === MAX_CONTENT ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      {content.length}/{MAX_CONTENT}
                    </span>
                  </div>
                  <textarea 
                    placeholder="O que você quer contar para o mundo hoje?" 
                    maxLength={MAX_CONTENT}
                    className={`w-full h-64 p-4 text-lg border-2 border-dashed rounded-lg bg-orange-50 focus:outline-none focus:bg-white transition resize-none text-gray-700 leading-relaxed font-hand
                        ${touched.content && errors.content ? "border-red-400" : "border-orange-200"}
                    `}
                    value={content}
                    onChange={e => {
                        setContent(e.target.value);
                        if (touched.content) validateField("content", e.target.value);
                    }}
                    onBlur={() => handleBlur("content", content)}
                  />
                  {touched.content && errors.content && (
                      <p className="text-red-500 text-sm mt-1 font-bold animate-pulse">⚠️ {errors.content}</p>
                  )}
              </div>

              <button 
                onClick={handleSend}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-full text-xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>🌊</span> LANÇAR AO MAR
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Write;