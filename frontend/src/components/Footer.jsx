export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <span className="text-xl">📄</span>
            <span>PDF Toolkit</span>
          </div>
          <p className="text-sm text-gray-500">
            Free, secure PDF tools. Files are processed in memory and never stored permanently.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="https://github.com/amjad36942/pdf-toolkit" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">AMJAD HUSSAIN</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
