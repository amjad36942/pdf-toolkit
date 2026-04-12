/**
 * API client for PDF Toolkit backend.
 * BASE_URL: set VITE_API_URL env var for production, defaults to same-origin /api in dev.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 120000, // 2 minutes for large files
})

// Generic file upload helper — returns a blob URL for download
async function uploadFile(endpoint, formData, onProgress) {
    const response = await api.post(endpoint, formData, {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
                  if (onProgress && e.total) {
                            onProgress(Math.round((e.loaded * 100) / e.total))
                  }
          },
    })
    return response
}

// ── Convert ────────────────────────────────────────────────────────────────────
export const pdfToWord = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/pdf-to-word', fd, onProgress)
}

export const wordToPdf = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/word-to-pdf', fd, onProgress)
}

// ── Images ─────────────────────────────────────────────────────────────────────
export const imagesToPdf = (files, onProgress) => {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    return uploadFile('/images-to-pdf', fd, onProgress)
}

export const pdfToImages = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/pdf-to-images', fd, onProgress)
}

// ── PowerPoint ─────────────────────────────────────────────────────────────────
export const pptxToPdf = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/pptx-to-pdf', fd, onProgress)
}

export const pdfToPptx = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/pdf-to-pptx', fd, onProgress)
}

// ── Tools ──────────────────────────────────────────────────────────────────────
export const mergePdf = (files, onProgress) => {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    return uploadFile('/merge-pdf', fd, onProgress)
}

export const splitPdf = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/split-pdf', fd, onProgress)
}

export const deletePages = (file, pages, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('pages', pages)
    return uploadFile('/delete-pages', fd, onProgress)
}

export const compressPdf = (file, onProgress) => {
    const fd = new FormData(); fd.append('file', file)
    return uploadFile('/compress-pdf', fd, onProgress)
}

export const watermarkPdf = (file, text, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('text', text)
    return uploadFile('/watermark-pdf', fd, onProgress)
}

export const rotatePdf = (file, degrees, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('degrees', degrees)
    return uploadFile('/rotate-pdf', fd, onProgress)
}

export const editPdf = (file, page, text, x, y, fontSize, onProgress) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('page', page)
    fd.append('text', text)
    fd.append('x', x)
    fd.append('y', y)
    fd.append('font_size', fontSize)
    return uploadFile('/edit-pdf', fd, onProgress)
}

// ── Health ─────────────────────────────────────────────────────────────────────
export const healthCheck = () => api.get('/health')
