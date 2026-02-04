import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { deleteExercise, getAllExercises } from '../../lib/exerciseStore';
import { MuscleTargetLabels, EquipmentLabels } from '../../lib/enums';
import Swal from 'sweetalert2';
import api from '../../lib/api';
import { useTranslation } from 'react-i18next';

const Exercises: React.FC = () => {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await api.get('/workout/exercises');
      const items = res.data?.data?.items || [];
      setExercises(items);
    } catch (error) {
      console.warn('Fallo al traer ejercicios del backend, usando localStorage:', error);
      setExercises(getAllExercises());
    }
  };

  const handleDelete = async (id: string, isSeed?: boolean) => {
    if (isSeed) {
      await Swal.fire({
        icon: 'info',
        title: t('exercises.delete.protected_title'),
        text: t('exercises.delete.protected_text'),
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }

    const result = await Swal.fire({
      title: t('exercises.delete.confirm_title'),
      text: t('exercises.delete.confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: t('common.actions.cancel'),
      confirmButtonText: t('exercises.delete.confirm_button'),
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/workout/exercises/${id}`);
        await Swal.fire({
          icon: 'success',
          title: t('exercises.delete.success_title'),
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        fetchExercises();
      } catch (error: any) {
        console.error('Error eliminando en backend:', error);
        // Fallback: intenta borrar local si era custom
        const deletedLocal = deleteExercise(id);
        if (deletedLocal) {
          setExercises(getAllExercises());
        }
        await Swal.fire({
          icon: 'error',
          title: t('exercises.delete.error_title'),
          text: error?.response?.data?.message || t('exercises.delete.admin_required'),
        });
      }
    }
  };
  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight">{t('exercises.title')}</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{t('exercises.subtitle')}</p>
        </div>
        <Link to="/exercises/new" aria-label={t('exercises.add_button')} className="flex items-center justify-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-primary/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap">
          <Plus size={20} />
          <span>{t('exercises.add_button')}</span>
        </Link>
      </header>

      {/* Search & Filters */}
      <section aria-label="Búsqueda y filtros">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} className="sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              placeholder={t('exercises.search_placeholder')}
              aria-label={t('exercises.search_placeholder')}
              className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-3 sm:px-4 h-11 sm:h-12 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white whitespace-nowrap border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base" aria-label={t('exercises.filter_muscle')}>
              {t('exercises.filter_muscle')} <Filter size={16} />
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 h-11 sm:h-12 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white whitespace-nowrap border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base" aria-label={t('exercises.filter_equipment')}>
              {t('exercises.filter_equipment')} <Filter size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section aria-labelledby="exercises-grid-heading">
        <h2 id="exercises-grid-heading" className="sr-only">{t('exercises.grid_heading')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white dark:bg-background-dark rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-primary group transition-all shadow-card-md hover:shadow-lg">
              <div className="relative aspect-video">
                <img src={ex.coverUrl || 'https://via.placeholder.com/400x250?text=Ejercicio'} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate(`/exercises/${ex.id}/edit`)} className="bg-black/60 p-1.5 rounded-full text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-primary" aria-label={`${t('common.actions.edit')} ${ex.name}`}>
                    <MoreVertical size={16} />
                  </button>
                  <button onClick={() => handleDelete(ex.id, ex.isSeed)} className="bg-black/60 p-1.5 rounded-full text-red-400 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={`${t('common.actions.delete')} ${ex.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-2">
                <h3 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg line-clamp-2">{ex.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {ex.muscleTarget && ex.muscleTarget.length > 0 ? (
                    <>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                        {MuscleTargetLabels[ex.muscleTarget[0] as keyof typeof MuscleTargetLabels]}
                      </span>
                      {ex.muscleTarget.length > 1 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {t('exercises.card.plus_more')}{ex.muscleTarget.length - 1}
                        </span>
                      )}
                    </>
                  ) : ex.muscle ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary">{ex.muscle}</span>
                  ) : null}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white/90">
                    {ex.equipment && EquipmentLabels[ex.equipment as keyof typeof EquipmentLabels] ? EquipmentLabels[ex.equipment as keyof typeof EquipmentLabels] : ex.equipment || t('exercises.card.unspecified_equipment')}
                  </span>
                </div>
                <Link 
                  to={`/exercises/${ex.id}`}
                  aria-label={`${t('exercises.card.details_button')} ${ex.name}`} 
                  className="mt-3 sm:mt-4 block w-full text-center py-2 rounded-lg border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t('exercises.card.details_button')}
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
