import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [bottleCount, setBottleCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/public/ocean-stats")
      .then((response) => {
        setBottleCount(response.data.bottles_in_ocean);
      })
      .catch((err) => console.error("Erro ao buscar stats", err));
  }, []);

  const handleWriteMessage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/write");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* SEÇÃO 1: O Contador */}
      <section className="min-h-[85vh] w-full relative bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 flex flex-col items-center justify-center text-white overflow-hidden">
        
        <div className="absolute top-10 w-24 h-24 md:w-32 md:h-32 bg-yellow-400 rounded-full shadow-[0_0_50px_rgba(255,215,0,0.6)] animate-pulse"></div>
        <div className="absolute top-20 left-10 w-24 h-8 bg-white opacity-60 rounded-full"></div>
        <div className="absolute top-32 right-20 w-32 h-10 bg-white opacity-60 rounded-full"></div>

        <div className="z-30 text-center mt-10 animate-float">
          <h1 className="text-7xl md:text-8xl font-bold drop-shadow-lg p-4">
            {bottleCount !== null ? bottleCount : "..."}
          </h1>
          <p className="text-lg md:text-xl mt-4 font-light tracking-widest uppercase">
            Garrafas no Oceano
          </p>
        </div>

        <img src="/coconut-tree.png" alt="Coqueiro" className="absolute bottom-[-60px] left-[-60px] w-96 md:w-[600px] opacity-100 z-20 pointer-events-none transform -rotate-6" />
        <img src="/coconut-tree.png" alt="Coqueiro" className="absolute bottom-[-40px] right-[-40px] w-72 md:w-96 opacity-100 z-20 pointer-events-none transform scale-x-[-1] rotate-6" />

        <div className="absolute bottom-0 w-full leading-none z-10">
          <svg className="block w-full h-24 md:h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
             <path fill="#F4A460" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* SEÇÃO 2: Chamada para Ação */}
      <section className="min-h-[80vh] bg-[#F4A460] flex flex-col items-center justify-center p-8 relative z-10">
        <h2 className="text-3xl md:text-5xl text-orange-900 font-bold mb-10 text-center max-w-2xl drop-shadow-sm z-10 leading-snug">
          Envie a sua mensagem para o mundo agora.
        </h2>

        <button 
          onClick={handleWriteMessage}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 px-14 rounded-full text-lg md:text-xl shadow-2xl transition transform hover:scale-105 hover:-translate-y-1 z-10 border-4 border-orange-400/30 tracking-wide"
        >
          ESCREVER MENSAGEM
        </button>
        
        <div className="mt-20 animate-bounce text-orange-800 opacity-60 z-10">
          <p className="text-sm uppercase tracking-widest mb-2 font-bold">Como funciona</p>
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* SEÇÃO 3: O FAQ */}
      <section className="bg-[#e8b67d] py-24 px-6 relative font-sans">
        <div className="max-w-6xl mx-auto mb-20 relative">
          
          <img src="/crab.png" alt="Caranguejo" className="absolute top-[-150px] right-0 w-32 md:w-48 opacity-90 z-50 pointer-events-none transform rotate-12" />
          <img src="/crab.png" alt="Caranguejo" className="absolute bottom-[-100px] left-0 w-32 md:w-48 opacity-90 z-0 pointer-events-none transform -rotate-12 scale-x-[-1]" />

          <h3 className="text-4xl text-center text-orange-950 font-bold mb-16 drop-shadow-sm relative z-10">
            O Código da Maré 📜
          </h3>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-[#fffdf0]/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4 text-center">🏝️</div>
              <h4 className="text-2xl font-bold text-blue-900 mb-2 text-center">Você é um Ilhado</h4>
              <p className="text-gray-700 leading-relaxed text-center text-base">
                Neste jogo, você é um náufrago digital. Para participar, basta fazer seu cadastro ou login. 
                Aqui não existem fotos ou perfis, apenas suas palavras lançadas ao mar.
              </p>
            </div>

            <div className="bg-[#fffdf0]/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4 text-center">✍️</div>
              <h4 className="text-2xl font-bold text-orange-800 mb-2 text-center">Uma Carta, Um Dia</h4>
              <p className="text-gray-700 leading-relaxed text-center text-base">
                A escassez é valiosa. Você pode escrever e lançar apenas uma mensagem por dia. 
                Sua carta é colocada em uma garrafa e entregue ao destino, não a você.
              </p>
            </div>

            <div className="bg-[#fffdf0]/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4 text-center">🔭</div>
              <h4 className="text-2xl font-bold text-teal-800 mb-2 text-center">O Horizonte</h4>
              <p className="text-gray-700 leading-relaxed text-center text-base">
                Vê o número no céu? Ele conta as garrafas boiando agora. 
                Representa o total de mensagens escritas por todos os ilhados, aguardando a maré.
              </p>
            </div>

            <div className="bg-[#fffdf0]/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 md:col-span-1.5">
              <div className="text-5xl mb-4 text-center">🌕</div>
              <h4 className="text-2xl font-bold text-indigo-900 mb-2 text-center">A Maré das 22h</h4>
              <p className="text-gray-700 leading-relaxed text-center text-base">
                Todos os dias, às 22:00 (BRT), ocorre o grande sorteio. 
                As correntes marítimas levam sua garrafa para um estranho e trazem uma nova para sua praia.
              </p>
            </div>

            <div className="bg-[#fffdf0]/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 md:col-span-2">
              <div className="text-5xl mb-4 text-center">🐚</div>
              <h4 className="text-2xl font-bold text-yellow-800 mb-2 text-center">O Que a Maré Traz</h4>
              <p className="text-gray-700 leading-relaxed text-center text-base">
                A regra de ouro: Você escreve para o mundo, mas lê o que recebe. Suas mensagens enviadas partem para sempre. 
                Mas as garrafas que chegam na sua praia ficam salvas na sua lista para você ler e reler quando quiser.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center opacity-70 relative z-10">
             <p className="text-orange-950 text-lg italic leading-relaxed">
               "I'll send an SOS to the world<br />
               I hope that someone gets my<br />
               Message in a bottle, yeah"<br />
               — The Police
             </p>
          </div>
        </div>
      </section>
      
      {/* --- FOOTER COMPLETO RESTAURADO --- */}
      <footer className="bg-[#c2966b] text-orange-900/80 py-10 px-4 text-center border-t border-orange-900/10 font-sans z-20 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            
            <div className="flex items-center justify-center gap-8 mb-2">
                
                {/* GITHUB */}
                <a href="https://github.com/Claudino2001" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition duration-300" title="Meu GitHub">
                    <svg className="w-8 h-8 fill-current text-orange-900 hover:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>

                {/* LINKEDIN */}
                <a href="https://www.linkedin.com/in/gabrielclaudinoo/" target="_blank" rel="noreferrer" className="transform hover:scale-110 transition duration-300" title="Meu LinkedIn">
                    <svg className="w-8 h-8 fill-current text-orange-900 hover:text-blue-700" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>

                {/* EMAIL */}
                <a href="mailto:contato@messageinabottle.com.br" className="transform hover:scale-110 transition duration-300" title="Entre em contato">
                    <svg className="w-8 h-8 fill-current text-orange-900 hover:text-red-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    </svg>
                </a>

            </div>

            <div>
                <p className="font-bold text-lg">Gabriel Claudino</p>
                <p className="text-xs mt-1 opacity-70">&copy; {new Date().getFullYear()} Message in a Bottle. Todos os direitos reservados.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-center text-[10px] opacity-60 mt-4">
                <a href="https://www.flaticon.com/free-icons/crab" title="crab icons" target="_blank" rel="noreferrer" className="hover:text-orange-900 transition">
                    Crab icons created by Freepik - Flaticon
                </a>
                <a href="https://www.flaticon.com/free-icons/palm-tree" title="palm tree icons" target="_blank" rel="noreferrer" className="hover:text-orange-900 transition">
                    Palm tree icons created by justicon - Flaticon
                </a>
                <a href="https://www.flaticon.com/free-icons/xmas" title="xmas icons" target="_blank" rel="noreferrer" className="hover:text-orange-900 transition">
                    Starfish icons created by Freepik - Flaticon
                </a>
            </div>


        </div>
      </footer>
    </div>
  );
}

export default Home;