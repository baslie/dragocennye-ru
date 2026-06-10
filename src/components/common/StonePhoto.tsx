import { useState } from "react";

interface StonePhotoProps {
  src: string;
  alt: string;
  /** hex цвета камня — определяет «самоцветный» градиент-плейсхолдер. */
  accentHex?: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Фото камня с graceful-фолбэком: реальное изображение ложится поверх
 * jewel-градиента; при 404 (а в демо все фото — плейсхолдеры) остаётся градиент.
 */
export function StonePhoto({
  src,
  alt,
  accentHex = "#576A8F",
  className = "",
  imgClassName = "",
}: StonePhotoProps) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 30% 20%, ${accentHex}40 0%, ${accentHex}18 38%, #ffffff00 70%), linear-gradient(135deg, ${accentHex}26, ${accentHex}10)`,
      }}
    >
      {!broken && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {broken && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="h-8 w-8 rotate-45 rounded-sm"
            style={{ backgroundColor: `${accentHex}66`, boxShadow: `0 0 0 6px ${accentHex}22` }}
          />
        </span>
      )}
    </div>
  );
}
