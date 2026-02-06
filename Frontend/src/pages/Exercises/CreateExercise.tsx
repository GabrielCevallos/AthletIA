import React, { useEffect, useState } from 'react';
import { Sparkles, Save, X, Upload, Image as ImageIcon, Video, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { generateExerciseDescription } from '../../lib/api';
import { upsertExercise, getExerciseById, getAllExercises, Exercise, StoredMedia, ValidationError, validateCompleteExercise } from '../../lib/exerciseStore';
import { MuscleTarget, MuscleTargetLabels, Equipment, EquipmentLabels, ExerciseType, ExerciseTypeLabels } from '../../lib/enums';
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

const CreateExercise: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  // 1 Info, 2 Muscles, 3 Exercise Type, 4 Video/Multimedia, 5 Benefits, 6 Visibility, 7 Preview
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [muscleTarget, setMuscleTarget] = useState<MuscleTarget[]>([]);
  const [equipment, setEquipment] = useState<Equipment>(Equipment.BODYWEIGHT);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [video, setVideo] = useState('');
  const [minSets, setMinSets] = useState<number | undefined>(3);
  const [maxSets, setMaxSets] = useState<number | undefined>(5);
  const [minReps, setMinReps] = useState<number | undefined>(8);
  const [maxReps, setMaxReps] = useState<number | undefined>(12);
  const [minRestTime, setMinRestTime] = useState<number | undefined>(60);
  const [maxRestTime, setMaxRestTime] = useState<number | undefined>(120);
  const [exerciseType, setExerciseType] = useState<ExerciseType[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [storedMedia, setStoredMedia] = useState<StoredMedia[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [benefitCategories, setBenefitCategories] = useState<string[]>([]);
  const [variants, setVariants] = useState<Array<{ name: string; notes?: string }>>([]);
  const [createdAt, setCreatedAt] = useState<string | undefined>();
  const [isSeedExercise, setIsSeedExercise] = useState(false);
  const [parentExerciseId, setParentExerciseId] = useState<string>('');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    // Cargar todos los ejercicios disponibles para selección
    setAvailableExercises(getAllExercises().filter(ex => ex.id !== id));
    
    if (!isEditing || !id) return;
    const found = getExerciseById(id);
    if (!found) {
      navigate('/exercises');
      return;
    }
    setName(found.name);
    setMuscleTarget(found.muscleTarget || []);
    setEquipment(found.equipment || Equipment.BODYWEIGHT);
    setDescription(found.description || '');
    setVideo(found.video || '');
    setMinSets(found.minSets);
    setMaxSets(found.maxSets);
    setMinReps(found.minReps);
    setMaxReps(found.maxReps);
    setMinRestTime(found.minRestTime);
    setMaxRestTime(found.maxRestTime);
    setExerciseType(found.exerciseType || []);
    setIsPublic(found.isPublic);
    setInstructions(found.instructions && found.instructions.length ? found.instructions : ['']);
    setBenefitTitle(found.benefit?.title || '');
    setBenefitDescription(found.benefit?.description || '');
    setBenefitCategories(found.benefit?.categories || []);
    setVariants(found.variants || []);
    setStoredMedia(found.mediaFiles || []);
    setCreatedAt(found.createdAt);
    setIsSeedExercise(Boolean(found.isSeed));
    setParentExerciseId(found.parentExerciseId || '');
  }, [id, isEditing, navigate]);

  const handleGenerateAI = async () => {
    if (!name) {
      await Swal.fire({
        icon: 'info',
        title: t('exercises.create.alerts.fill_required'),
        text: t('exercises.create.alerts.fill_required_msg'),
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }
    setIsGenerating(true);
    try {
      const muscleLabel = muscleTarget.length > 0 ? t(`enums.muscle.${muscleTarget[0]}`) : 'General';
      const equipmentLabel = t(`enums.equipment.${equipment}`);
      console.log('🔄 Generando descripción:', { name, muscleLabel, equipmentLabel });
      const desc = await generateExerciseDescription(name, muscleLabel, equipmentLabel);
      console.log('✅ Descripción generada:', desc);
      setDescription(desc);
      
      // Always show success notification (backend now has smart fallback)
      await Swal.fire({
        icon: 'success',
        title: '¡Descripción generada!',
        text: 'Se ha creado una descripción detallada para tu ejercicio.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('❌ Error generating description:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Error desconocido';
      
      await Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        html: `<p>No se pudo generar la descripción.</p><small class="text-gray-500">${errorMessage}</small>`,
        confirmButtonText: t('common.actions.understood'),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/png,video/mp4';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const newUrls = files.map(f => URL.createObjectURL(f));
      setMediaFiles([...mediaFiles, ...files]);
      setMediaPreviewUrls([...mediaPreviewUrls, ...newUrls]);
    };
    input.click();
  };

  const handleRemoveMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreviewUrls(mediaPreviewUrls.filter((_, i) => i !== index));
  };

  const handleRemoveStoredMedia = (mediaId: string) => {
    setStoredMedia(storedMedia.filter((item) => item.id !== mediaId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter((file: File) => 
      file.type.startsWith('image/') || file.type === 'video/mp4'
    );
    
    if (files.length > 0) {
      const newUrls = files.map((f: File) => URL.createObjectURL(f));
      setMediaFiles([...mediaFiles, ...files]);
      setMediaPreviewUrls([...mediaPreviewUrls, ...newUrls]);
    }
  };

  const handleSave = async () => {
    if (!name) {
      await Swal.fire({
        icon: 'info',
        title: t('exercises.create.alerts.fill_required'),
        text: t('exercises.create.alerts.fill_required_msg'),
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }
    // Ir al paso 2: Grupos Musculares
    setStep(2);
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 7));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Only reject if user is ADDING characters beyond 500 (not when deleting)
    if (newValue.length > 500 && newValue.length > description.length) {
      Swal.fire({
        icon: 'error',
        title: 'Límite de caracteres alcanzado',
        text: `La descripción no puede exceder 500 caracteres`,
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setDescription(newValue);
  };

  const handlePublish = async () => {
    console.log('🚀 Iniciando handlePublish...');
    
    // Validar descripción primero
    if (!description || description.trim().length === 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Descripción requerida',
        text: 'La descripción es obligatoria para crear el ejercicio',
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }

    if (description.length > 500) {
      await Swal.fire({
        icon: 'error',
        title: 'Límite de caracteres excedido',
        text: `La descripción no puede exceder 500 caracteres (actualmente tiene ${description.length})`,
        confirmButtonText: t('common.actions.understood'),
      });
      return;
    }
    
    // Compilar el ejercicio con todos los campos
    const exerciseData: Partial<Exercise> = {
      name,
      muscleTarget,
      equipment,
      description,
      video,
      minSets,
      maxSets,
      minReps,
      maxReps,
      minRestTime,
      maxRestTime,
      exerciseType,
    };

    // Validar todos los campos
    const errors = validateCompleteExercise(exerciseData);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(e => `${e.field}: ${e.message}`).join('\n');
      await Swal.fire({
        icon: 'error',
        title: t('exercises.create.alerts.fill_required'),
        text: t('exercises.create.alerts.fill_required_msg'),
        footer: errorMessages,
        confirmButtonText: t('common.actions.understood'),
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    try {
      console.log('✅ Validación pasada');

      // Mostrar cargando (no usar await aquí para no bloquear)
      Swal.fire({
        title: t('exercises.create.alerts.saving'),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      console.log('⏳ Esperando conversión de archivos a base64...');
      const newMedia: StoredMedia[] = await Promise.all(
        mediaFiles.map(
          (file) =>
            new Promise<StoredMedia>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  id: generateLocalUUID(),
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: reader.result as string,
                });
              };
              reader.readAsDataURL(file);
            })
        )
      );

      console.log('✅ Archivos convertidos a base64');
      const createdTimestamp = !createdAt || isSeedExercise ? new Date().toISOString() : createdAt;

      // Usa la primera imagen disponible como portada
      const coverCandidate = [...newMedia, ...storedMedia].find((file) => file.type?.startsWith('image/'));

      console.log('📋 Compilando payload...');
      const payload: Exercise = {
        // IMPORTANTE: Para nuevos ejercicios, NO generar ID (dejar undefined)
        // El backend lo generará. Solo para ediciones usar ID existente.
        id: (isEditing && id && !isSeedExercise) ? id : generateLocalUUID(),
        name: name.trim(),
        muscleTarget,
        equipment,
        description: description || undefined,
        video: video || undefined,
        minSets,
        maxSets,
        minReps,
        maxReps,
        minRestTime,
        maxRestTime,
        exerciseType,
        mediaFiles: [...storedMedia, ...newMedia],
        coverUrl: coverCandidate?.data,
        instructions: instructions.map((i) => i.trim()).filter(Boolean),
        benefit:
          benefitTitle || benefitDescription || benefitCategories.length
            ? {
                title: benefitTitle || 'Beneficio',
                description: benefitDescription || undefined,
                categories: benefitCategories,
              }
            : null,
        variants,
        isPublic,
        createdAt: createdTimestamp,
        parentExerciseId: parentExerciseId || null,
        isSeed: isSeedExercise,
      };

      console.log('📤 Enviando payload al servidor...');
      console.log('📤 isEditing:', isEditing);
      // Guardar en backend
      const { saveExercise } = await import('../../lib/api');
      console.log('✅ saveExercise importado');
      
      const saved = await saveExercise(payload as any, isEditing);
      console.log('✅ Ejercicio guardado en backend:', saved);

      // Guardar también en localStorage como backup
      upsertExercise(saved as any);

      mediaPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setMediaFiles([]);
      setMediaPreviewUrls([]);
      setStoredMedia(saved.mediaFiles || []);
      setCreatedAt(saved.createdAt);

      // Cerrar el modal de carga antes de mostrar el de éxito
      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: t('exercises.create.alerts.success'),
        text: isEditing && !isSeedExercise
          ? t('exercises.create.alerts.updated')
          : t('exercises.create.alerts.created'),
        confirmButtonText: t('common.actions.understood'),
      });
      navigate(`/exercises/${saved.id}`);
    } catch (error: any) {
      console.error('❌ Error saving exercise:', error);
      console.error('Error stack:', error.stack);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.statusText 
        || error.message 
        || 'Error desconocido';
      const errorDetails = error.response?.data?.data || error.response?.data || '';
      const status = error.response?.status || 'N/A';
      
      console.error('Status:', status);
      console.error('Message:', errorMessage);
      console.error('Details:', errorDetails);
      
      // Cerrar el modal de carga
      Swal.close();
      
      await Swal.fire({
        icon: 'error',
        title: `${t('exercises.create.alerts.error')} (${status})`,
        html: `<p><strong>${errorMessage}</strong></p>${errorDetails ? `<small>${typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}</small>` : ''}`,
        confirmButtonText: t('common.actions.understood'),
      });
    }
  };

  const handleCancel = async () => {
    // Si estamos en los últimos pasos, solo volver atrás
    if (step > 1 && step <= 7) {
      setStep(step - 1);
      return;
    }
    
    // Si estamos en el paso 1 y hay datos, pedir confirmación
    if (name || muscleTarget.length > 0 || equipment !== Equipment.BODYWEIGHT || description || video || mediaFiles.length > 0) {
      const result = await Swal.fire({
        title: t('exercises.create.alerts.discard_title'),
        text: t('exercises.create.alerts.discard_text'),
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: t('exercises.create.alerts.keep_editing'),
        confirmButtonText: t('exercises.create.alerts.discard_confirm'),
        confirmButtonColor: '#ef4444',
      });

      if (result.isConfirmed) {
        mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
        navigate('/exercises');
      }
    } else {
      navigate('/exercises');
    }
  };

  const previewMedia = [
    ...storedMedia.map((item) => ({
      key: item.id,
      name: item.name,
      size: item.size,
      type: item.type,
      url: item.data,
      isStored: true,
    })),
    ...mediaFiles.map((file, index) => ({
      key: `new-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: mediaPreviewUrls[index],
      isStored: false,
    })),
  ];

  // Step 12: Preview/Confirm Screen
  if (step === 7) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button 
            onClick={goPrev}
            className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label={t('exercises.create.actions.back')}
          >
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step7_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step7_desc')}</p>
          </div>
        </header>

        <section aria-labelledby="preview-heading" className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
          <h2 id="preview-heading" className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold mb-6">{t('exercises.create.steps.step7_title')}</h2>
          
          {/* Sección 1: Información Básica */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">1</div>
              {t('exercises.create.form.basic_info')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.form.name')}</p>
                <p className="text-gray-900 dark:text-white text-lg font-bold">{name || '(No definido)'}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.form.equipment')}</p>
                <p className="text-gray-900 dark:text-white text-lg font-bold">{t(`enums.equipment.${equipment}`)}</p>
              </div>
              {parentExerciseId && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.preview.variant_of')}</p>
                  <p className="text-gray-900 dark:text-white text-base">{availableExercises.find(e => e.id === parentExerciseId)?.name || parentExerciseId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sección 2: Clasificación */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">2</div>
              {t('exercises.create.form.classification')}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.preview.muscle_groups')} ({muscleTarget.length})</p>
                <div className="flex flex-wrap gap-2">
                  {muscleTarget.length > 0 ? (
                    muscleTarget.map(m => (
                      <span key={m} className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                        {t(`enums.muscle.${m}`)}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-900 dark:text-white italic">{t('exercises.create.form.no_specified')}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.preview.exercise_types')} ({exerciseType.length})</p>
                <div className="flex flex-wrap gap-2">
                  {exerciseType.length > 0 ? (
                    exerciseType.map(et => (
                      <span key={et} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {t(`enums.exerciseType.${et}`)}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-900 dark:text-white italic">{t('exercises.create.form.no_specified')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Descripción */}
          {description && (
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">3</div>
                {t('exercises.create.form.description')}
              </h3>
              <p className="text-gray-900 dark:text-white text-base leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10">{description}</p>
            </div>
          )}

          {/* Sección 4: Contenido Multimedia */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">4</div>
              {t('exercises.create.steps.step4_title').replace(/Paso 4: |Step 4: /, '')}
            </h3>
            <div className="space-y-4">
              {video && (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">{t('exercises.create.form.video_url_title')}</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm break-all hover:underline cursor-pointer">{video}</p>
                </div>
              )}
              {previewMedia.length > 0 && (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-3">{t('exercises.create.form.media_files_title')} ({previewMedia.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previewMedia.map((file) => (
                      <div key={file.key} className="bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img src={file.url} alt={file.name} className="w-full aspect-video object-cover" />
                        ) : (
                          <video src={file.url} controls className="w-full aspect-video bg-black" />
                        )}
                        <div className="p-3">
                          <p className="text-gray-900 dark:text-white text-xs font-medium truncate">{file.name}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!video && previewMedia.length === 0 && (
                <p className="text-gray-600 dark:text-gray-300 italic text-sm">{t('exercises.create.form.multimedia_empty')}</p>
              )}
            </div>
          </div>

          {/* Sección 5: Beneficios */}
          {(benefitTitle || benefitDescription || benefitCategories.length > 0) && (
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">5</div>
                {t('exercises.create.steps.step5_title').replace(/Paso 5: |Step 5: /, '')}
              </h3>
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                {benefitTitle && <p className="text-gray-900 dark:text-white font-bold mb-1">{benefitTitle}</p>}
                {benefitDescription && <p className="text-gray-800 dark:text-white/90 text-sm leading-relaxed mb-3">{benefitDescription}</p>}
                {benefitCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {benefitCategories.map((cat) => (
                      <span key={cat} className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                        {t(`exercises.create.categories.${cat}`)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sección 6: Visibilidad */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">6</div>
              {t('exercises.create.steps.step6_title').replace(/Paso 6: |Step 6: /, '')}
            </h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              {isPublic ? (
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-primary" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold">{t('exercises.create.visibility.public')}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('exercises.create.visibility.public_desc')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <EyeOff size={20} className="text-gray-400" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold">{t('exercises.create.visibility.private')}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('exercises.create.visibility.private_desc')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <button 
              onClick={handleCancel} 
              className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <ArrowLeft size={18} className="mr-2" /> {t('exercises.create.actions.back')}
            </button>
            <button 
              onClick={handlePublish} 
              className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2"
            >
              <Check size={18} className="mr-2" /> {isPublic ? t('exercises.create.actions.publish') : t('common.actions.save')}
            </button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 11: Visibility Screen
  if (step === 6) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button 
            onClick={goPrev}
            className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label={t('exercises.create.actions.back')}
          >
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step6_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step6_desc')}</p>
          </div>
        </header>
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border-2 border-gray-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 cursor-pointer transition">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="mt-1"
              />
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={20} className="text-primary" />
                    <p className="text-gray-900 dark:text-white font-bold">{t('exercises.create.visibility.public')}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('exercises.create.visibility.public_desc')}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border-2 border-gray-200 dark:border-white/10 hover:border-primary/50 cursor-pointer transition">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="mt-1"
              />
              <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <EyeOff size={20} className="text-gray-400" />
                    <p className="text-gray-900 dark:text-white font-bold">{t('exercises.create.visibility.private')}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('exercises.create.visibility.private_desc')}</p>
              </div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button 
              onClick={goPrev} 
              className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <ArrowLeft size={18} className="mr-2" /> {t('exercises.create.actions.back')}
            </button>
            <button 
              onClick={goNext} 
              className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2"
            >
              {t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 10: Benefits Editor
  if (step === 5) {
    const availableCategories = ['cardio', 'general_health', 'strength', 'endurance', 'flexibility', 'weight_loss', 'mass_gain'];
    const toggleCategory = (cat: string) => {
      if (benefitCategories.includes(cat)) {
        setBenefitCategories(benefitCategories.filter(c => c !== cat));
      } else {
        setBenefitCategories([...benefitCategories, cat]);
      }
    };
    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button onClick={goPrev} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label={t('exercises.create.actions.back')}>
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step5_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step5_desc')}</p>
          </div>
        </header>
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-card-md">
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.benefit_title')}</label>
              <input value={benefitTitle} onChange={(e) => setBenefitTitle(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Ej: Mejora Cardiovascular" />
            </div>
            <div>
              <label className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.benefit_desc')}</label>
              <textarea value={benefitDescription} onChange={(e) => setBenefitDescription(e.target.value)} className="w-full min-h-[120px] p-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Describe cómo beneficia al usuario" />
            </div>
            <div>
              <label className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.categories')}</label>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{t('exercises.create.form.categories_label')}</p>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                      benefitCategories.includes(cat)
                        ? 'bg-primary text-background-dark border-2 border-primary'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/10 hover:border-primary/50'
                    }`}
                  >
                    {t(`exercises.create.categories.${cat}`)}
                  </button>
                ))}
              </div>
              {benefitCategories.length > 0 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium text-sm mb-2">{t('exercises.create.form.categories_selected')} ({benefitCategories.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {benefitCategories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                        {t(`exercises.create.categories.${cat}`)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button onClick={goPrev} className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10"><ArrowLeft size={18} className="mr-2" /> {t('exercises.create.actions.back')}</button>
            <button onClick={goNext} className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90">{t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" /></button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 9: Instructions Editor
  // [ELIMINADO - Step 3 Multimedia duplicado]
  if (step === 999) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="flex items-center gap-4">
          <button 
            onClick={goPrev}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label="Volver a información básica"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight">Paso 3: Contenido Multimedia</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">Agrega imágenes o videos demostrativos del ejercicio.</p>
          </div>
        </header>

        <section aria-labelledby="multimedia-heading" className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <h2 id="multimedia-heading" className="sr-only">Subir archivos multimedia</h2>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-8 sm:p-12 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-primary/15 p-4 rounded-full text-white" aria-hidden>
                <Upload size={32} />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold">Arrastra y suelta tus archivos aquí</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Soporta JPG, PNG, MP4. Max 50MB por archivo.</p>
              </div>
              <button 
                type="button"
                onClick={handleSelectMedia}
                className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2"
              >
                Seleccionar Archivos
              </button>
            </div>
          </div>

          {storedMedia.length > 0 && (
            <div className="mt-8">
              <h3 className="text-gray-900 dark:text-white text-base md:text-lg font-bold mb-4">Multimedia existente ({storedMedia.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storedMedia.map((file) => (
                  <div key={file.id} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <div className="aspect-video bg-black relative">
                      {file.type?.startsWith('image/') ? (
                        <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <video src={file.data} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="overflow-hidden flex-1">
                        <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">{((file.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStoredMedia(file.id)}
                        className="p-2 hover:bg-red-900/30 rounded text-red-400 focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2 shrink-0 ml-2"
                        aria-label={`Eliminar ${file.name}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mediaFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-gray-900 dark:text-white text-base md:text-lg font-bold mb-4">{mediaFiles.length} archivo(s) seleccionado(s)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <div className="aspect-video bg-black relative">
                      {file.type.startsWith('image/') ? (
                        <img src={mediaPreviewUrls[index]} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <video src={mediaPreviewUrls[index]} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="overflow-hidden flex-1">
                        <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="p-2 hover:bg-red-900/30 rounded text-red-400 focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2 shrink-0 ml-2"
                        aria-label={`Eliminar ${file.name}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button 
              onClick={goPrev} 
              className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <ArrowLeft size={18} className="mr-2" /> Anterior
            </button>
            <div className="flex gap-3">
              <button 
                onClick={goNext} 
                className="flex items-center justify-center h-12 px-6 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                Omitir
              </button>
              <button 
                onClick={goNext} 
                className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2"
              >
                Continuar <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 2: Muscles Screen
  if (step === 2) {
    const toggleMuscle = (muscle: MuscleTarget) => {
      setMuscleTarget(prev => 
        prev.includes(muscle) 
          ? prev.filter(m => m !== muscle)
          : [...prev, muscle]
      );
    };

    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button onClick={goPrev} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label="Volver">
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step2_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step2_desc')}</p>
          </div>
        </header>
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.keys(MuscleTargetLabels).map((key) => {
              const isSelected = muscleTarget.includes(key as MuscleTarget);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleMuscle(key as MuscleTarget)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:border-primary/50'
                  }`}
                >
                  {t(`enums.muscle.${key}`)}
                </button>
              );
            })}
          </div>
          
          {muscleTarget.length === 0 && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-600 dark:text-red-400 font-semibold">{t('exercises.create.form.muscles_required')}</p>
            </div>
          )}

          {muscleTarget.length > 0 && (
            <div className="mt-6 p-4 bg-primary/10 rounded-xl">
              <p className="text-gray-900 dark:text-white font-medium mb-2">{t('exercises.create.form.muscles_selected')} ({muscleTarget.length}):</p>
              <div className="flex flex-wrap gap-2">
                {muscleTarget.map(m => (
                  <span key={m} className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                    {t(`enums.muscle.${m}`)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button onClick={goPrev} className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10"><ArrowLeft size={18} className="mr-2" /> Anterior</button>
            <button 
              onClick={() => {
                if (muscleTarget.length === 0) {
                  Swal.fire({
                    icon: 'warning',
                    title: t('exercises.create.alerts.muscle_required_title'),
                    text: t('exercises.create.alerts.muscle_required_msg'),
                    confirmButtonText: t('common.actions.understood'),
                  });
                  return;
                }
                goNext();
              }} 
              className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={muscleTarget.length === 0}
            >
              {t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 3: Exercise Types
  if (step === 3) {
    const toggleExerciseType = (type: ExerciseType) => {
      setExerciseType(prev => {
        const current = prev || [];
        return current.includes(type) 
          ? current.filter(t => t !== type)
          : [...current, type];
      });
    };

    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button onClick={goPrev} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label={t('exercises.create.actions.back')}>
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step3_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step3_desc')}</p>
          </div>
        </header>
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.keys(ExerciseTypeLabels).map((key) => {
              const typeKey = key as ExerciseType;
              // Safe check for includes
              const isSelected = Array.isArray(exerciseType) && exerciseType.includes(typeKey);
              // Ensure we translate a string
              const label = t(`enums.exerciseType.${typeKey}`);
              // Fallback if translation fails or returns object
              const displayLabel = typeof label === 'string' ? label : ExerciseTypeLabels[typeKey];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleExerciseType(typeKey)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:border-primary/50'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
          
          {exerciseType.length === 0 && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-600 dark:text-red-400 font-semibold">{t('exercises.create.form.types_required')}</p>
            </div>
          )}

          {exerciseType.length > 0 && (
            <div className="mt-6 p-4 bg-primary/10 rounded-xl">
              <p className="text-gray-900 dark:text-white font-medium mb-2">{t('exercises.create.form.types_selected')} ({exerciseType.length}):</p>
              <div className="flex flex-wrap gap-2">
                {exerciseType.map(type => (
                  <span key={type} className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                    {t(`enums.exerciseType.${type}`)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button onClick={goPrev} className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10"><ArrowLeft size={18} className="mr-2" /> {t('exercises.create.actions.back')}</button>
            <button 
              onClick={() => {
                if (exerciseType.length === 0) {
                  Swal.fire({
                    icon: 'warning',
                    title: t('exercises.create.alerts.type_required_title'),
                    text: t('exercises.create.alerts.type_required_msg'),
                    confirmButtonText: t('common.actions.understood'),
                  });
                  return;
                }
                goNext();
              }} 
              className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={exerciseType.length === 0}
            >
              {t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // Step 4: Description
  // Step 4: Video/Multimedia (Contenido Multimedia)
  if (step === 4) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
        <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
          <button onClick={goPrev} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label={t('exercises.create.actions.back')}>
            <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
            <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step4_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{t('exercises.create.steps.step4_desc')}</p>
          </div>
        </header>
        <section className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <div className="space-y-8">
            {/* Opción 1: Video URL */}
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">1</div>
                {t('exercises.create.form.video_url_title')}
              </h3>
              <div>
                <label htmlFor="video-url" className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.video_url_label')}</label>
                <input 
                  id="video-url"
                  type="url"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={t('exercises.create.form.video_url_placeholder')}
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t('exercises.create.form.video_url_help')}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-8">
              {/* Opción 2: Archivos Multimedia */}
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">2</div>
                {t('exercises.create.form.media_files_title')}
              </h3>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleSelectMedia}
                className="w-full border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition p-8 md:p-12"
              >
                <Upload size={48} className="text-gray-400" />
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white font-bold">{t('exercises.create.form.drag_drop_text')}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('exercises.create.form.file_types')}</p>
                </div>
              </div>

              {previewMedia.length > 0 && (
                <div className="mt-8">
                  <p className="text-gray-900 dark:text-white font-medium mb-4">{t('exercises.create.form.preview_media_uploaded')} ({previewMedia.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewMedia.map((file) => (
                      <div key={file.key} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        {file.type.startsWith('image/') ? (
                          <img src={file.url} alt={file.name} className="w-full aspect-video object-cover" />
                        ) : (
                          <video src={file.url} className="w-full aspect-video bg-black" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (file.isStored) {
                              handleRemoveStoredMedia(file.key);
                            } else {
                              const idx = mediaFiles.findIndex(f => f.name === file.name);
                              if (idx >= 0) handleRemoveMedia(idx);
                            }
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <button onClick={goPrev} className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10"><ArrowLeft size={18} className="mr-2" /> {t('exercises.create.actions.back')}</button>
            <button onClick={goNext} className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90">{t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" /></button>
          </div>
        </section>
      </div>
      </Layout>
    );
  }

  // [ELIMINADO - Step 8 (Multimedia combinado con Step 5)]
  if (step === 999) {
    return null;
  }

  // Step 1: Basic Info Form Screen
  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8">
      <header className="flex items-center gap-3 sm:gap-4 pt-12 sm:pt-0">
        <button onClick={() => navigate('/exercises')} className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2" aria-label={t('exercises.create.actions.back')}>
          <ArrowLeft size={20} className="sm:size-6 text-gray-900 dark:text-white" />
        </button>
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <h1 className="text-gray-900 dark:text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight break-words">{t('exercises.create.steps.step1_title', { title: isEditing ? t('exercises.create.steps.step1_header_edit') : t('exercises.create.steps.step1_header_create') }).replace(/Paso 1: |Step 1: /, '')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">{isEditing ? t('exercises.create.steps.step1_desc_edit') : t('exercises.create.steps.step1_desc_create')}</p>
        </div>
      </header>

      <section aria-labelledby="exercise-form-heading">
        <h2 id="exercise-form-heading" className="sr-only">Formulario de nuevo ejercicio</h2>
        <div className="bg-white dark:bg-background-dark rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <form className="flex flex-col gap-6 md:gap-8" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="exercise-name" className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.name')}</label>
              <input 
                id="exercise-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t('exercises.create.form.name_placeholder')}
              />
            </div>
             <div className="col-span-2 md:col-span-1">
               <label htmlFor="exercise-equipment" className="text-gray-900 dark:text-white font-medium mb-2 block">{t('exercises.create.form.equipment')}</label>
               <select 
                 id="exercise-equipment"
                 value={equipment}
                 onChange={(e) => setEquipment(e.target.value as Equipment)}
                 className="w-full h-12 px-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
               >
                 {Object.keys(EquipmentLabels).map((key) => (
                   <option key={key} value={key}>{t(`enums.equipment.${key}`)}</option>
                 ))}
               </select>
             </div>
          </div>

          <div className="col-span-2">
            <label htmlFor="parent-exercise" className="text-gray-900 dark:text-white font-medium mb-2 block">
              {t('exercises.create.form.is_variant')}
            </label>
            <select 
              id="parent-exercise"
              value={parentExerciseId}
              onChange={(e) => setParentExerciseId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">{t('exercises.create.form.no_variant')}</option>
              {availableExercises.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({t(`enums.equipment.${ex.equipment}`)})
                </option>
              ))}
            </select>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {t('exercises.create.form.variant_help')}
            </p>
          </div>

          {/* Selección de músculos se mueve a Paso 2 */}

          <div className="col-span-2">
             <div className="flex justify-between items-center mb-2">
                <label className="text-gray-900 dark:text-white font-medium">{t('exercises.create.form.description')}</label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${description.length > 400 ? 'text-red-500' : 'text-gray-500'}`}>
                    {description.length}/500
                  </span>
                  <button 
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    aria-live="polite"
                    className="flex items-center gap-1 text-xs font-bold text-background-dark bg-primary px-3 py-1 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-all focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2"
                  >
                    <Sparkles size={14} />
                    {isGenerating ? t('exercises.create.actions.generating') : t('exercises.create.actions.generate_ai')}
                  </button>
                </div>
             </div>
             <textarea 
               id="exercise-description"
               value={description}
               onChange={handleDescriptionChange}
               maxLength={500}
               className="w-full min-h-[150px] p-4 rounded-xl bg-white dark:bg-background-dark border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 resize-y"
               placeholder={t('exercises.create.form.description_placeholder')}
             />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
            <button onClick={handleCancel} type="button" className="flex items-center justify-center h-12 px-6 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition focus-visible:outline-[3px] focus-visible:outline-primary focus-visible:outline-offset-2">
              <X size={18} className="mr-2" /> {t('exercises.create.actions.cancel')}
            </button>
            <button onClick={handleSave} type="button" className="flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition focus-visible:outline-[3px] focus-visible:outline-white/30 focus-visible:outline-offset-2">
              {t('exercises.create.actions.continue')} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
          </form>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default CreateExercise;
