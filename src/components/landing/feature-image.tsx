"use client";
 
/**
 * Exported illustration from Figma. Covers the coded illustration when the
 * file exists; hides itself (revealing the coded one) when it doesn't.
 */
export function FeatureImage({ src }: { src: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full object-cover object-left-top"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </>
  );
}