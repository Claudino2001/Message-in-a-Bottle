import { useEffect, useState } from "react";
import api from "../services/api";

function MyBottles() {
  const [bottles, setBottles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get("/bottles/received").then((res) => { setBottles(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const sortedBottles = [...bottles].sort((a, b) => {
    const dA = new Date(a.created_at), dB = new Date(b.created_at);
    return sortOrder === 'asc' ? dA - dB : dB - dA;
  });

  return (
    <div className="min-h-screen bg-[#F4A460] pt-24 px-4 pb-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl text-orange-900 font-bold mb-8 text-center drop-shadow-sm">
          Garrafas que a maré trouxe 🐚
        </h2>

        {loading ? (
          <p className="text-center text-white text-xl animate-pulse">Procurando na areia...</p>
        ) : bottles.length === 0 ? (
          <div className="text-center bg-orange-200/50 p-10 rounded-xl border-2 border-orange-300 border-dashed">
            <p className="text-2xl text-orange-800 font-bold">Nenhuma garrafa encontrada ainda.</p>
            <p className="mt-2 text-orange-900 text-lg">Aguarde o sorteio das 22h!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 text-orange-900 font-bold hover:text-white transition bg-orange-300/50 px-4 py-2 rounded-full text-sm"
              >
                {sortOrder === 'desc' ? '⬇️ Mais Recentes' : '⬆️ Mais Antigas'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {sortedBottles.map((bottle) => {
                const isExpanded = expandedId === bottle.id;
                return (
                  <div key={bottle.id} onClick={() => setExpandedId(prev => (prev === bottle.id ? null : bottle.id))}
                    className={`bg-[#fffdf0] p-5 rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:translate-x-1 ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-blue-900">{bottle.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                          {new Date(bottle.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>⌄</span>
                      </div>
                    </div>

                    <div className="relative">
                      <p className={`text-gray-700 text-lg leading-relaxed ${isExpanded ? '' : 'line-clamp-2 opacity-80'}`}>
                        "{bottle.content}"
                      </p>
                      {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#fffdf0] to-transparent"></div>}
                    </div>
                    
                    {isExpanded && <div className="mt-4 text-center text-sm text-blue-400 font-bold hover:underline">Recolher carta</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyBottles;