import { useSimulation } from '@/hooks/use-simulation';
import SimulationCanvas from '@/components/simulation-canvas';
import ControlPanel from '@/components/control-panel';
import EducationalPanel from '@/components/educational-panel';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function SimulationPage() {
  const {
    state,
    isAnimating,
    updateWavelength,
    updateSlitSeparation,
    updateScreenDistance,
    updateSlitPosition,
    updateScreenPosition,
    resetSimulation
  } = useSimulation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Young's Double Slit Experiment
          </h1>
          <p className="text-gray-600 text-xl mb-2">Interactive Wave Interference Simulation</p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Explore the fundamental principles of wave-particle duality through precise measurements 
            and real-time visualization of interference patterns
          </p>
        </div>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Simulation Canvas */}
          <div className="xl:col-span-3 space-y-6">
            <SimulationCanvas
              state={state}
              isAnimating={isAnimating}
              onSlitDrag={updateSlitPosition}
              onScreenDrag={updateScreenPosition}
            />

            {/* Complete Interactive Controls Below Simulation */}
            <div className="simulation-container p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interactive Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wavelength Control */}
                <div className="educational-card p-4">
                  <Label className="text-sm font-bold text-gray-700 mb-3 block">
                    Wavelength (λ): 
                    <span className="text-blue-600 font-mono ml-2">{state.wavelength} nm</span>
                  </Label>
                  <div className="spectrum-slider rounded mb-3"></div>
                  <Slider
                    value={[state.wavelength]}
                    onValueChange={(value) => updateWavelength(value[0])}
                    min={380}
                    max={700}
                    step={1}
                    className="w-full mb-3"
                  />
                  <input
                    type="number"
                    value={state.wavelength}
                    onChange={(e) => updateWavelength(Number(e.target.value))}
                    min={380}
                    max={700}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-center"
                    placeholder="Enter wavelength"
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    Color: {state.wavelength < 450 ? 'Violet-Blue' : 
                            state.wavelength < 500 ? 'Blue' : 
                            state.wavelength < 570 ? 'Green-Yellow' : 
                            state.wavelength < 590 ? 'Yellow' : 
                            state.wavelength < 620 ? 'Orange' : 'Red'}
                  </div>
                </div>

                {/* Slit Separation Control */}
                <div className="educational-card p-4">
                  <Label className="text-sm font-bold text-gray-700 mb-3 block">
                    Slit Separation (d): 
                    <span className="text-red-600 font-mono ml-2">{state.slitSeparation.toFixed(3)} mm</span>
                  </Label>
                  <input
                    type="number"
                    value={state.slitSeparation.toFixed(3)}
                    onChange={(e) => updateSlitSeparation(Number(e.target.value))}
                    min={0.1}
                    max={5.0}
                    step={0.001}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-center mb-3"
                    placeholder="Enter separation"
                  />
                  <div className="text-xs text-gray-600 mb-2">Range: 0.1 - 5.0 mm</div>
                  <div className="text-xs text-blue-600 font-medium">
                    💡 Drag slits vertically in simulation to change this value
                  </div>
                </div>

                {/* Screen Distance Control */}
                <div className="educational-card p-4">
                  <Label className="text-sm font-bold text-gray-700 mb-3 block">
                    Screen Distance (D): 
                    <span className="text-green-600 font-mono ml-2">{state.screenDistance.toFixed(2)} cm</span>
                  </Label>
                  <input
                    type="number"
                    value={state.screenDistance.toFixed(2)}
                    onChange={(e) => updateScreenDistance(Number(e.target.value))}
                    min={10}
                    max={100}
                    step={0.1}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-center mb-3"
                    placeholder="Enter distance"
                  />
                  <div className="text-xs text-gray-600 mb-2">Range: 10 - 100 cm</div>
                  <div className="text-xs text-blue-600 font-medium">
                    💡 Drag screen horizontally in simulation to change this value
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Physics Calculations Section */}
          <div className="xl:col-span-1">
            <div className="simulation-container p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Live Physics Calculations
              </h3>
              
              {/* Fringe Width Calculation */}
              <div className="educational-card p-4 mb-4 border-l-4 border-l-orange-500">
                <h4 className="font-bold text-orange-600 mb-3">Fringe Width (β)</h4>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                  β = (λ × D) / d
                </div>
                <div className="text-xs space-y-1 mb-3">
                  <div>λ = {state.wavelength} nm = {(state.wavelength / 1e6).toFixed(6)} mm</div>
                  <div>D = {state.screenDistance.toFixed(2)} cm = {(state.screenDistance * 10).toFixed(1)} mm</div>
                  <div>d = {state.slitSeparation.toFixed(3)} mm</div>
                </div>
                <div className="font-bold text-orange-600 text-lg">
                  β = {state.fringeWidth.toFixed(4)} mm
                </div>
              </div>

              {/* Calculated Wavelength */}
              <div className="educational-card p-4 mb-4 border-l-4 border-l-blue-500">
                <h4 className="font-bold text-blue-600 mb-3">Calculated Wavelength (λc)</h4>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                  λc = (β × d) / D
                </div>
                <div className="text-xs space-y-1 mb-3">
                  <div>β = {state.fringeWidth.toFixed(4)} mm</div>
                  <div>d = {state.slitSeparation.toFixed(3)} mm</div>
                  <div>D = {(state.screenDistance * 10).toFixed(1)} mm</div>
                </div>
                <div className="font-bold text-blue-600 text-lg">
                  λc = {state.calculatedWavelength.toFixed(1)} nm
                </div>
              </div>

              {/* Percentage Error */}
              <div className="educational-card p-4 mb-4 border-l-4 border-l-red-500">
                <h4 className="font-bold text-red-600 mb-3">Percentage Error</h4>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded mb-3">
                  Error = |λc - λt| / λt × 100%
                </div>
                <div className="text-xs space-y-1 mb-3">
                  <div>λt (theoretical) = {state.wavelength} nm</div>
                  <div>λc (calculated) = {state.calculatedWavelength.toFixed(1)} nm</div>
                  <div>|λc - λt| = {Math.abs(state.calculatedWavelength - state.wavelength).toFixed(1)} nm</div>
                </div>
                <div className={`font-bold text-lg ${state.percentageError < 5 ? 'text-green-600' : state.percentageError < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Error = {state.percentageError.toFixed(2)}%
                </div>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <button
                  onClick={resetSimulation}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  🔄 Reset to Default Values
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Reference and Educational Information */}
        <div className="simulation-container p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Young's Double Slit Formula Reference
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-3">Primary Formula</h4>
              <div className="font-mono text-lg bg-white p-3 rounded border-2 border-blue-200 mb-3">
                β = λD/d
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <div><strong>β</strong> = Fringe width (distance between bright fringes)</div>
                <div><strong>λ</strong> = Wavelength of light</div>
                <div><strong>D</strong> = Distance from slits to screen</div>
                <div><strong>d</strong> = Distance between the two slits</div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-bold text-orange-800 mb-3">Experimental Analysis</h4>
              <div className="font-mono text-lg bg-white p-3 rounded border-2 border-orange-200 mb-3">
                λ = βd/D
              </div>
              <div className="text-sm text-orange-700 space-y-1">
                <div>Rearranged to calculate wavelength from measurements</div>
                <div>Used for experimental determination of light wavelength</div>
                <div>Compare calculated vs. theoretical values</div>
                <div>Analyze percentage error in results</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-3">📚 Understanding Wave Interference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-green-700 mb-2">Constructive Interference</h5>
                <p className="text-green-600">When waves from both slits arrive in phase, they add together creating bright fringes (maximum intensity).</p>
              </div>
              <div>
                <h5 className="font-medium text-green-700 mb-2">Destructive Interference</h5>
                <p className="text-green-600">When waves arrive out of phase, they cancel each other creating dark fringes (minimum intensity).</p>
              </div>
              <div>
                <h5 className="font-medium text-green-700 mb-2">Path Difference</h5>
                <p className="text-green-600">The key factor determining interference is the difference in path lengths from each slit to a point on the screen.</p>
              </div>
            </div>
          </div>
        </div>

        <EducationalPanel />
      </div>
    </div>
  );
}
