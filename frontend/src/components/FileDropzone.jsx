import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileDropzone({ onFiles, accept, multiple = false, label, hint }) {
    const onDrop = useCallback((accepted) => {
          if (accepted.length > 0) onFiles(multiple ? accepted : [accepted[0]])
    }, [onFiles, multiple])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: accept || undefined,
        multiple,
        maxSize: 52428800, // 50MB
  })

  return (
        <div>
              <div
                {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                      >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-3">
                                <div className="text-4xl">{isDragActive ? '📂' : '📁'}</div>div>
                                <div>
                                            <p className="font-semibold text-gray-700">
                                              {isDragActive ? 'Drop files here...' : (label || 'Drag & drop your file here')}
                                            </p>p>
                                            <p className="text-sm text-gray-400 mt-1">
                                              {hint || 'or click to browse — max 50MB'}
                                            </p>p>
                                </div>div>
                      </div>div>
              </div>div>
        
          {acceptedFiles.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {acceptedFiles.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                              <span>📎</span>span>
                                              <span className="truncate font-medium">{f.name}</span>span>
                                              <span className="ml-auto text-gray-400 shrink-0">
                                                {(f.size / 1024 / 1024).toFixed(2)} MB
                                              </span>span>
                                </div>div>
                              ))}
                  </div>div>
              )}
        </div>div>
      )
}</div>
