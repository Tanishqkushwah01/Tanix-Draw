

const drawCircle = (ctx, shape) => {
    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;

    const radiusX = Math.abs(shape.width / 2);
    const radiusY = Math.abs(shape.height / 2);

    ctx.beginPath();

    ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();
};

export default drawCircle;