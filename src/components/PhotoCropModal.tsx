import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Upload, Sparkles, Crop, Image as ImageIcon } from 'lucide-react';
import { PhotoMemory } from '../types';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (newPhoto: PhotoMemory) => void;
  targetCategory?: PhotoMemory['category'];
  initialFile?: File | null;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  targetCategory = 'portrait',
  initialFile = null,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<PhotoMemory['category']>(targetCategory);
  const [cropAspect, setCropAspect] = useState<'4/5' | '1/1' | 'original'>('4/5');
  const [aspectRatioValue, setAspectRatioValue] = useState<number>(4 / 5);

  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
        if (cropAspect === 'original') {
          setAspectRatioValue(img.width / img.height);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null);
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setTitle('');
      setCaption('');
      setCropAspect('4/5');
      setAspectRatioValue(4 / 5);
    } else {
      setCategory(targetCategory);
      if (initialFile) {
        loadFile(initialFile);
      }
    }
  }, [isOpen, targetCategory, initialFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCropAndSave = () => {
    if (!imageObjRef.current) return;

    const img = imageObjRef.current;
    let targetWidth = 1000;
    let targetHeight = 1250;

    if (cropAspect === '1/1') {
      targetWidth = 1000;
      targetHeight = 1000;
    } else if (cropAspect === 'original') {
      targetWidth = 1000;
      targetHeight = Math.round(1000 / (img.width / img.height));
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(position.x * 2, position.y * 2);

    // Draw centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const newPhoto: PhotoMemory = {
      id: `user_photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      url: croppedDataUrl,
      title: title.trim() || 'Kuchipu Special Memory',
      caption: caption.trim() || 'A radiant moment of joy and beauty.',
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: 1,
      category: category,
    };

    onSavePhoto(newPhoto);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-rose-500" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Add & Crop Photo From Your Device
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-rose-50/50 hover:bg-rose-50"
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to browse your photos from this device
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Select any picture of Kuchipu (JPG, PNG, WEBP, or HEIC). You can crop and position it perfectly.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interactive Crop Viewport */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-4/5 bg-slate-950 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800 flex items-center justify-center select-none"
            >
              <div
                className="transform transition-transform duration-75 origin-center pointer-events-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-none select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Crop guide boundary overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-white/80 rounded-lg pointer-events-none">
                <div className="absolute top-2 left-2 text-[10px] text-white bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                  Drag to reposition · Slider to zoom
                </div>
              </div>
            </div>

            {/* Crop Aspect Ratio & Rotation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setCropAspect('4/5');
                    setAspectRatioValue(4 / 5);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    cropAspect === '4/5' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  Portrait (4:5)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropAspect('1/1');
                    setAspectRatioValue(1);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    cropAspect === '1/1' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  Square (1:1)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-slate-700"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>
            </div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>

            {/* Metadata Fields */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Photo Title / Memory Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kuchipu's Gorgeous Smile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Caption / Memory Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Always lighting up the room with warmth..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Gallery Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PhotoMemory['category'])}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-rose-500 bg-white"
                >
                  <option value="portrait">Radiant Portrait</option>
                  <option value="aesthetic">Vintage & Aesthetic</option>
                  <option value="memories">Expressive Memories</option>
                  <option value="festive">Festive Celebrations</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setImageSrc(null);
                  fileInputRef.current?.click();
                }}
                className="text-xs text-rose-600 hover:text-rose-700 underline font-medium"
              >
                Choose another file
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropAndSave}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Gallery</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
