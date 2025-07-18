import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SimulationState } from '@/lib/physics';

interface ControlPanelProps {
  state: SimulationState;
  onWavelengthChange: (wavelength: number) => void;
  onSlitSeparationChange: (separation: number) => void;
  onScreenDistanceChange: (distance: number) => void;
  onReset: () => void;
}

export default function ControlPanel({
  state,
  onWavelengthChange,
  onSlitSeparationChange,
  onScreenDistanceChange,
  onReset
}: ControlPanelProps) {
  return (
    <div className="control-panel rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
        Experiment Parameters
      </h3>
      
      {/* Input Controls */}
      <div className="space-y-6">
        {/* Wavelength Control */}
        <div className="educational-card p-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Wavelength (λ): <span className="text-blue-600 font-bold">{state.wavelength}</span> nm
          </Label>
          
          {/* Spectrum Slider */}
          <div className="relative mb-4">
            <div className="spectrum-slider rounded mb-3"></div>
            <Slider
              value={[state.wavelength]}
              onValueChange={(value) => onWavelengthChange(value[0])}
              min={380}
              max={700}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="font-medium">Violet<br/>380nm</span>
              <span className="font-medium">Blue<br/>450nm</span>
              <span className="font-medium">Green<br/>550nm</span>
              <span className="font-medium">Red<br/>700nm</span>
            </div>
          </div>
          
          {/* Precise Input */}
          <Input
            type="number"
            value={state.wavelength}
            onChange={(e) => onWavelengthChange(Number(e.target.value))}
            min={380}
            max={700}
            className="text-center font-mono"
            placeholder="Enter wavelength"
          />
        </div>

        {/* Slit Separation */}
        <div className="educational-card p-4">
          <Label className="block text-sm font-medium text-gray-700 mb-3">
            Slit Separation (d): <span className="font-bold text-red-600">{state.slitSeparation.toFixed(1)} mm</span>
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              value={state.slitSeparation}
              onChange={(e) => onSlitSeparationChange(Number(e.target.value))}
              min={0.1}
              max={5.0}
              step={0.1}
              className="flex-1 font-mono"
            />
            <span className="text-sm text-gray-500 font-medium">mm</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Range: 0.1 - 5.0 mm</p>
        </div>

        {/* Screen Distance */}
        <div className="educational-card p-4">
          <Label className="block text-sm font-medium text-gray-700 mb-3">
            : <span className="font-bold text-green-600">{state.screenDistance.toFixed(0)} cm</span>
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              type="number"
              value={state.screenDistance}
              onChange={(e) => onScreenDistanceChange(Number(e.target.value))}
              min={10}
              max={100}
              step={20}
              className="flex-1 font-mono"
            />
            <span className="text-sm text-gray-500 font-medium">cm</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Range: 10 - 100 cm</p>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="mt-8 pt-6 border-t border-gray-300">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
          Physics Calculations
        </h4>
        
        <div className="space-y-4">
          {/* Fringe Width */}
          <Card className="educational-card border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">Fringe Width (β)</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {state.fringeWidth.toFixed(3)} mm
              </div>
              <div className="physics-formula mb-2">β = (λ × D) / d</div>
              <div className="text-xs text-gray-600">
                = ({state.wavelength} × 10⁻⁹ × {state.screenDistance/100}) / ({state.slitSeparation} × 10⁻³)
              </div>
            </CardContent>
          </Card>

          {/* Calculated Wavelength */}
          <Card className="educational-card border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">Calculated Wavelength (λc)</div>
              <div className="text-2xl font-bold text-orange-500 mb-2">
                {state.calculatedWavelength.toFixed(1)} nm
              </div>
              <div className="physics-formula mb-2">λc = (β × d) / D</div>
              <div className="text-xs text-gray-600">
                = ({state.fringeWidth.toFixed(3)} × 10⁻³ × {state.slitSeparation} × 10⁻³) / {state.screenDistance/100}
              </div>
            </CardContent>
          </Card>

          {/* Percentage Error */}
          <Card className="educational-card border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">Percentage Error</div>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {state.percentageError.toFixed(3)}%
              </div>
              <div className="physics-formula mb-2">% Error = |λc - λt| / λt × 100</div>
              <div className="text-xs text-gray-600">
                = |{state.calculatedWavelength.toFixed(1)} - {state.wavelength}| / {state.wavelength} × 100
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <Button 
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
        >
          🔄 Reset to Default Values
        </Button>
        <Button 
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const data = {
              timestamp: new Date().toISOString(),
              wavelength: `${state.wavelength} nm`,
              slitSeparation: `${state.slitSeparation.toFixed(1)} mm`,
              screenDistance: `${state.screenDistance.toFixed(0)} cm`,
              fringeWidth: `${state.fringeWidth.toFixed(3)} mm`,
              calculatedWavelength: `${state.calculatedWavelength.toFixed(1)} nm`,
              percentageError: `${state.percentageError.toFixed(3)}%`
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          }}
        >
          📋 Export Data to Clipboard
        </Button>
      </div>

      {/* Scientific Notes */}
      <div className="mt-6 educational-card p-4">
        <h5 className="font-medium text-gray-800 mb-2">Key Observations</h5>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Fringe width increases with wavelength and screen distance</p>
          <p>• Fringe width decreases with slit separation</p>
          <p>• Lower error indicates more accurate measurements</p>
          <p>• Different colors produce different fringe patterns</p>
        </div>
      </div>
    </div>
  );
}
