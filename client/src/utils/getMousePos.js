const getMousePos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

export default getMousePos;

