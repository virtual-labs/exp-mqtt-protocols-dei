import { useEffect, useRef, useState } from 'react';
import { SimulationState, wavelengthToColor, calculateInterferenceIntensity } from '@/lib/physics';

interface SimulationCanvasProps {
  state: SimulationState;
  isAnimating: boolean;
  onSlitDrag: (slitNumber: 1 | 2, yPosition: number) => void;
  onScreenDrag: (xPosition: number) => void;
}

export default function SimulationCanvas({ 
  state, 
  isAnimating, 
  onSlitDrag, 
  onScreenDrag 
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    element: 'slit1' | 'slit2' | 'screen' | null;
    startY: number;
  }>({ isDragging: false, element: null, startY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw wave source
      drawWaveSource(ctx, timestamp);
      
      // Draw wavefronts
      if (isAnimating) {
        drawWavefronts(ctx, timestamp);
      }
      
      // Draw slits
      drawSlits(ctx);
      
      // Draw interference pattern
      drawInterferencePattern(ctx);
      
      // Draw detection screen
      drawDetectionScreen(ctx);
      
      // Draw measurements
      drawMeasurements(ctx);

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, isAnimating]);

  const drawWaveSource = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const sourceX = 80;
    const sourceY = 200;
    const color = wavelengthToColor(state.wavelength);
    
    // Draw coherent light source
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw source label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('Coherent', sourceX - 25, sourceY - 15);
    ctx.fillText('Light Source', sourceX - 30, sourceY - 3);
  };

  const drawWavefronts = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const sourceX = 80;
    const sourceY = 230;
    const slitX = 280;
    const screenX = (state.screenX / 100) * 800;
    const color = wavelengthToColor(state.wavelength);
    const waveSpeed = 0.03; // Slower for educational clarity
    const wavelengthPixels = 20;
    
    // Draw slow-moving plane waves approaching slits
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    
    // Plane wavefronts from source to slits
    for (let i = 0; i < 15; i++) {
      const phase = (timestamp * waveSpeed) % (wavelengthPixels * 2);
      const x = sourceX + 20 + i * wavelengthPixels + phase;
      
      if (x > sourceX + 20 && x < slitX - 10) {
        ctx.globalAlpha = 0.7 - (i * 0.03);
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 410);
        ctx.stroke();
      }
    }
    
    // Draw semi-circular wavefronts from slits extending to screen
    const slit1Y = (state.slitPositions.slit1Y / 100) * 460;
    const slit2Y = (state.slitPositions.slit2Y / 100) * 460;
    const maxRadius = Math.max(screenX - slitX + 20, 300); // Ensure waves reach the screen
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < 15; i++) { // Increased number of wavefronts
      const phase = (timestamp * waveSpeed * 0.8) % (wavelengthPixels * 2);
      const radius = i * wavelengthPixels * 0.7 + phase;
      
      if (radius > 5 && radius < maxRadius) {
        // Gradually reduce opacity for distant waves
        ctx.globalAlpha = Math.max(0.2, 0.8 - (i * 0.05));
        
        // Slit 1 semi-circular wavefronts - extended angle to reach screen
        ctx.beginPath();
        ctx.arc(slitX + 12, slit1Y, radius, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
        ctx.stroke();
        
        // Slit 2 semi-circular wavefronts - extended angle to reach screen
        ctx.beginPath();
        ctx.arc(slitX + 12, slit2Y, radius, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
        ctx.stroke();
      }
    }
    
    // Draw wave interaction with the screen
    if (screenX < 750) { // Only if screen is visible
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      
      // Draw wave pattern on screen
      const screenHeight = 460 - 70;
      const centerY = screenHeight / 2 + 35;
      const fringeSpacingPixels = state.fringeWidth / 0.1; // Convert mm to pixels
      
      for (let y = 35; y < 460 - 35; y += 5) {
        const distanceFromCenter = Math.abs(y - centerY);
        const intensity = Math.cos(Math.PI * distanceFromCenter / (fringeSpacingPixels/2)) ** 2;
        
        if (intensity > 0.3) {
          ctx.globalAlpha = intensity * 0.7;
          ctx.beginPath();
          ctx.moveTo(screenX - 5, y);
          ctx.lineTo(screenX, y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawSlits = (ctx: CanvasRenderingContext2D) => {
    const slitX = 280;
    const slitWidth = 16;
    const slitHeight = 3; // Very narrow realistic slits
    const canvasHeight = 460;
    
    // Draw thick black barrier (realistic slit plate)
    ctx.fillStyle = '#000000';
    ctx.fillRect(slitX, 35, slitWidth, canvasHeight - 70);
    
    // Add barrier shadows for 3D depth
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(slitX - 3, 35, 3, canvasHeight - 70);
    ctx.fillRect(slitX + slitWidth, 35, 3, canvasHeight - 70);
    
    // Calculate precise slit positions
    const slit1Y = (state.slitPositions.slit1Y / 100) * canvasHeight - slitHeight / 2;
    const slit2Y = (state.slitPositions.slit2Y / 100) * canvasHeight - slitHeight / 2;
    
    // Draw narrow slit openings (clear gaps)
    ctx.clearRect(slitX, slit1Y, slitWidth, slitHeight);
    ctx.clearRect(slitX, slit2Y, slitWidth, slitHeight);
    
    // Add subtle glow effect at slit openings
    const color = wavelengthToColor(state.wavelength);
    ctx.shadowColor = color;
    ctx.shadowBlur = 3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(slitX, slit1Y, slitWidth, slitHeight);
    ctx.strokeRect(slitX, slit2Y, slitWidth, slitHeight);
    ctx.shadowBlur = 0;
    
    // Draw clear slit labels
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 14px Inter';
    ctx.fillText('Slit 1', slitX - 55, slit1Y + slitHeight / 2 - 8);
    ctx.fillText('Slit 2', slitX - 55, slit2Y + slitHeight / 2 - 8);
    
    // Draw precise measurement lines
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(slitX + slitWidth + 20, slit1Y + slitHeight / 2);
    ctx.lineTo(slitX + slitWidth + 20, slit2Y + slitHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Measurement end marks
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(slitX + slitWidth + 17, slit1Y + slitHeight / 2);
    ctx.lineTo(slitX + slitWidth + 23, slit1Y + slitHeight / 2);
    ctx.moveTo(slitX + slitWidth + 17, slit2Y + slitHeight / 2);
    ctx.lineTo(slitX + slitWidth + 23, slit2Y + slitHeight / 2);
    ctx.stroke();
    
    // Precise separation measurement
    const midY = (slit1Y + slit2Y) / 2 + slitHeight / 2;
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 11px Inter';
    ctx.fillText(`d = ${state.slitSeparation.toFixed(2)} mm`, slitX + slitWidth + 30, midY);
    
    // Real-world scale reference
    const actualSeparationPixels = Math.abs(slit2Y - slit1Y);
    const mmPerPixel = state.slitSeparation / actualSeparationPixels;
    ctx.font = '9px Inter';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Scale: ${mmPerPixel.toFixed(3)} mm/px`, slitX + slitWidth + 30, midY + 15);
  };

  const drawInterferencePattern = (ctx: CanvasRenderingContext2D) => {
    // This function has been modified to remove the orange and grey dots
    // The interference pattern is still calculated but not visually displayed
    // Original code removed dots that were drawn with:
    // ctx.fillStyle = wavelengthToColor(state.wavelength); // orange dots
    // ctx.fillStyle = '#6b7280'; // grey dots
  };

  const drawDetectionScreen = (ctx: CanvasRenderingContext2D) => {
    const screenX = (state.screenX / 100) * 800; // screenX is a percentage of canvas width
    const screenWidth = 30;
    const canvasHeight = 460;
    
    // Draw white screen background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX, 35, screenWidth, canvasHeight - 70);
    
    // Create realistic interference pattern with accurate measurements
    const centerY = canvasHeight / 2;
    const mmPerPixel = 0.1; // Real-world scale: 1 pixel = 0.1mm
    const fringeSpacingPixels = state.fringeWidth / mmPerPixel;
    
    // Draw interference fringes progressively
    for (let y = 35; y < canvasHeight - 35; y++) {
      const distanceFromCenterMM = Math.abs((y - centerY) * mmPerPixel);
      const fringeNumber = distanceFromCenterMM / state.fringeWidth;
      
      // Calculate intensity using realistic interference formula
      const intensity = Math.cos(Math.PI * fringeNumber) ** 2;
      
      // Color-coded fringes: bright orange for constructive, dark for destructive
      let r, g, b;
      if (intensity > 0.5) {
        // Bright fringes - orange/wavelength color
        const baseColor = wavelengthToColor(state.wavelength);
        const rgb = baseColor.match(/\d+/g);
        if (rgb) {
          [r, g, b] = rgb.map(Number);
          r = Math.min(255, r * intensity * 1.2);
          g = Math.min(255, g * intensity * 1.2);
          b = Math.min(255, b * intensity * 1.2);
        }
      } else {
        // Dark fringes - grayscale
        const grayLevel = intensity * 100;
        r = g = b = grayLevel;
      }
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(screenX, y, screenWidth, 1);
    }
    
    // Draw realistic screen frame
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(screenX - 2, 35, screenWidth + 4, canvasHeight - 70);
    
    // Add precise millimeter ruler with real measurements
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    
    // Draw ruler marks based on real scale
    for (let y = 35; y < canvasHeight - 35; y++) {
      const mmFromCenter = Math.abs((y - centerY) * mmPerPixel);
      
      if (mmFromCenter % 5 < 0.1) { // Every 5mm
        ctx.beginPath();
        ctx.moveTo(screenX + screenWidth + 2, y);
        ctx.lineTo(screenX + screenWidth + 12, y);
        ctx.stroke();
        
        // Label major marks
        if (mmFromCenter > 0.5) {
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 9px Inter';
          ctx.fillText(`${mmFromCenter.toFixed(0)}`, screenX + screenWidth + 15, y + 3);
        }
      } else if (mmFromCenter % 1 < 0.1) { // Every 1mm
        ctx.beginPath();
        ctx.moveTo(screenX + screenWidth + 2, y);
        ctx.lineTo(screenX + screenWidth + 7, y);
        ctx.stroke();
      }
    }
    
    // Screen labels
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('Detection Screen', screenX - 30, canvasHeight - 10);
    ctx.font = '11px Inter';
    ctx.fillText(`D = ${state.screenDistance.toFixed(1)} cm`, screenX - 25, canvasHeight + 5);
    
    // Ruler label
    ctx.font = 'bold 8px Inter';
    ctx.fillText('mm', screenX + screenWidth + 15, 50);
    
    // Show fringe spacing measurement
    if (state.fringeWidth > 0.1) {
      const fringePixels = state.fringeWidth / mmPerPixel;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(screenX + screenWidth + 25, centerY - fringePixels/2);
      ctx.lineTo(screenX + screenWidth + 25, centerY + fringePixels/2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Fringe measurement label
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 9px Inter';
      ctx.fillText(`β=${state.fringeWidth.toFixed(2)}mm`, screenX + screenWidth + 30, centerY);
    }
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    // Draw measurement ruler at top
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 800, 35);
    
    // Draw ruler border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 800, 35);
    
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px Inter';
    
    // Major marks every 10cm (adjusted for new 10-100cm range)
    for (let i = 0; i <= 100; i += 10) {
      const x = (i / 100) * 800;
      ctx.fillText(i.toString(), x - 5, 22);
      
      // Major tick marks
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x, 35);
      ctx.stroke();
    }
    
    // Minor marks every 5cm
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 100; i += 5) {
      if (i % 10 !== 0) {
        const x = (i / 100) * 800;
        ctx.beginPath();
        ctx.moveTo(x, 28);
        ctx.lineTo(x, 35);
        ctx.stroke();
      }
    }
    
    // Unit label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 10px Inter';
    ctx.fillText('cm', 770, 15);
    
    // Add fringe width measurement indicator
    if (state.fringeWidth > 0) {
      const centerX = 400;
      const fringePixels = state.fringeWidth * 8; // Same scale as screen
      
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(centerX - fringePixels/2, 40);
      ctx.lineTo(centerX + fringePixels/2, 40);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Arrow heads
      ctx.beginPath();
      ctx.moveTo(centerX - fringePixels/2 - 3, 37);
      ctx.lineTo(centerX - fringePixels/2, 40);
      ctx.lineTo(centerX - fringePixels/2 - 3, 43);
      ctx.moveTo(centerX + fringePixels/2 + 3, 37);
      ctx.lineTo(centerX + fringePixels/2, 40);
      ctx.lineTo(centerX + fringePixels/2 + 3, 43);
      ctx.stroke();
      
      // Fringe width label
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 11px Inter';
      ctx.fillText(`β = ${state.fringeWidth.toFixed(2)} mm`, centerX - 30, 55);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Updated coordinates to match new canvas layout
    const slitX = 280;
    const screenX = (state.screenX / 100) * 800;
    const canvasHeight = 460;
    const slitHeight = 40; // Expanded clickable area
    const slit1Y = (state.slitPositions.slit1Y / 100) * canvasHeight - slitHeight / 2;
    const slit2Y = (state.slitPositions.slit2Y / 100) * canvasHeight - slitHeight / 2;
    
    // Check for slit interactions (expanded clickable areas)
    if (x >= slitX - 15 && x <= slitX + 35) {
      if (y >= slit1Y && y <= slit1Y + slitHeight) {
        setDragState({ isDragging: true, element: 'slit1', startY: y });
        canvas.style.cursor = 'ns-resize';
      } else if (y >= slit2Y && y <= slit2Y + slitHeight) {
        setDragState({ isDragging: true, element: 'slit2', startY: y });
        canvas.style.cursor = 'ns-resize';
      }
    } 
    // Check for screen interaction (horizontal dragging)
    else if (x >= screenX - 15 && x <= screenX + 50) {
      setDragState({ isDragging: true, element: 'screen', startY: y });
      canvas.style.cursor = 'ew-resize';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update cursor based on hover areas
    const slitX = 280;
    const screenX = (state.screenX / 100) * 800;
    const canvasHeight = 460;
    const slitHeight = 40;
    const slit1Y = (state.slitPositions.slit1Y / 100) * canvasHeight - slitHeight / 2;
    const slit2Y = (state.slitPositions.slit2Y / 100) * canvasHeight - slitHeight / 2;
    
    if (!dragState.isDragging) {
      if ((x >= slitX - 15 && x <= slitX + 35) && 
          ((y >= slit1Y && y <= slit1Y + slitHeight) || 
           (y >= slit2Y && y <= slit2Y + slitHeight))) {
        canvas.style.cursor = 'ns-resize';
      } else if (x >= screenX - 15 && x <= screenX + 50) {
        canvas.style.cursor = 'ew-resize';
      } else {
        canvas.style.cursor = 'crosshair';
      }
      return;
    }
    
    // Handle dragging
    if (dragState.element === 'slit1' || dragState.element === 'slit2') {
      const slitNumber = dragState.element === 'slit1' ? 1 : 2;
      const yPosition = Math.max(15, Math.min(85, (y / canvasHeight) * 100));
      onSlitDrag(slitNumber as 1 | 2, yPosition);
    } else if (dragState.element === 'screen') {
      const xPosition = Math.max(70, Math.min(95, (x / 800) * 100));
      onScreenDrag(xPosition);
    }
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'crosshair';
    }
    setDragState({ isDragging: false, element: null, startY: 0 });
  };

  return (
    <div className="simulation-container p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Realistic Double Slit Interference</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Interactive Elements:</span> 
          Drag slits ↕ vertically • Drag screen ↔ horizontally • Input values update automatically
        </p>
      </div>

      {/* Live Status Indicators */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded">
          Wavelength: {state.wavelength} nm
        </div>
        <div className="flex items-center bg-red-50 px-3 py-1 rounded">
          Slit Sep: {state.slitSeparation.toFixed(2)} mm
        </div>
        <div className="flex items-center bg-green-50 px-3 py-1 rounded">
          Screen Dist: {state.screenDistance.toFixed(1)} cm
        </div>
        <div className="flex items-center bg-orange-50 px-3 py-1 rounded">
          Fringe Width: {state.fringeWidth.toFixed(3)} mm
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={470}
        className="w-full bg-white rounded-lg border-2 border-gray-300 shadow-sm cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Real-time Measurements Display */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Real-World Scale Measurements</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="font-mono text-lg text-blue-600">{state.wavelength}</div>
            <div className="text-gray-600">nanometers (λ)</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-red-600">{state.slitSeparation.toFixed(2)}</div>
            <div className="text-gray-600">millimeters (d)</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-green-600">{state.screenDistance.toFixed(1)}</div>
            <div className="text-gray-600">centimeters (D)</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-orange-600">{state.fringeWidth.toFixed(3)}</div>
            <div className="text-gray-600">mm fringe width (β)</div>
          </div>
        </div>
      </div>

      {/* Interactive Guide */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="educational-card p-3 border-l-4 border-l-blue-500">
          <h4 className="font-bold text-blue-600 mb-2">🌊 Plane Waves</h4>
          <p className="text-gray-700">Coherent light source emits slow-moving plane waves toward the barrier. Notice the parallel wavefronts.</p>
        </div>
        <div className="educational-card p-3 border-l-4 border-l-red-500">
          <h4 className="font-bold text-red-600 mb-2">🎯 Narrow Slits</h4>
          <p className="text-gray-700">Realistic narrow slits act as secondary sources, creating semi-circular wavefronts. Drag to adjust separation.</p>
        </div>
        <div className="educational-card p-3 border-l-4 border-l-green-500">
          <h4 className="font-bold text-green-600 mb-2">📊 Fringe Pattern</h4>
          <p className="text-gray-700">Orange/black fringes form on screen with precise mm measurements. Drag screen to see scaling effects.</p>
        </div>
      </div>
    </div>
  );
}
