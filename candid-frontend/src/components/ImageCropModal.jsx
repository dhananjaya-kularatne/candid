import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const createCroppedImage = (imageSrc, pixelCrop) =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y,
        pixelCrop.width, pixelCrop.height,
        0, 0,
        pixelCrop.width, pixelCrop.height
      );
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    };
  });

const ImageCropModal = ({ imageSrc, aspect, cropShape = 'rect', title, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    const blob = await createCroppedImage(imageSrc, croppedAreaPixels);
    onComplete(blob);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        width: 460, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{title || 'Adjust photo'}</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af', lineHeight: 1 }}>✕</button>
        </div>

        {/* Crop area */}
        <div style={{ position: 'relative', width: '100%', height: 300, background: '#111' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div style={{ padding: '14px 24px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0 }}>Zoom</span>
          <input
            type="range"
            min={1} max={3} step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#7F77DD' }}
          />
        </div>

        {/* Actions */}
        <div style={{ padding: '12px 20px 18px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px', borderRadius: 8,
              background: '#f3f4f6', border: 'none',
              fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: '8px 18px', borderRadius: 8,
              background: '#7F77DD', border: 'none',
              fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
