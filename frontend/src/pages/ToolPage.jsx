import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FileDropzone from '../components/FileDropzone.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import DownloadButton from '../components/DownloadButton.jsx'
import * as api from '../api/api.js'

const TOOL_CONFIG = {
  'pdf-to-word': {
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word document',
    icon: '📄',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  },
  'word-to-pdf': {
    name: 'Word to PDF',
    description: 'Convert Word document to PDF',
    icon: '📝',
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
  },
  'images-to-pdf': {
    name: 'Images to PDF',
    description: 'Combine images into a PDF',
    icon: '🖼️',
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'] },
    multiple: true,
  },
  'pdf-to-images': {
    name: 'PDF to Images',
    description: 'Extract PDF pages as images',
    icon: '🖼️',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  },
  'pptx-to-pdf': {
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint to PDF',
    icon: '📊',
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
    },
    multiple: false,
  },
  'pdf-to-pptx': {
    name: 'PDF to PowerPoint',
    description: 'Convert PDF to PowerPoint',
    icon: '📊',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  },
  'merge-pdf': {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one',
    icon: '🔗',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  },
  'split-pdf': {
    name: 'Split PDF',
    description: 'Split PDF into multiple files',
    icon: '✂️',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    hasOptions: true,
    options: [
      { key: 'ranges', label: 'Page ranges (e.g. 1-3,4-6)', type: 'text', placeholder: '1-3,4-6' },
    ],
  },
  'delete-pages': {
    name: 'Delete Pages',
    description: 'Remove specific pages from PDF',
    icon: '🗑️',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    hasOptions: true,
    options: [
      { key: 'pages', label: 'Pages to delete (e.g. 1,3,5)', type: 'text', placeholder: '1,3,5' },
    ],
  },
  'edit-pdf': {
    name: 'Edit PDF',
    description: 'Add text overlay to PDF pages',
    icon: '✏️',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    hasOptions: true,
    options: [
      { key: 'text', label: 'Text to add', type: 'text', placeholder: 'Enter text...' },
      { key: 'page', label: 'Page number', type: 'number', placeholder: '1' },
      { key: 'x', label: 'X position', type: 'number', placeholder: '100' },
      { key: 'y', label: 'Y position', type: 'number', placeholder: '100' },
    ],
  },
  'compress-pdf': {
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: '🗜️',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  },
  'watermark-pdf': {
    name: 'Add Watermark',
    description: 'Add text watermark to PDF',
    icon: '💧',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    hasOptions: true,
    options: [
      { key: 'text', label: 'Watermark text', type: 'text', placeholder: 'CONFIDENTIAL' },
      { key: 'opacity', label: 'Opacity (0.1-1.0)', type: 'number', placeholder: '0.3' },
    ],
  },
  'rotate-pdf': {
    name: 'Rotate PDF',
    description: 'Rotate pages in PDF',
    icon: '🔄',
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    hasOptions: true,
    options: [
      { key: 'angle', label: 'Rotation angle', type: 'select', options: ['90', '180', '270'] },
      { key: 'pages', label: 'Pages (leave empty for all)', type: 'text', placeholder: '1,2,3' },
    ],
  },
}

const API_MAP = {
  'pdf-to-word': api.pdfToWord,
  'word-to-pdf': api.wordToPdf,
  'images-to-pdf': api.imagesToPdf,
  'pdf-to-images': api.pdfToImages,
  'pptx-to-pdf': api.pptxToPdf,
  'pdf-to-pptx': api.pdfToPptx,
  'merge-pdf': api.mergePdf,
  'split-pdf': api.splitPdf,
  'delete-pages': api.deletePages,
  'edit-pdf': api.editPdf,
  'compress-pdf': api.compressPdf,
  'watermark-pdf': api.watermarkPdf,
  'rotate-pdf': api.rotatePdf,
}

export default function ToolPage() {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const config = TOOL_CONFIG[toolId]

  const [files, setFiles] = useState([])
  const [options, setOptions] = useState({})
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultBlob, setResultBlob] = useState(null)
  const [resultFilename, setResultFilename] = useState('')
  const [error, setError] = useState(null)

  if (!config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    )
  }

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
    setResultBlob(null)
    setError(null)
  }, [])

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select a file first.')
      return
    }

    const apiFn = API_MAP[toolId]
    if (!apiFn) {
      setError('Tool not implemented yet.')
      return
    }

    setLoading(true)
    setProgress(0)
    setError(null)

    try {
      const result = await apiFn(files, options, (pct) => setProgress(pct))
      const ext = getOutputExtension(toolId)
      setResultFilename(files[0].name.replace(/\.[^.]+$/, '') + ext)
      setResultBlob(result)
    } catch (err) {
      setError(err.message || 'An error occurred during processing.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResultBlob(null)
    setError(null)
    setProgress(0)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        ← Back to all tools
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{config.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
          <p className="text-gray-500">{config.description}</p>
        </div>
      </div>

      {!resultBlob && !loading && (
        <div className="space-y-6">
          <FileDropzone
            onDrop={handleDrop}
            accept={config.accept}
            multiple={config.multiple}
          />

          {files.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
              <ul className="space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📎</span>
                    <span className="truncate">{f.name}</span>
                    <span className="text-gray-400 shrink-0">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {config.hasOptions && config.options && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Options</h3>
              {config.options.map(opt => (
                <div key={opt.key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">{opt.label}</label>
                  {opt.type === 'select' ? (
                    <select
                      value={options[opt.key] || opt.options[0]}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {opt.options.map(o => <option key={o} value={o}>{o}°</option>)}
                    </select>
                  ) : (
                    <input
                      type={opt.type}
                      placeholder={opt.placeholder}
                      value={options[opt.key] || ''}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={files.length === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {config.name}
          </button>
        </div>
      )}

      {loading && (
        <div className="py-8">
          <ProgressBar progress={progress} label={'Processing with ' + config.name + '...'} />
        </div>
      )}

      {resultBlob && (
        <DownloadButton blob={resultBlob} filename={resultFilename} onReset={handleReset} />
      )}
    </div>
  )
}

function getOutputExtension(toolId) {
  const map = {
    'pdf-to-word': '.docx',
    'word-to-pdf': '.pdf',
    'images-to-pdf': '.pdf',
    'pdf-to-images': '.zip',
    'pptx-to-pdf': '.pdf',
    'pdf-to-pptx': '.pptx',
    'merge-pdf': '.pdf',
    'split-pdf': '.zip',
    'delete-pages': '.pdf',
    'edit-pdf': '.pdf',
    'compress-pdf': '.pdf',
    'watermark-pdf': '.pdf',
    'rotate-pdf': '.pdf',
  }
  return map[toolId] || '.pdf'
}
