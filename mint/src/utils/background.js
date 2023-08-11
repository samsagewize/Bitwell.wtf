export function instantiateBackground(canvasRef, canvasDim) {
  const context = canvasRef.current.getContext('2d');
  context.fillStyle = "orange";
  context.fillRect(0, 0, canvasDim, canvasDim);
  context.fillStyle = "#a2ddf8";
  context.save();
  context.rotate(-0.785);

  for (var f = 0; f < 20; f++) {
    for (var s = 0; s < 20; s++) {
      context.fillRect(f * 40, s * 40, 20, 20);
    }
  }
  context.restore();
}
