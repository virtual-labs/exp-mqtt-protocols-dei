import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EducationalPanel() {
  return (
    <div className="mt-12 space-y-6">
      {/* Main Educational Content */}
      <Card className="simulation-container">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="w-4 h-4 bg-purple-500 rounded-full mr-3"></span>
            Understanding Young's Double Slit Experiment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="educational-card p-5">
              <h4 className="font-bold text-blue-600 mb-3 text-lg">🌊 Wave Interference</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                When coherent monochromatic light passes through two closely spaced slits, the emerging wavefronts interfere constructively and destructively.
              </p>
              <div className="physics-formula text-xs">
                Constructive: δ = nλ (n = 0, ±1, ±2...)
              </div>
            </div>
            
            <div className="educational-card p-5">
              <h4 className="font-bold text-orange-600 mb-3 text-lg">📏 Fringe Width Formula</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The distance between adjacent bright fringes depends on wavelength, screen distance, and slit separation.
              </p>
              <div className="physics-formula text-xs">
                β = λD/d
              </div>
              <div className="text-xs text-gray-600 mt-2">
                β: fringe width, λ: wavelength, D: screen distance, d: slit separation
              </div>
            </div>
            
            <div className="educational-card p-5">
              <h4 className="font-bold text-green-600 mb-3 text-lg">🎯 Interactive Learning</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Manipulate parameters to observe real-time changes in interference patterns and verify theoretical predictions.
              </p>
              <div className="text-xs text-gray-600">
                Drag elements • Adjust sliders • Compare results
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="educational-card">
          <CardContent className="p-5">
            <h4 className="font-bold text-purple-600 mb-3">Parameter Relationships</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>↑ Wavelength (λ)</span>
                <span className="text-blue-600">↑ Fringe Width</span>
              </div>
              <div className="flex justify-between">
                <span>↑ </span>
                <span className="text-blue-600">↑ Fringe Width</span>
              </div>
              <div className="flex justify-between">
                <span>↑ Slit Separation (d)</span>
                <span className="text-red-600">↓ Fringe Width</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="educational-card">
          <CardContent className="p-5">
            <h4 className="font-bold text-purple-600 mb-3">Historical Context</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Thomas Young (1801) first demonstrated wave nature of light through this elegant experiment.</p>
              <p className="text-xs text-gray-600">
                Later became fundamental to quantum mechanics, showing wave-particle duality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card className="educational-card">
        <CardContent className="p-5">
          <h4 className="font-bold text-purple-600 mb-3">Real-World Applications</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <h5 className="font-semibold text-blue-600 mb-1">Spectroscopy</h5>
              <p>Measuring precise wavelengths of light sources for chemical analysis</p>
            </div>
            <div>
              <h5 className="font-semibold text-blue-600 mb-1">Interferometry</h5>
              <p>High-precision distance measurements in scientific instruments</p>
            </div>
            <div>
              <h5 className="font-semibold text-blue-600 mb-1">Holography</h5>
              <p>Creating three-dimensional images using interference patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
