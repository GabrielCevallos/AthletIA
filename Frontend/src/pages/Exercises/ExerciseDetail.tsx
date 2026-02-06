import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Dumbbell, Target, Video, ImageIcon, ListOrdered, Heart, GitBranch, Edit, Trash2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { deleteExercise, getExerciseById, Exercise } from '../../lib/exerciseStore';
import Swal from 'sweetalert2';
import api from '../../lib/api';
import { useTranslation } from 'react-i18next';

const ExerciseDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/workout/exercises/${id}`);
        // Backend returns: { success: true, message: '...', data: Exercise }
        if (res.data?.data) {
          setExercise(res.data.data);
        } else {
          setExercise(getExerciseById(id) || null);
        }
      } catch (error) {
        console.warn('Backend fetch failed, trying local store', error);
        setExercise(getExerciseById(id) || null);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);

  const handleDelete = async () => {
    if (!exercise) return;
    if (exercise.isSeed) {
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
        await api.delete(`/workout/exercises/${exercise.id}`);
        await Swal.fire({
          icon: 'success',
          title: t('exercises.delete.success_title'),
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate('/exercises');
      } catch (error) {
         console.warn('Backend delete failed, trying local', error);
         const deleted = deleteExercise(exercise.id);
         if (deleted) {
            await Swal.fire({
              icon: 'success',
              title: t('exercises.detail.delete_local_success'),
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            navigate('/exercises');
         } else {
             await Swal.fire({
              icon: 'error',
              title: t('exercises.detail.delete_error_title'),
              text: t('exercises.detail.delete_error_text'),
            });
         }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-900 dark:text-white text-xl">{t('exercises.detail.not_found')}</p>
        <Link to="/exercises" className="text-primary hover:underline">{t('exercises.detail.back_to_list')}</Link>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/exercises')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label={t('exercises.detail.back_button_aria')}
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight">{exercise.name}</h1>
            <div className="flex items-center gap-2">
              {exercise.isPublic !== false ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                  <Eye size={14} /> {t('exercises.detail.public')}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-300">
                  <EyeOff size={14} /> {t('exercises.detail.private')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/exercises/${exercise.id}/edit`)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition text-gray-900 dark:text-white" aria-label={t('exercises.detail.edit_label')}>
            <Edit size={20} />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400" aria-label={t('exercises.detail.delete_label')}>
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Info */}
      <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-3 col-span-2">
            <div className="p-2 bg-primary/15 rounded-lg">
              <Target size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.detail.muscle_groups')}</p>
              <div className="flex flex-wrap gap-2">
                {exercise.muscleTarget && exercise.muscleTarget.length > 0 ? (
                  exercise.muscleTarget.map(muscle => (
                    <span key={muscle} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                      {t(`enums.muscle.${muscle}`, muscle)}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-900 dark:text-white text-lg font-bold">{t('exercises.detail.not_specified')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/15 rounded-lg">
              <Dumbbell size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">{t('exercises.detail.equipment')}</p>
              <p className="text-gray-900 dark:text-white text-lg font-bold">{t(`enums.equipment.${exercise.equipment}`, exercise.equipment)}</p>
            </div>
          </div>

          {exercise.parentExerciseId && exercise.parentExercise && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/15 rounded-lg">
                <GitBranch size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">{t('exercises.detail.variant_of')}</p>
                <button 
                  onClick={() => navigate(`/exercises/${exercise.parentExerciseId}`)}
                  className="text-primary hover:underline text-lg font-bold text-left"
                >
                  {exercise.parentExercise.name} ({t(`enums.equipment.${exercise.parentExercise.equipment}`, exercise.parentExercise.equipment)})
                </button>
              </div>
            </div>
          )}
        </div>

        {exercise.description && (
          <div className="mt-6 pt-6 border-t border-[#326744]">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.detail.description')}</p>
            <p className="text-gray-900 dark:text-white text-base leading-relaxed">{exercise.description}</p>
          </div>
        )}
      </section>

      {/* Multimedia */}
      {exercise.mediaFiles && exercise.mediaFiles.length > 0 && (
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
          <div className="flex items-center gap-2 mb-4">
            <Video size={20} className="text-primary" />
            <h2 className="text-gray-900 dark:text-white text-xl font-bold">{t('exercises.detail.multimedia_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercise.mediaFiles.map((file: any, idx: number) => (
              <div key={idx} className="bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                {file.data ? (
                  file.type?.startsWith('image/') ? (
                    <img src={file.data} alt={file.name} className="w-full aspect-video object-cover" />
                  ) : (
                    <video src={file.data} controls className="w-full aspect-video bg-black" />
                  )
                ) : (
                  <div className="flex items-center justify-center aspect-video bg-white/10">
                    {file.type?.startsWith('image/') ? <ImageIcon size={48} className="text-primary" /> : <Video size={48} className="text-primary" />}
                  </div>
                )}
                <div className="p-3">
                  <p className="text-gray-900 dark:text-white text-xs font-medium truncate">{file.name}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">{((file.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
          <div className="flex items-center gap-2 mb-4">
            <ListOrdered size={20} className="text-primary" />
            <h2 className="text-gray-900 dark:text-white text-xl font-bold">{t('exercises.detail.instructions_title')}</h2>
          </div>
          <ol className="space-y-3">
            {exercise.instructions.map((text: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-gray-900 dark:text-white text-sm leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Benefits */}
      {exercise.benefit && (
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={20} className="text-primary" />
            <h2 className="text-gray-900 dark:text-white text-xl font-bold">{t('exercises.detail.benefits_title')}</h2>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">{exercise.benefit.title}</p>
            {exercise.benefit.description && (
              <p className="text-gray-700 dark:text-white/90 text-sm leading-relaxed mb-3">{exercise.benefit.description}</p>
            )}
            {exercise.benefit.categories && exercise.benefit.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exercise.benefit.categories.map((cat: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-900 border border-gray-300 dark:bg-white/10 dark:text-white dark:border-white/10">{cat}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Variants */}
      {exercise.variants && exercise.variants.length > 0 && (
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={20} className="text-primary" />
            <h2 className="text-gray-900 dark:text-white text-xl font-bold">{t('exercises.detail.variants_title')}</h2>
          </div>
          <ul className="space-y-3">
            {exercise.variants.map((v: any, idx: number) => (
              <li key={idx} className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg text-gray-900 dark:text-white">
                <span className="font-bold">{v.name}</span>
                {v.notes && <span className="text-gray-600 dark:text-white/80 ml-2">— {v.notes}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </Layout>
  );
};

export default ExerciseDetail;
