import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  // Truque simples para saber se tá logado: verifica se tem token salvo
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // Recarrega para atualizar a barra
  };

  return (
    <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50 text-white">
      <Link to="/" className="text-2xl font-hand font-bold drop-shadow-md hover:text-yellow-300 transition">
        Message in a Bottle
      </Link>

      <div className="space-x-6 font-bold text-lg drop-shadow-md">
        <Link to="/" className="hover:text-yellow-300 transition">Início</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/write" className="hover:text-yellow-300 transition">Escrever</Link>
            <Link to="/bottles" className="hover:text-yellow-300 transition">Minhas Garrafas</Link>
            <button onClick={handleLogout} className="text-red-200 hover:text-red-400 transition">
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
    </nav>
  );
}

export default NavBar;