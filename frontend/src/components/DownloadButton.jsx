export default function DownloadButton({ url, filename, onReset }) {
    return (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">✅</div>div>
                        <div>
                                  <p className="font-semibold text-green-800">File ready!</p>p>
                                  <p className="text-sm text-green-600">{filename}</p>p>
                        </div>div>
                </div>div>
                <div className="flex gap-3">
                        <a
                                    href={url}
                                    download={filename}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                                  >
                                  <span>⬇</span>span>
                                  <span>Download</span>span>
                        </a>a>
                        <button
                                    onClick={onReset}
                                    className="btn-secondary px-4 py-3"
                                  >
                                  Process another
                        </button>button>
                </div>div>
          </div>div>
        )
}</div>
