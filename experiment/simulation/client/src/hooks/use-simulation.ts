import { useState, useCallback, useEffect } from 'react';
import { SimulationState, DEFAULT_STATE, calculatePhysics } from '@/lib/physics';

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(DEFAULT_STATE);
  const [isAnimating, setIsAnimating] = useState(true);

  // Calculate physics whenever state changes
  useEffect(() => {
    setState(prevState => calculatePhysics(prevState));
  }, [state.wavelength, state.slitSeparation, state.screenDistance]);

  const updateWavelength = useCallback((wavelength: number) => {
    setState(prevState => ({
      ...prevState,
      wavelength: Math.max(380, Math.min(700, wavelength))
    }));
  }, []);

  const updateSlitSeparation = useCallback((slitSeparation: number) => {
    setState(prevState => ({
      ...prevState,
      slitSeparation: Math.max(0.1, Math.min(5.0, slitSeparation))
    }));
  }, []);

  const updateScreenDistance = useCallback((screenDistance: number) => {
    setState(prevState => ({
      ...prevState,
      screenDistance: Math.max(10, Math.min(100, screenDistance))
    }));
  }, []);

  const updateSlitPosition = useCallback((slitNumber: 1 | 2, yPosition: number) => {
    setState(prevState => {
      const newState = {
        ...prevState,
        slitPositions: {
          ...prevState.slitPositions,
          [`slit${slitNumber}Y`]: Math.max(15, Math.min(85, yPosition))
        }
      };
      
      // Calculate new slit separation based on positions
      const slit1Y = slitNumber === 1 ? yPosition : prevState.slitPositions.slit1Y;
      const slit2Y = slitNumber === 2 ? yPosition : prevState.slitPositions.slit2Y;
      const canvasHeight = 460;
      const pixelSeparation = Math.abs(slit1Y - slit2Y) * canvasHeight / 100;
      const mmPerPixel = 0.02; // Real-world scale conversion
      const newSeparation = Math.max(0.1, Math.min(5.0, pixelSeparation * mmPerPixel));
      
      return {
        ...newState,
        slitSeparation: newSeparation
      };
    });
  }, []);

  const updateScreenPosition = useCallback((xPosition: number) => {
    setState(prevState => {
      const newX = Math.max(70, Math.min(95, xPosition));
      
      // Calculate new screen distance based on position
      const canvasWidth = 800;
      const slitX = 280;
      const screenPixelX = (newX / 100) * canvasWidth;
      const pixelDistance = screenPixelX - slitX;
      const cmPerPixel = 0.025; // Real-world scale conversion (adjusted for new range)
      const newDistance = Math.max(10, Math.min(100, pixelDistance * cmPerPixel));
      
      // Always update screenDistance when screen is dragged
      // This ensures the input field updates automatically
      return {
        ...prevState,
        screenX: newX,
        screenDistance: Math.round(newDistance * 10) / 10 // Round to 1 decimal place for cleaner display
      };
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  return {
    state,
    isAnimating,
    updateWavelength,
    updateSlitSeparation,
    updateScreenDistance,
    updateSlitPosition,
    updateScreenPosition,
    resetSimulation,
    toggleAnimation
  };
}
