import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="absolute top-0 w-full p-6 flex flex-wrap justify-between items-center z-50 text-white">
      {/* LOGO: Ajustado para não quebrar linha (whitespace-nowrap) e tamanho responsivo */}
      <Link 
        to="/" 
        className="text-xl md:text-2xl font-hand font-bold drop-shadow-md hover:text-yellow-300 transition whitespace-nowrap"
      >
        Message in a Bottle
      </Link>

      {/* BOTÃO HAMBÚRGUER (Visível apenas no Mobile) */}
      <button 
        className="md:hidden text-white focus:outline-none" 
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          // Ícone X (Fechar)
          <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Ícone Hambúrguer (Abrir)
          <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* MENU DESKTOP (Hidden no mobile, Flex no MD) */}
      <div className="hidden md:flex space-x-6 font-bold text-lg drop-shadow-md items-center">
        <Link to="/" className="hover:text-yellow-300 transition">Início</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/write" className="hover:text-yellow-300 transition">Escrever</Link>
            <Link to="/bottles" className="hover:text-yellow-300 transition">Minhas Garrafas</Link>
            {/* COR AJUSTADA: Vermelho mais vivo */}
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition font-extrabold bg-white/20 px-3 py-1 rounded-lg">
              Sair
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-yellow-300 hover:text-blue-600 transition shadow-lg"
          >
            Entrar
          </Link>
        )}
      </div>

      {/* MENU MOBILE (Dropdown quando aberto) */}
      {isMenuOpen && (
        <div className="w-full md:hidden flex flex-col items-center mt-4 bg-blue-600/90 backdrop-blur-md rounded-xl p-4 space-y-4 shadow-xl border border-white/20 animate-fade-in-down">
          <Link to="/" className="hover:text-yellow-300 transition font-bold text-lg" onClick={() => setIsMenuOpen(false)}>Início</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/write" className="hover:text-yellow-300 transition font-bold text-lg" onClick={() => setIsMenuOpen(false)}>Escrever</Link>
              <Link to="/bottles" className="hover:text-yellow-300 transition font-bold text-lg" onClick={() => setIsMenuOpen(false)}>Minhas Garrafas</Link>
              <button 
                onClick={handleLogout} 
                className="text-red-300 hover:text-red-100 transition font-extrabold text-lg border border-red-300 px-6 py-1 rounded-full"
              >
                Sair
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-yellow-300 hover:text-blue-600 transition shadow-lg w-full text-center font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;