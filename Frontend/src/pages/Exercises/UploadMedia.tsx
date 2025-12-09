import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

const UploadMedia: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSelectFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/png,video/mp4';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setSelectedFiles(files);
      alert(`${files.length} archivo(s) seleccionado(s)`);
    };
    input.click();
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('No hay archivos seleccionados para subir.');
      return;
    }
    alert(`Subiendo ${selectedFiles.length} archivo(s)...\nFunción en desarrollo.`);
    // TODO: Implement actual upload logic
  };

  const handleCancel = () => {
    if (selectedFiles.length > 0) {
      if (confirm('¿Descartar los archivos seleccionados?')) {
        setSelectedFiles([]);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">Subir Multimedia</h1>
        <p className="text-[#a9d8b9] text-sm sm:text-base leading-relaxed">Sube imágenes o videos demostrativos.</p>
      </header>

      <section aria-labelledby="upload-section-heading">
        <h2 id="upload-section-heading" className="sr-only">Área de carga de archivos</h2>
        <div className="bg-[#112217] rounded-xl p-4 sm:p-6 md:p-8 border border-[#326744]">
         <div className="border-2 border-dashed border-[#326744] rounded-xl p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center gap-3 md:gap-4 text-center cursor-pointer hover:bg-[#23482f]/30 transition-colors">
            <div className="bg-[#23482f] p-4 rounded-full text-white" aria-hidden>
              <Upload size={32} />
            </div>
            <div>
                <p className="text-white text-base sm:text-lg font-bold">Arrastra y suelta tus archivos aquí</p>
                <p className="text-[#a9d8b9] text-xs sm:text-sm mt-1 leading-relaxed">Soporta JPG, PNG, MP4. Max 50MB.</p>
            </div>
            <button onClick={handleSelectFiles} className="px-6 py-2 bg-[#13ec5b] text-[#112217] font-bold rounded-lg text-sm focus-visible:outline-[3px] focus-visible:outline-[#23482f] focus-visible:outline-offset-2" aria-label="Seleccionar archivos para subir">Seleccionar Archivos</button>
         </div>
         
         <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
            <h3 className="text-white text-base md:text-lg font-bold">Vista Previa</h3>
            
            {/* Uploading Item */}
            <div className="bg-[#193322] p-4 rounded-lg flex items-center justify-between border border-[#326744]">
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">MP4</div>
                     <div>
                        <p className="text-white font-medium">tutorial_press_banca.mp4</p>
                        <p className="text-[#92c9a4] text-xs">25.5 MB</p>
                     </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-[#23482f] rounded-full overflow-hidden">
                        <div className="h-full bg-[#13ec5b] w-[75%]"></div>
                    </div>
                    <span className="text-white text-sm font-bold">75%</span>
                </div>
            </div>

            {/* Completed Item */}
            <div className="bg-[#193322] p-4 rounded-lg flex items-center justify-between border border-[#326744]">
                <div className="flex items-center gap-4">
                     <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_lnp-aiYLcXorhfUzXZr0jD33YhrTBpWjkzj0VWCZDFvAr2RknjJfNXIjxaYeLxkTlXF0NpvyVL_lnfr-d3vUYXiie490FAPV8rXfCgF-ixQIUjhHjPdWvo-gSCgLNLfyn0aD27WJH6iL0OFEcBn7J0SQIdtgAAhjfdK9lAXgSEwIKc4aLcNAv_VgVVphHoIRY7ZWzaMNCNHljqm98bVz-ncyFrUvfxiaM5l_SweE85m4a0IwZdtEvM2fb6j635zFH0n4-3vsw2b" className="w-12 h-12 object-cover rounded-lg" alt="Miniatura de imagen subida" />
                     <div>
                        <p className="text-white font-medium">demo_01.jpg</p>
                        <p className="text-[#92c9a4] text-xs">2.1 MB</p>
                     </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#13ec5b]/20 flex items-center justify-center text-[#13ec5b]">
                    <Check size={18} />
                </div>
            </div>
         </div>

         <div className="flex justify-end gap-3 mt-6">
            <button onClick={handleCancel} className="px-6 py-3 bg-transparent text-white border border-[#326744] rounded-xl font-bold hover:bg-[#23482f] focus-visible:outline-[3px] focus-visible:outline-[#13ec5b] focus-visible:outline-offset-2">Cancelar</button>
            <button onClick={handleUpload} className="px-6 py-3 bg-[#13ec5b] text-[#112217] rounded-xl font-bold focus-visible:outline-[3px] focus-visible:outline-[#23482f] focus-visible:outline-offset-2">Subir Todo</button>
         </div>
        </div>
      </section>
    </div>
  );
};

export default UploadMedia;
