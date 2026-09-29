
 
const drawRectangle = (ctx, shape) => {

  

  ctx.strokeRect(
    shape.x,
    shape.y,
    shape.width,
    shape.height
  );
};

export default drawRectangle;