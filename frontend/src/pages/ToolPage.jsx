import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { TOOLS } from './Home.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import DownloadButton from '../components/DownloadButton.jsx'
import * as api from '../api/api.js'

// Accept maps for dropzone
const PDF_ACCEPT = { 'application/pdf': ['.pdf'] }
const WORD_ACCEPT = { 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
const IMAGE_ACCEPT = { 'image/*': ['.jpg','.jpeg','.png','.gif','.bmp','.tiff','.webp'] }
const PPTX_ACCEPT = { 'application/vnd.ms-powerpoint': ['.ppt'], 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] }

function getAccept(toolId) {
    if (['pdf-to-word','pdf-to-images','pdf-to-pptx','split-pdf','compress-pdf','rotate-pdf','edit-pdf'].includes(toolId)) return PDF_ACCEPT
    if (toolId === 'word-to-pdf') return WORD_ACCEPT
    if (toolId === 'images-to-pdf') return IMAGE_ACCEPT
    if (toolId === 'pptx-to-pdf') return PPTX_ACCEPT
    if (['merge-pdf','delete-pages','watermark-pdf'].includes(toolId)) return PDF_ACCEPT
    return undefined
}

function getOutputFilename(toolId, inputName) {
    const stem = inputName ? inputName.replace(/\.[^.]+$/, '') : 'output'
    const map = {
          'pdf-to-word':   stem + '_converted.docx',
          'word-to-pdf':   stem + '_converted.pdf',
          'images-to-pdf': 'images_combined.pdf',
          'pdf-to-images': stem + '_images.zip',
          'pptx-to-pdf':   stem + '.pdf',
          'pdf-to-pptx':   stem + '.pptx',
          'merge-pdf':     'merged.pdf',
          'split-pdf':     'split_pages.zip',
          'delete-pages':  'pages_deleted.pdf',
          'compress-pdf':  'compressed.pdf',
          'watermark-pdf': 'watermarked.pdf',
          'rotate-pdf':    'rotated.pdf',
          'edit-pdf':      stem + '_edited.pdf',
    }
    return map[toolId] || 'output'
}

export default function ToolPage() {
    const { toolId } = useParams()
    const tool = TOOLS.find(t => t.id === toolId)

  const [files, setFiles] = useState([])
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState(null)
    const [outputFilename, setOutputFilename] = useState('')
    const [error, setError] = useState(null)

  // Extra fields for tools that need options
  const [pagesInput, setPagesInput] = useState('')
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
    const [rotateDeg, setRotateDeg] = useState(90)
    const [editPage, setEditPage] = useState(1)
    const [editText, setEditText] = useState('')
    const [editX, setEditX] = useState(50)
    const [editY, setEditY] = useState(100)
    const [editFontSize, setEditFontSize] = useState(14)

  const reset = useCallback(() => {
        setFiles([])
        setProgress(0)
        setLoading(false)
        setDownloadUrl(null)
        setOutputFilename('')
        setError(null)
  }, [])

  const handleFiles = useCallback((accepted) => {
        setFiles(accepted)
        setError(null)
        setDownloadUrl(null)
  }, [])

  const handleSubmit = async () => {
        if (files.length === 0) { setError('Please select a file first.'); return }
        setLoading(true)
        setError(null)
        setProgress(0)

        try {
                let response
                const onProgress = (p) => setProgress(p)
                const f = files[0]

          switch (toolId) {
            case 'pdf-to-word':   response = await api.pdfToWord(f, onProgress); break
            case 'word-to-pdf':   response = await api.wordToPdf(f, onProgress); break
            case 'images-to-pdf': response = await api.imagesToPdf(files, onProgress); break
            case 'pdf-to-images': response = await api.pdfToImages(f, onProgress); break
            case 'pptx-to-pdf':   response = await api.pptxToPdf(f, onProgress); break
            case 'pdf-to-pptx':   response = await api.pdfToPptx(f, onProgress); break
            case 'merge-pdf':     response = await api.mergePdf(files, onProgress); break
            case 'split-pdf':     response = await api.splitPdf(f, onProgress); break
            case 'delete-pages':
                        if (!pagesInput.trim()) { setError('Enter page numbers to delete.'); setLoading(false); return }
                        response = await api.deletePages(f, pagesInput, onProgress); break
            case 'compress-pdf':  response = await api.compressPdf(f, onProgress); break
            case 'watermark-pdf': response = await api.watermarkPdf(f, watermarkText, onProgress); break
            case 'rotate-pdf':    response = await api.rotatePdf(f, rotateDeg, onProgress); break
            case 'edit-pdf':
                        if (!editText.trim()) { setError('Enter text to add.'); setLoading(false); return }
                        response = await api.editPdf(f, editPage, editText, editX, editY, editFontSize, onProgress); break
            default:
                        setError('Unknown tool.'); setLoading(false); return
          }

          setProgress(100)
                const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' })
                const url = URL.createObjectURL(blob)
                const fname = getOutputFilename(toolId, f?.name)
                setDownloadUrl(url)
                setOutputFilename(fname)
        } catch (err) {
                const msg = err.response?.data
                  ? await err.response.data.text?.() || 'Server error.'
                          : err.message || 'Something went wrong.'
                setError(msg)
        } finally {
                setLoading(false)
        }
  }

  if (!tool) {
        return (
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                        <p className="text-5xl mb-4">🔍</p>p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tool not found</h2>h2>
                        <Link to="/" className="btn-primary inline-block mt-4">Back to Home</Link>Link>
                </div>div>
              )
  }
  
    const isMultiple = ['images-to-pdf', 'merge-pdf'].includes(toolId)
        const accept = getAccept(toolId)
          
            return (
                  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
                    {/* Back */}
                        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                                ← Back to all tools
                        </Link>Link>
                  
                    {/* Tool header */}
                        <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${tool.bgColor}`}>
                                  {tool.icon}
                                </div>div>
                                <div>
                                          <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>h1>
                                          <p className="text-gray-500 mt-0.5">{tool.description}</p>p>
                                </div>div>
                        </div>div>
                  
                    {/* Main card */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                        
                          {/* File dropzone */}
                                <FileDropzone
                                            onFiles={handleFiles}
                                            accept={accept}
                                            multiple={isMultiple}
                                            label={isMultiple ? `Drag & drop ${toolId === 'images-to-pdf' ? 'images' : 'PDF files'} here` : undefined}
                                            hint={isMultiple ? 'or click to browse multiple files — max 50MB each' : undefined}
                                          />
                        
                          {/* Extra options */}
                          {toolId === 'delete-pages' && (
                              <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Pages to delete (comma-separated, e.g. 1,3,5)
                                          </label>label>
                                          <input
                                                          type="text"
                                                          value={pagesInput}
                                                          onChange={e => setPagesInput(e.target.value)}
                                                          placeholder="e.g. 1,3,5"
                                                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                              </div>div>
                                )}
                        
                          {toolId === 'watermark-pdf' && (
                              <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Watermark text</label>label>
                                          <input
                                                          type="text"
                                                          value={watermarkText}
                                                          onChange={e => setWatermarkText(e.target.value)}
                                                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                              </div>div>
                                )}
                        
                          {toolId === 'rotate-pdf' && (
                              <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Rotation degrees</label>label>
                                          <div className="flex gap-3">
                                            {[90, 180, 270].map(deg => (
                                                <button
                                                                    key={deg}
                                                                    onClick={() => setRotateDeg(deg)}
                                                                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                                                                                          rotateDeg === deg ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'
                                                                    }`}
                                                                  >
                                                  {deg}°
                                                </button>button>
                                              ))}
                                          </div>div>
                              </div>div>
                                )}
                        
                          {toolId === 'edit-pdf' && (
                              <div className="space-y-3">
                                          <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Page number</label>label>
                                                                        <input type="number" min="1" value={editPage} onChange={e => setEditPage(Number(e.target.value))}
                                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        </div>div>
                                                        <div>
                                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Font size (pt)</label>label>
                                                                        <input type="number" min="6" max="72" value={editFontSize} onChange={e => setEditFontSize(Number(e.target.value))}
                                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        </div>div>
                                                        <div>
                                                                        <label className="block text-xs font-medium text-gray-600 mb-1">X position (pt)</label>label>
                                                                        <input type="number" value={editX} onChange={e => setEditX(Number(e.target.value))}
                                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        </div>div>
                                                        <div>
                                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Y position (pt)</label>label>
                                                                        <input type="number" value={editY} onChange={e => setEditY(Number(e.target.value))}
                                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        </div>div>
                                          </div>div>
                                          <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Text to add</label>label>
                                                        <input type="text" value={editText} onChange={e => setEditText(e.target.value)} placeholder="Enter text..."
                                                                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                          </div>div>
                              </div>div>
                                )}
                        
                          {/* Error */}
                          {error && (
                              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                          <span>⚠️</span>span>
                                          <span>{error}</span>span>
                              </div>div>
                                )}
                        
                          {/* Progress */}
                          {loading && <ProgressBar progress={progress} />}
                        
                          {/* Submit */}
                          {!downloadUrl && (
                              <button
                                            onClick={handleSubmit}
                                            disabled={loading || files.length === 0}
                                            className="btn-primary w-full"
                                          >
                                {loading ? 'Processing...' : `Convert / Process`}
                              </button>button>
                                )}
                        
                          {/* Download */}
                          {downloadUrl && (
                              <DownloadButton url={downloadUrl} filename={outputFilename} onReset={reset} />
                            )}
                        </div>div>
                  
                    {/* Info */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                                <span>ℹ️</span>span>
                                <span>Your files are processed securely and deleted automatically within 10 minutes. We never store your documents permanently.</span>span>
                        </div>div>
                  </div>div>
                )
}</div>
