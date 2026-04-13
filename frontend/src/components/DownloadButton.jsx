import { useEffect } from 'react'

export default function DownloadButton({ blob, filename, onReset }) {
  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'download'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [blob, filename])

  if (!blob) return null

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
      <div className="flex items-center gap-2 text-green-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-semibold">Processing complete!</span>
      </div>
      <div className="flex gap-3">
        <a
          href={URL.createObjectURL(blob)}
          download={filename}
          className="btn-primary"
        >
          Download {filename}
        </a>
        <button onClick={onReset} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Process Another
        </button>
      </div>
    </div>
  )
}
