let measureCtx = null;

const measureTextWidth = (text, fontSize) => {
  const safeText = typeof text === "string" ? text : "";

  if (!measureCtx) {
    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
  }

  if (!measureCtx) return safeText.length * fontSize * 0.6;

  measureCtx.font = `${fontSize}px Arial`;
  return measureCtx.measureText(safeText).width;
};

export default measureTextWidth;