import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, GripVertical, Trash2, Save, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { getAllExercises } from '../../lib/exerciseStore';
import { deleteRoutine, getRoutineById, upsertRoutine, Routine, RoutineExercise } from '../../lib/routineStore';
import Swal from 'sweetalert2';

const RoutineCreator: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [routineName, setRoutineName] = useState('Nueva Rutina');
  const [description, setDescription] = useState('');

  const library = useMemo(() => {
    return getAllExercises().map((ex) => ({ id: ex.id, name: ex.name, muscle: ex.muscle }));
  }, []);

  useEffect(() => {
    if (!isEditing || !id) return;
    const found = getRoutineById(id);
    if (!found) {
      navigate('/routines');
      return;
    }
    setRoutineName(found.name);
    setDescription(found.description || '');
    setRoutineExercises(found.exercises);
  }, [id, isEditing, navigate]);

  const addToRoutine = (exercise: { id: string; name: string; muscle?: string }) => {
    setRoutineExercises([
      ...routineExercises,
      { ...exercise, uid: crypto.randomUUID(), sets: 4, reps: '8-12' } as RoutineExercise,
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
        title: 'Añade ejercicios',
        text: 'Por favor añade al menos un ejercicio a la rutina.',
        confirmButtonText: 'Entendido',
      });
      return;
    }
    const record: Routine = {
      id: id || crypto.randomUUID(),
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
      title: 'Rutina guardada',
      text: `La rutina "${routineName}" ha sido guardada.`,
      confirmButtonText: 'Continuar',
    });
    navigate('/routines');
  };

  const handleSaveTemplate = async () => {
    await handleSaveRoutine();
  };

  const handleDelete = async () => {
    if (!id) return;
    const result = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
    });

    if (result.isConfirmed) {
      deleteRoutine(id);
      await Swal.fire({
        icon: 'success',
        title: 'Rutina eliminada',
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
         <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">Creador de Rutinas</h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Crea rutinas personalizadas.</p>
         </div>
        <div className="flex gap-2 sm:gap-3">
          {isEditing && (
          <button onClick={handleDelete} className="px-3 sm:px-4 py-2 rounded-lg bg-red-900/30 text-red-300 font-bold text-xs sm:text-sm focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">Eliminar</button>
          )}
           <button onClick={handleSaveTemplate} className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-xs sm:text-sm focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">Guardar Plantilla</button>
           <button onClick={handleSaveRoutine} className="px-3 sm:px-4 py-2 rounded-lg bg-primary text-background-dark font-bold text-xs sm:text-sm hover:bg-primary/90 focus-visible:outline-[3px] focus-visible:outline-white/40 focus-visible:outline-offset-2">Guardar Rutina</button>
         </div>
       </header>

         <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0" aria-label="Constructor de rutina">
          {/* Library */}
          <aside className="bg-white dark:bg-background-dark rounded-xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden shadow-card-md" aria-labelledby="library-heading">
           <div className="p-3 md:p-4 border-b border-gray-200 dark:border-white/10">
            <h2 id="library-heading" className="text-gray-900 dark:text-white text-base md:text-lg font-bold mb-3">Biblioteca</h2>
                <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} aria-hidden />
              <input aria-label="Buscar en biblioteca" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Buscar..." />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
              {library.map(ex => (
              <div key={ex.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors">
                        <div>
                  <p className="text-white font-medium text-sm">{ex.name}</p>
                  <p className="text-gray-400 text-xs">{ex.muscle}</p>
                        </div>
                <button onClick={() => addToRoutine(ex)} aria-label={`Añadir ${ex.name} a la rutina`} className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-background-dark transition-colors focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">
                            <Plus size={16} />
                        </button>
                    </div>
                ))}
             </div>
          </aside>

          {/* Builder */}
          <article className="lg:col-span-2 flex flex-col gap-3 md:gap-4" aria-labelledby="builder-heading">
             <h2 id="builder-heading" className="sr-only">Constructor de ejercicios</h2>
             <div className="flex flex-col gap-2">
            <label htmlFor="routine-name" className="text-gray-300 text-sm md:text-base font-bold">Nombre de la Rutina</label>
                <input 
                  id="routine-name"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
              className="w-full bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-gray-900 dark:text-white focus:border-primary focus:outline-none" 
                />
                <textarea
              className="w-full mt-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                  placeholder="Descripción breve"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>
             
           <div className="flex-1 bg-gray-50 dark:bg-background-dark rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 p-4 flex flex-col gap-3 overflow-y-auto">
                {routineExercises.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                        <GripVertical size={48} />
                        <p className="mt-2">Añade ejercicios de la biblioteca</p>
                    </div>
                ) : (
                    routineExercises.map((ex) => (
                <div key={ex.uid} className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <GripVertical className="text-gray-400 cursor-grab" />
                            <div className="flex-1 min-w-[150px]">
                                <p className="text-white font-bold">{ex.name}</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">Series</label>
                  <input aria-label={`Series para ${ex.name}`} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" value={ex.sets ?? ''} onChange={(e) => updateField(ex.uid as string, 'sets', Number(e.target.value) || undefined)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">Reps</label>
                  <input aria-label={`Repeticiones para ${ex.name}`} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" value={ex.reps ?? ''} onChange={(e) => updateField(ex.uid as string, 'reps', e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] text-[#92c9a4] uppercase">Descanso</label>
                  <input aria-label={`Descanso para ${ex.name}`} className="w-16 bg-white/10 rounded p-1 text-center text-white text-sm border border-white/10" placeholder="60s" value={ex.rest ?? ''} onChange={(e) => updateField(ex.uid as string, 'rest', e.target.value)} />
                                </div>
                            </div>
                            <div className="flex gap-2 ml-auto">
                    <button className="p-2 hover:bg-white/10 rounded text-gray-300" aria-label={`Notas para ${ex.name}`}><FileText size={18} /></button>
                  <button onClick={() => removeFromRoutine(ex.uid as string)} className="p-2 hover:bg-red-900/30 rounded text-red-400" aria-label={`Eliminar ${ex.name} de la rutina`}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </article>
       </section>
      </div>
    </Layout>
  );
};

export default RoutineCreator;
