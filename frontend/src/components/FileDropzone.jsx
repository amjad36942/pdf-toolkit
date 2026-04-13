import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileDropzone({ onDrop, accept, multiple = false, maxSize = 52428800 }) {
  const onDropCallback = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === 'file-too-large') {
        alert('File is too large. Maximum size is 50MB.')
      } else if (error.code === 'file-invalid-type') {
        alert('Invalid file type. Please check the accepted formats.')
      }
      return
    }
    onDrop(acceptedFiles)
  }, [onDrop])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
    multiple,
    maxSize,
  })

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {isDragActive ? (
          <p className="font-medium text-blue-600">Drop the files here...</p>
        ) : (
          <div className="text-center">
            <p className="font-medium">Drag & drop files here, or <span className="text-blue-600 cursor-pointer">browse</span></p>
            <p className="text-sm mt-1">Maximum file size: 50MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
