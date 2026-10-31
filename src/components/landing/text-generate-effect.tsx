import type { CSSProperties } from "react";

/** Character cadence with word-safe wrapping and no layout shifts. */
export function TextGenerateEffect({ words, startDelay = 180 }: { words: string; startDelay?: number }) {
  let character = 0;
  return (
    <span aria-hidden="true">
      {words.split(" ").map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 && " "}
          <span className="landing-type-word">
            {Array.from(word).map((letter) => {
              const position = character++;
              return (
                <span
                  key={position}
                  className="landing-type-character"
                  style={{ "--type-delay": `${startDelay + position * 36}ms` } as CSSProperties}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
}
