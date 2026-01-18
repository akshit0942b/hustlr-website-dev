import React from "react";

function MixedHeadline({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) =>
        char === "#" ||
        char === "%" ||
        char === "'" ||
        char === "-" ||
        char === "(" ||
        char === ")" ||
        char == "4" ||
        char === "&" ? (
          <span
            key={i}
            className="font-ovo"
            style={{ fontFamily: "'Ovo', serif" }}
          >
            {char}
          </span>
        ) : (
          <span key={i}>{char}</span>
        )
      )}
    </>
  );
}

export default MixedHeadline;
