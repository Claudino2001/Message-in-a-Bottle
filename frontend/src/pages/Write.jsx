import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasSentToday, setHasSentToday] = useState(false);
  const [success, setSuccess] = useState(false); // Estado para mensagem de sucesso
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Verifica se pode escrever ao carregar a página
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

  const handleSend = async () => {
    if (!title || !content) return;

    try {
      await api.post("/bottles/", { title, content });
      // Troca a tela para sucesso visual
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Se estiver carregando, mostra nada ou um spinner
  if (loading) return <div className="min-h-screen bg-orange-100"></div>;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-orange-200 to-yellow-100 flex items-center justify-center font-sans">
      
      {/* Background (Mantido) */}
      <div className="absolute top-10 w-40 h-40 bg-orange-400 rounded-full blur-2xl opacity-40"></div>
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 left-[-20px] w-64 opacity-80" alt="coqueiro" />
      <img src="https://cdn-icons-png.flaticon.com/512/433/433539.png" className="absolute bottom-0 right-[-20px] w-64 opacity-80 scale-x-[-1]" alt="coqueiro" />

      {/* Papel da Carta */}
      <div className="bg-[#fffdf0] p-8 md:p-12 rounded-sm shadow-xl z-10 w-full max-w-2xl relative border border-orange-100 min-h-[400px] flex flex-col justify-center">
        
        {/* LÓGICA DE EXIBIÇÃO: */}
        
        {/* CASO 1: Já enviou hoje (Bloqueado) */}
        {hasSentToday ? (
           <div className="text-center">
              <h2 className="text-3xl text-blue-600 font-hand font-bold mb-4">
                🌊 Garrafa lançada!
              </h2>
              <p className="text-xl text-gray-700 font-hand">
                Você já lançou a sua garrafa diária ao oceano.
              </p>
              <p className="mt-4 text-gray-500 text-sm">
                Volte amanhã para enviar outra mensagem.
              </p>
              <button onClick={() => navigate("/")} className="mt-8 text-blue-500 hover:underline">
                Voltar ao início
              </button>
           </div>

        ) : success ? ( 
          /* CASO 2: Acabou de enviar com sucesso */
          <div className="text-center animate-bounce-slow">
              <h2 className="text-4xl mb-4">🍾</h2>
              <h2 className="text-3xl text-orange-800 font-hand font-bold mb-4">
                Mensagem Enviada!
              </h2>
              <p className="text-xl text-gray-700 font-hand">
                Sua garrafa está flutuando no oceano digital.
              </p>
              <button onClick={() => navigate("/")} className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-full">
                Voltar
              </button>
          </div>

        ) : (
          /* CASO 3: Pode escrever (Formulário) */
          <>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-200 opacity-60 rotate-2"></div>

            <h2 className="text-3xl text-orange-800 font-hand font-bold mb-6 text-center">Escreva sua Mensagem</h2>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Título da sua história..." 
                className="w-full p-4 text-xl border-b-2 border-orange-200 bg-transparent focus:outline-none focus:border-orange-500 text-gray-700 placeholder-orange-300 font-hand"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              
              <textarea 
                placeholder="O que você quer contar para o mundo hoje?" 
                className="w-full h-64 p-4 text-lg border-2 border-dashed border-orange-200 rounded-lg bg-orange-50 focus:outline-none focus:bg-white transition resize-none text-gray-700 leading-relaxed font-hand"
                value={content}
                onChange={e => setContent(e.target.value)}
              />

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