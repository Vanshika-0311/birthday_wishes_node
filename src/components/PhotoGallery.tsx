import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Plus,
  Maximize2,
  X,
  Download,
  Upload,
  Trash2,
  FolderOpen,
  Image as ImageIcon,
  RotateCcw,
  Check,
} from 'lucide-react';
import { PhotoMemory } from '../types';
import { PhotoCropModal } from './PhotoCropModal';
import { soundFx } from '../utils/audio';
import { burstHeartsAt, burstConfettiAt } from '../utils/confetti';
import {
  getAllPhotosFromDB,
  savePhotoToDB,
  saveMultiplePhotosToDB,
  deletePhotoFromDB,
  clearPhotosInDB,
} from '../utils/photoStorage';

// Default initial collection representing the uploaded Instagram memories
import redSareeImg from '../assets/images/kuchipu_red_saree_1790489451319.jpg';
import retro80sImg from '../assets/images/kuchipu_retro_80s_1790489463349.jpg';
import silentEyesImg from '../assets/images/kuchipu_silent_eyes_1790489477208.jpg';
import mehndiLehengaImg from '../assets/images/kuchipu_mehndi_lehenga_1790489492064.jpg';

const DEFAULT_PHOTOS: PhotoMemory[] = [
  {
    id: 'kuchipu_1',
    url: redSareeImg,
    title: 'Grace in Crimson & Jasmine',
    caption: '“Me... Just Like 🕊️✨❤️” Radiant in a deep red saree with fragrant white jasmine flowers nestled in her hair.',
    instagramTag: '#me #sareelove #redsky #beautiful',
    dateStr: 'September 13',
    likes: 124,
    category: 'portrait',
  },
  {
    id: 'kuchipu_2',
    url: retro80sImg,
    title: 'Romanticising My Little Life',
    caption: '“1980s trend... 🎧🌸” Retro vintage charm with a red headband, classic car, and blooming bougainvillea.',
    instagramTag: '#oldvibe #aesthetic #lovevibes #vintageclothing',
    dateStr: 'September 12',
    likes: 98,
    category: 'aesthetic',
  },
  {
    id: 'kuchipu_3',
    url: silentEyesImg,
    title: 'Silent Eyes, Loud Feelings',
    caption: '“Eyes say everything... 🌹✨💖” A collage capturing the soulful depth and expressive glances of Kuchipu.',
    instagramTag: '#eyes #love #post #instagood',
    dateStr: 'December 25',
    likes: 156,
    category: 'memories',
  },
  {
    id: 'kuchipu_4',
    url: mehndiLehengaImg,
    title: 'Henna Palms & Festive Smiles',
    caption: '“Khali khali dil ko.. 💙” A joyful moment holding up intricate henna designs, surrounded by festive warmth.',
    instagramTag: '#love #like #dil #celebration',
    dateStr: 'December 9',
    likes: 142,
    category: 'festive',
  },
];

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoMemory[]>(DEFAULT_PHOTOS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [fileForModal, setFileForModal] = useState<File | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, boolean>>({});
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const multiFileInputRef = useRef<HTMLInputElement | null>(null);
  const singleCropFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load photos from IndexedDB on initial mount
  useEffect(() => {
    async function loadStoredPhotos() {
      const stored = await getAllPhotosFromDB();
      if (stored && stored.length > 0) {
        setPhotos(stored);
      } else {
        // Initialize DB with the initial collection
        await saveMultiplePhotosToDB(DEFAULT_PHOTOS);
        setPhotos(DEFAULT_PHOTOS);
      }
    }
    loadStoredPhotos();
  }, []);

  const handleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (rect.left + rect.width / 2) / window.innerWidth;
    const yNorm = (rect.top + rect.height / 2) / window.innerHeight;

    burstHeartsAt(xNorm, yNorm);
    soundFx.playChime();

    const isCurrentlyLiked = likedPhotoIds[photoId];
    setLikedPhotoIds((prev) => ({
      ...prev,
      [photoId]: !isCurrentlyLiked,
    }));

    setPhotos((prev) => {
      const updated = prev.map((p) => {
        if (p.id === photoId) {
          const newLikes = isCurrentlyLiked ? p.likes - 1 : p.likes + 1;
          const photoUpdated = { ...p, likes: newLikes };
          savePhotoToDB(photoUpdated);
          return photoUpdated;
        }
        return p;
      });
      return updated;
    });
  };

  const handleAddCustomPhoto = async (newPhoto: PhotoMemory) => {
    await savePhotoToDB(newPhoto);
    setPhotos((prev) => [newPhoto, ...prev]);
    soundFx.playChime();
    burstConfettiAt(0.5, 0.4);
    showToast(`Added "${newPhoto.title}" to gallery! 🎉`);
  };

  // Process batch of files directly from local device
  const processFiles = async (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (validImageFiles.length === 0) {
      showToast('Please select valid image files.');
      return;
    }

    if (validImageFiles.length === 1) {
      // If single file, open the interactive cropper so user can adjust/crop it easily!
      setFileForModal(validImageFiles[0]);
      setIsCropModalOpen(true);
      return;
    }

    // Multiple files: import them seamlessly
    setIsUploadingBatch(true);
    const newPhotos: PhotoMemory[] = [];

    for (let i = 0; i < validImageFiles.length; i++) {
      const file = validImageFiles[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ');
      const formattedTitle =
        cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      const photoItem: PhotoMemory = {
        id: `user_photo_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        url: dataUrl,
        title: formattedTitle || 'Kuchipu Memory',
        caption: 'Uploaded from device to celebrate Kuchipu’s special day!',
        dateStr: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        likes: 1,
        category: 'portrait',
      };

      newPhotos.push(photoItem);
    }

    await saveMultiplePhotosToDB(newPhotos);
    setPhotos((prev) => [...newPhotos, ...prev]);
    setIsUploadingBatch(false);
    soundFx.playChime();
    burstConfettiAt(0.5, 0.5);
    showToast(`Added ${newPhotos.length} photos to Kuchipu's gallery! 🌟`);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    await deletePhotoFromDB(photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
    showToast('Photo removed from gallery.');
  };

  const handleResetToDefault = async () => {
    if (
      window.confirm(
        'Would you like to reset the gallery to the original 4 Kuchipu showcase memories?'
      )
    ) {
      await clearPhotosInDB();
      await saveMultiplePhotosToDB(DEFAULT_PHOTOS);
      setPhotos(DEFAULT_PHOTOS);
      showToast('Reset to original memories.');
    }
  };

  const filteredPhotos =
    activeCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <section id="memories" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 tracking-wider uppercase">
            <span>Dynamic Photo Vault</span>
            <span aria-hidden="true">·</span>
            <span>Kuchipu&apos;s Memories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-display">
            A Gallery of Beautiful Smiles
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Upload pictures directly from your device, crop and frame them, and build the ultimate
            living birthday collection for Kuchipu!
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick upload multiple files */}
          <button
            onClick={() => multiFileInputRef.current?.click()}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
            title="Select images from your phone or computer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload From Device</span>
          </button>

          {/* Interactive Crop Modal trigger */}
          <button
            onClick={() => {
              setFileForModal(null);
              setIsCropModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-2 whitespace-nowrap"
            title="Upload with precision cropping tool"
          >
            <Plus className="w-4 h-4" />
            <span>Crop & Add Photo</span>
          </button>

          {/* Reset button if altered */}
          {photos.length !== DEFAULT_PHOTOS.length && (
            <button
              onClick={handleResetToDefault}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Reset to default photos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Hidden inputs */}
          <input
            ref={multiFileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFiles(e.target.files);
              }
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => multiFileInputRef.current?.click()}
        className={`mb-8 border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDraggingOver
            ? 'border-rose-500 bg-rose-100/70 scale-[1.01]'
            : 'border-rose-200/90 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Upload className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800">
              Drag & Drop your photos here, or click to browse from device
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports multiple photos simultaneously (PNG, JPG, WEBP). Photos are stored securely in your browser!
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-white px-3 py-1 rounded-full border border-rose-100 shadow-2xs mt-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Currently {photos.length} photos in gallery</span>
          </div>
        </div>
      </div>

      {/* Interactive Category Segmented Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-rose-100/60 rounded-xl max-w-fit mb-8 overflow-x-auto">
        {[
          { id: 'all', label: `All Memories (${photos.length})` },
          {
            id: 'portrait',
            label: `Portraits (${photos.filter((p) => p.category === 'portrait').length})`,
          },
          {
            id: 'aesthetic',
            label: `Aesthetic (${photos.filter((p) => p.category === 'aesthetic').length})`,
          },
          {
            id: 'memories',
            label: `Expressive (${photos.filter((p) => p.category === 'memories').length})`,
          },
          {
            id: 'festive',
            label: `Festive (${photos.filter((p) => p.category === 'festive').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-white text-rose-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-rose-100">
          <ImageIcon className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No photos in this category yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
            Upload new photos from your phone or laptop to fill this space with memories of Kuchipu!
          </p>
          <button
            onClick={() => multiFileInputRef.current?.click()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Upload Pictures
          </button>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => {
          const isLiked = likedPhotoIds[photo.id];
          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-rose-100/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
            >
              {/* Photo Frame Container */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                  loading="lazy"
                />

                {/* Subtle Hover Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(e, photo.id)}
                      className="p-1.5 bg-black/50 hover:bg-rose-600 rounded-full text-white/90 hover:text-white transition-colors"
                      title="Remove this photo from gallery"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-rose-200 font-medium">{photo.dateStr}</p>
                    <p className="text-sm font-semibold line-clamp-2">{photo.title}</p>
                  </div>
                </div>

                {/* Corner Heart Counter */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, photo.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${
                    isLiked
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-600'
                  }`}
                  title="Like this photo"
                >
                  <Heart
                    className={`w-4 h-4 transition-transform active:scale-125 ${
                      isLiked ? 'fill-current text-white' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Photo Content Card */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm group-hover:text-rose-600 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>{photo.dateStr}</span>
                  <div className="flex items-center gap-1 text-rose-600 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="tabular-nums">{photo.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
          >
            {/* Image display side */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative p-3">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[55vh] md:max-h-[82vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Info side */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-white overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">
                    {selectedPhoto.dateStr} · Kuchipu Memory
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-display mt-3">
                  {selectedPhoto.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedPhoto.caption}
                </p>

                {selectedPhoto.instagramTag && (
                  <p className="text-xs text-rose-500 font-mono mt-3">
                    {selectedPhoto.instagramTag}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Community Appreciations</span>
                  <span className="font-bold text-rose-600 text-sm">
                    {selectedPhoto.likes} Likes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLike(e, selectedPhoto.id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{likedPhotoIds[selectedPhoto.id] ? 'Liked ❤️' : 'Send Love'}</span>
                  </button>

                  <a
                    href={selectedPhoto.url}
                    download={`kuchipu_${selectedPhoto.title.toLowerCase().replace(/\s+/g, '_')}.jpg`}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="Download high-resolution image"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={(e) => handleDeletePhoto(e, selectedPhoto.id)}
                    className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop / Upload Modal */}
      <PhotoCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          setFileForModal(null);
        }}
        onSavePhoto={handleAddCustomPhoto}
        initialFile={fileForModal}
      />
    </section>
  );
};
