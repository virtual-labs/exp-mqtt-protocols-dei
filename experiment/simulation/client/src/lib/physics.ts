export interface SimulationState {
  wavelength: number; // nm
  slitSeparation: number; // mm
  screenDistance: number; // cm
  fringeWidth: number; // mm
  calculatedWavelength: number; // nm
  percentageError: number; // %
  slitPositions: {
    slit1Y: number; // percentage
    slit2Y: number; // percentage
  };
  screenX: number; // percentage
}

export const DEFAULT_STATE: SimulationState = {
  wavelength: 600,
  slitSeparation: 0.5,
  screenDistance: 100, // Set to 100 cm by default
  fringeWidth: 0,
  calculatedWavelength: 0,
  percentageError: 0,
  slitPositions: {
    slit1Y: 35,
    slit2Y: 55
  },
  screenX: 95 // Adjusted to match 100 cm screen distance
};

export function calculatePhysics(state: SimulationState): SimulationState {
  const lambda = state.wavelength * 1e-9; // Convert to meters
  const d = state.slitSeparation * 1e-3; // Convert to meters
  const D = state.screenDistance * 1e-2; // Convert to meters

  // Calculate fringe width: β = λD/d
  const fringeWidth = (lambda * D / d) * 1000; // Convert to mm

  // Calculate wavelength from fringe width: λc = βd/D
  const calculatedWavelength = (fringeWidth * 1e-3 * d / D) * 1e9; // Convert to nm

  // Calculate percentage error
  const percentageError = Math.abs(calculatedWavelength - state.wavelength) / state.wavelength * 100;

  return {
    ...state,
    fringeWidth,
    calculatedWavelength,
    percentageError
  };
}

export function wavelengthToColor(wavelength: number): string {
  // Convert wavelength to RGB color
  let r = 0, g = 0, b = 0;
  
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity correction for extreme wavelengths
  let intensity = 1;
  if (wavelength >= 380 && wavelength < 420) {
    intensity = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength > 700 && wavelength <= 780) {
    intensity = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  }

  r = Math.round(255 * r * intensity);
  g = Math.round(255 * g * intensity);
  b = Math.round(255 * b * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}

export function calculateInterferenceIntensity(
  x: number,
  y: number,
  slitY1: number,
  slitY2: number,
  wavelength: number,
  screenDistance: number
): number {
  // Calculate path difference from two slits
  const d1 = Math.sqrt((x - 33) ** 2 + (y - slitY1) ** 2);
  const d2 = Math.sqrt((x - 33) ** 2 + (y - slitY2) ** 2);
  const pathDifference = Math.abs(d1 - d2);
  
  // Convert to phase difference
  const phaseDifference = (2 * Math.PI * pathDifference) / (wavelength * 1e-9 * 1000);
  
  // Calculate intensity using interference formula
  return Math.cos(phaseDifference / 2) ** 2;
}
