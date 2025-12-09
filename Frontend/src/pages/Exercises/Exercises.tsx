import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { deleteExercise, getAllExercises } from '../../lib/exerciseStore';

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExercises(getAllExercises());
  }, []);

  const handleDelete = (id: string, isSeed?: boolean) => {
    if (isSeed) {
      alert('Los ejercicios base no se pueden eliminar.');
      return;
    }
    if (confirm('¿Eliminar ejercicio?')) {
      deleteExercise(id);
      setExercises(getAllExercises());
    }
  };
  return (
    <Layout>
      <div className="flex flex-col gap-6">
      <header className="flex flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight">Biblioteca de Ejercicios</h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Busca, visualiza y gestiona la base de datos.</p>
        </div>
        <Link to="/exercises/new" aria-label="Añadir nuevo ejercicio" className="flex items-center justify-center gap-2 bg-primary text-background-dark px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2">
          <Plus size={20} />
          <span>Añadir Ejercicio</span>
        </Link>
      </header>

      {/* Search & Filters */}
      <section aria-label="Búsqueda y filtros">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="Buscar ejercicio por nombre..."
              aria-label="Buscar ejercicio por nombre"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-4 h-12 rounded-xl bg-white/5 text-white whitespace-nowrap border border-white/10 focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label="Filtrar por grupo muscular">
              Grupo Muscular <Filter size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 h-12 rounded-xl bg-white/5 text-white whitespace-nowrap border border-white/10 focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label="Filtrar por equipo">
              Equipo <Filter size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section aria-labelledby="exercises-grid-heading">
        <h2 id="exercises-grid-heading" className="sr-only">Lista de ejercicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-background-dark rounded-xl overflow-hidden border border-white/10 hover:border-primary group transition-all">
              <div className="relative aspect-video">
                <img src={ex.coverUrl || 'https://via.placeholder.com/400x250?text=Ejercicio'} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate(`/exercises/${ex.id}/edit`)} className="bg-black/60 p-1.5 rounded-full text-white hover:bg-black/80" aria-label="Editar ejercicio">
                    <MoreVertical size={16} />
                  </button>
                  <button onClick={() => handleDelete(ex.id, ex.isSeed)} className="bg-black/60 p-1.5 rounded-full text-red-400 hover:bg-black/80" aria-label="Eliminar ejercicio">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-white font-bold text-lg">{ex.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary">{ex.muscle}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90">{ex.equipment}</span>
                </div>
                <Link 
                  to={`/exercises/${ex.id}`}
                  aria-label={`Ver detalles del ejercicio ${ex.name}`} 
                  className="mt-4 block w-full text-center py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-medium focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Exercises;
