import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, GripVertical, Trash2, Save, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { getAllExercises } from '../../lib/exerciseStore';
import { deleteRoutine, getRoutineById, upsertRoutine, Routine, RoutineExercise } from '../../lib/routineStore';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

// Utility for environments where crypto.randomUUID is not available (e.g. HTTP)
const generateLocalUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const RoutineCreator: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [routineName, setRoutineName] = useState(t('routines.create.default_name'));
  const [description, setDescription] = useState('');

  const library = useMemo(() => {
    return getAllExercises().map((ex) => ({ 
      id: ex.id, 
      name: ex.name, 
      muscle: ex.muscle,
      coverUrl: ex.coverUrl,
      mediaFiles: ex.mediaFiles
    }));
  }, []);

  // Helper to get exercise image
  const getExerciseImage = (exercise: any): string => {
    // Priority 1: coverUrl
    if (exercise.coverUrl) return exercise.coverUrl;
    
    // Priority 2: First image from mediaFiles
    if (exercise.mediaFiles && exercise.mediaFiles.length > 0) {
      const firstImage = exercise.mediaFiles.find((file: any) => 
        file.data && file.type?.startsWith('image/')
      );
      if (firstImage) return firstImage.data;
    }
    
    // Priority 3: No image
    return '';
  };

  useEffect(() => {
    // Si no está editando, asegurarse de establecer el nombre por defecto traducido
    if (!isEditing) {
      setRoutineName(t('routines.create.default_name'));
    }

    if (!isEditing || !id) return;
    const found = getRoutineById(id);
    if (!found) {
      navigate('/routines');
      return;
    }
    setRoutineName(found.name);
    setDescription(found.description || '');
    setRoutineExercises(found.exercises);
  }, [id, isEditing, navigate, t]);

  const addToRoutine = (exercise: { id: string; name: string; muscle?: string; coverUrl?: string; mediaFiles?: any[] }) => {
    setRoutineExercises([
      ...routineExercises,
      { ...exercise, uid: generateLocalUUID(), sets: 4, reps: '8-12' } as RoutineExercise,
    ]);
  };

  const updateField = (uid: string, field: keyof RoutineExercise, value: any) => {
    setRoutineExercises((prev) => prev.map((ex) => (ex.uid === uid ? { ...ex, [field]: value } : ex)));
  };

  const removeFromRoutine = (uid: string) => {
    setRoutineExercises(routineExercises.filter((ex: any) => ex.uid !== uid));
  };

  const handleSaveRoutine = async () => {
    if (routineExercises.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: t('routines.create.alerts.add_exercises_title'),
        text: t('routines.create.alerts.add_exercises_text'),
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }
    const record: Routine = {
      id: id || generateLocalUUID(),
      name: routineName,
      description,
      exercises: routineExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        notes: ex.notes,
      })),
      createdAt: new Date().toISOString(),
    };
    upsertRoutine(record);
    await Swal.fire({
      icon: 'success',
      title: t('routines.create.alerts.routine_saved_title'),
      text: t('routines.create.alerts.routine_saved_text', { name: routineName }),
      confirmButtonText: t('common.actions.continue') || 'Continuar',
    });
    navigate('/routines');
  };

  const handleSaveTemplate = async () => {
    await handleSaveRoutine();
  };

  const handleDelete = async () => {
    if (!id) return;
    const result = await Swal.fire({
      title: t('routines.create.alerts.delete_title'),
      text: t('routines.create.alerts.delete_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: t('common.actions.cancel'),
      confirmButtonText: t('routines.create.actions.delete'),
    });

    if (result.isConfirmed) {
      deleteRoutine(id);
      await Swal.fire({
        icon: 'success',
        title: t('routines.create.alerts.delete_success'),
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate('/routines');
    }
  };

  return (
    <Layout>
        <div className="flex flex-col h-[calc(100vh-100px)] gap-4 md:gap-6">
         <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate('/routines')} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label={t('common.actions.back')}>
              <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{t('routines.create.title')}</h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{t('routines.create.subtitle')}</p>
            </div>
         </div>
        <div className="flex gap-2 sm:gap-3">
          {isEditing && (
          <button onClick={handleDelete} className="px-3 sm:px-4 py-2 rounded-lg bg-red-900/30 text-red-300 font-bold text-xs sm:text-sm focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">{t('routines.create.actions.delete')}</button>
          )}
           <button onClick={handleSaveTemplate} className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-xs sm:text-sm focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">{t('routines.create.actions.save_template')}</button>
           <button onClick={handleSaveRoutine} className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-background-dark font-bold text-xs sm:text-sm hover:bg-primary/90 focus-visible:outline-[3px] focus-visible:outline-white/40 focus-visible:outline-offset-2">{t('routines.create.actions.save_routine')}</button>
         </div>
       </header>

         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0" aria-label={t('routines.create.builder.heading_aria')}>
          {/* Library */}
          <aside className="bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden shadow-card-md" aria-labelledby="library-heading">
           <div className="p-3 md:p-4 border-b border-gray-200 dark:border-white/10">
            <h2 id="library-heading" className="text-gray-900 dark:text-white text-base md:text-lg font-bold mb-3">{t('routines.create.library.title')}</h2>
                <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} aria-hidden />
              <input aria-label={t('routines.create.library.search_aria')} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder={t('routines.create.library.search_placeholder')} />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
              {library.map(ex => {
                const imageUrl = getExerciseImage(ex);
                return (
              <div key={ex.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors gap-3">
                {imageUrl ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💪</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{ex.name}</p>
                  <p className="text-gray-400 text-xs truncate">{ex.muscle}</p>
                </div>
                <button onClick={() => addToRoutine(ex)} aria-label={t('routines.create.library.add_aria', { name: ex.name })} className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-background-dark transition-colors focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2 flex-shrink-0">
                  <Plus size={16} />
                </button>
              </div>
              );
              })}
             </div>
          </aside>

          {/* Builder */}
          <article className="lg:col-span-2 flex flex-col gap-3 md:gap-4" aria-labelledby="builder-heading">
             <h2 id="builder-heading" className="sr-only">{t('routines.create.builder.heading_aria')}</h2>
             <div className="flex flex-col gap-2">
            <label htmlFor="routine-name" className="text-gray-300 text-sm md:text-base font-bold">{t('routines.create.builder.routine_name_label')}</label>
                <input 
                  id="routine-name"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
              className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none" 
                />
                <textarea
              className="w-full mt-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                  placeholder={t('routines.create.builder.description_placeholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>
             
           <div className="flex-1 bg-gray-50 dark:bg-background-dark rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 p-4 flex flex-col gap-3 overflow-y-auto">
                {routineExercises.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                        <GripVertical size={48} />
                        <p className="mt-2">{t('routines.create.builder.empty_state')}</p>
                    </div>
                ) : (
                    routineExercises.map((ex) => {
                      const imageUrl = getExerciseImage(ex);
                      return (
                <div key={ex.uid} className="bg-white/5 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <GripVertical className="text-gray-400 cursor-grab flex-shrink-0" size={20} />
                  {imageUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-base">💪</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-[100px]">
                    <p className="text-white font-bold text-sm">{ex.name}</p>
                  </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">{t('routines.create.builder.headers.sets')}</label>
                  <input aria-label={t('routines.create.builder.inputs.sets_aria', { name: ex.name })} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" value={ex.sets ?? ''} onChange={(e) => updateField(ex.uid as string, 'sets', Number(e.target.value) || undefined)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">{t('routines.create.builder.headers.reps')}</label>
                  <input aria-label={t('routines.create.builder.inputs.reps_aria', { name: ex.name })} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" value={ex.reps ?? ''} onChange={(e) => updateField(ex.uid as string, 'reps', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">{t('routines.create.builder.headers.rest')}</label>
                  <input aria-label={t('routines.create.builder.inputs.rest_aria', { name: ex.name })} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" placeholder="60s" value={ex.rest ?? ''} onChange={(e) => updateField(ex.uid as string, 'rest', e.target.value)} />
                                </div>
                            </div>
                            <div className="flex gap-2 ml-auto flex-shrink-0">
                    <button className="p-2 hover:bg-white/10 rounded text-gray-300" aria-label={t('routines.create.builder.actions.notes_aria', { name: ex.name })}><FileText size={18} /></button>
                  <button onClick={() => removeFromRoutine(ex.uid as string)} className="p-2 hover:bg-red-900/30 rounded text-red-400" aria-label={t('routines.create.builder.actions.remove_aria', { name: ex.name })}><Trash2 size={18} /></button>
                            </div>
                        </div>
                      );
                    })
                )}
             </div>
          </article>
       </section>
      </div>
    </Layout>
  );
};

export default RoutineCreator;
