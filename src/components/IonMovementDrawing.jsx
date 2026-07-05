import React, { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const BACKGROUND_SRC = `${import.meta.env.BASE_URL}png/ion-move-clips.png`;

const COLORS = [
  { label: '파랑', value: '#2563eb' },
  { label: '보라', value: '#9333ea' },
  { label: '빨강', value: '#ef4444' },
  { label: '검정', value: '#111827' }
];

export { BACKGROUND_SRC as ION_DRAWING_BACKGROUND_SRC };

export default function IonMovementDrawing({ value, onChange }) {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [lineWidth, setLineWidth] = useState(10);
  const [tool, setTool] = useState('pen');

  const drawBackground = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (bgRef.current) {
      ctx.drawImage(bgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL('image/png'));
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    drawBackground(ctx);
    exportImage();
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      bgRef.current = img;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      if (value) {
        const saved = new Image();
        saved.onload = () => ctx.drawImage(saved, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        saved.src = value;
      } else {
        drawBackground(ctx);
        exportImage();
      }
    };
    img.src = BACKGROUND_SRC;
  }, []);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const point = getPoint(event);
    const lastPoint = lastPointRef.current || point;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = point;
  };

  const stopDrawing = (event) => {
    if (!drawingRef.current) return;
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
    drawingRef.current = false;
    lastPointRef.current = null;
    exportImage();
  };

  return (
    <div className="drawing-tool">
      <div className="drawing-toolbar">
        <div className="drawing-color-group" aria-label="펜 색상">
          {COLORS.map(item => (
            <button
              key={item.value}
              type="button"
              className={`drawing-swatch ${color === item.value && tool === 'pen' ? 'active' : ''}`}
              style={{ backgroundColor: item.value }}
              title={`${item.label} 펜`}
              onClick={() => {
                setTool('pen');
                setColor(item.value);
              }}
            />
          ))}
        </div>

        <button
          type="button"
          className={`drawing-tool-btn ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => setTool('eraser')}
        >
          지우개
        </button>

        <label className="drawing-size-control">
          <span>굵기</span>
          <input
            type="range"
            min="4"
            max="24"
            value={lineWidth}
            onChange={(event) => setLineWidth(Number(event.target.value))}
          />
        </label>

        <button type="button" className="drawing-tool-btn" onClick={resetCanvas}>
          초기화
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="ion-drawing-canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
      />
    </div>
  );
}
