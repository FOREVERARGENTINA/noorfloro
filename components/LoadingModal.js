'use client'

export default function LoadingModal({ message = 'Cargando...', show }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[90] animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-scaleIn">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner profesional */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          {/* Mensaje */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{message}</p>
            <p className="text-sm text-gray-500 mt-1">Por favor espera un momento</p>
          </div>
        </div>
      </div>
    </div>
  )
}
