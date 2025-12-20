import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <--- Importante

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Hook de tradução
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para trocar idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false); // Fecha menu mobile se estiver aberto
  };

  return (
    <nav className="absolute top-0 w-full p-6 flex flex-wrap justify-between items-center z-50 text-white">
      {/* LOGO */}
      <Link 
        to="/" 
        className="text-2xl md:text-3xl font-bold drop-shadow-md hover:text-yellow-300 transition whitespace-nowrap"
      >
        Message in a Bottle
      </Link>

      {/* BOTÃO HAMBÚRGUER (Mobile) */}
      <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
        <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* MENU DESKTOP */}
      <div className="hidden md:flex space-x-6 font-bold text-lg drop-shadow-md items-center">
        <Link to="/" className="hover:text-yellow-300 transition">{t('navbar.home')}</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/write" className="hover:text-yellow-300 transition">{t('navbar.write')}</Link>
            <Link to="/bottles" className="hover:text-yellow-300 transition">{t('navbar.my_bottles')}</Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition font-extrabold bg-white/20 px-3 py-1 rounded-lg">
              {t('navbar.logout')}
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-yellow-300 hover:text-blue-600 transition shadow-lg">
            {t('navbar.login')}
          </Link>
        )}

        {/* SELETOR DE IDIOMAS DESKTOP */}
        <div className="flex gap-2 ml-4 border-l pl-4 border-white/40">
            <button onClick={() => changeLanguage('pt')} className={`hover:scale-125 transition ${i18n.language.startsWith('pt') ? 'opacity-100' : 'opacity-50'}`} title="Português">🇧🇷</button>
            <button onClick={() => changeLanguage('en')} className={`hover:scale-125 transition ${i18n.language.startsWith('en') ? 'opacity-100' : 'opacity-50'}`} title="English">🇺🇸</button>
            <button onClick={() => changeLanguage('es')} className={`hover:scale-125 transition ${i18n.language.startsWith('es') ? 'opacity-100' : 'opacity-50'}`} title="Español">🇪🇸</button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMenuOpen && (
        <div className="w-full md:hidden flex flex-col items-center mt-4 bg-blue-600/90 backdrop-blur-md rounded-xl p-4 space-y-4 shadow-xl border border-white/20 animate-fade-in-down font-bold">
          <Link to="/" className="hover:text-yellow-300 transition text-lg" onClick={() => setIsMenuOpen(false)}>{t('navbar.home')}</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/write" className="hover:text-yellow-300 transition text-lg" onClick={() => setIsMenuOpen(false)}>{t('navbar.write')}</Link>
              <Link to="/bottles" className="hover:text-yellow-300 transition text-lg" onClick={() => setIsMenuOpen(false)}>{t('navbar.my_bottles')}</Link>
              <button onClick={handleLogout} className="text-red-200 hover:text-white transition border border-red-300 px-6 py-1 rounded-full">
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-yellow-300 hover:text-blue-600 transition shadow-lg w-full text-center" onClick={() => setIsMenuOpen(false)}>
              {t('navbar.login')}
            </Link>
          )}

          {/* SELETOR MOBILE */}
          <div className="flex gap-6 pt-4 border-t border-white/20 w-full justify-center">
            <button onClick={() => changeLanguage('pt')} className="text-2xl">🇧🇷</button>
            <button onClick={() => changeLanguage('en')} className="text-2xl">🇺🇸</button>
            <button onClick={() => changeLanguage('es')} className="text-2xl">🇪🇸</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;