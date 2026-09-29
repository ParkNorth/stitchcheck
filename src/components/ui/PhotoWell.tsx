import Image from "next/image";

/**
 * Hatched photo well until a product shot lands. Product shots are white
 * background, 4:3. Pass `src` when an image exists under /public.
 */
export function PhotoWell({
  src,
  alt,
  caption,
  className = "",
  style,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`ph ${className}`} style={src ? { background: "#ffffff", ...style } : style} role={src ? undefined : "img"} aria-label={src ? undefined : alt}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "contain" }} />
      ) : (
        caption && <span className="cap">{caption}</span>
      )}
    </div>
  );
}
