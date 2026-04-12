export default function ProgressBar({ progress, label = 'Processing...' }) {
    return (
          <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                  </svg>svg>
                          {label}
                        </span>span>
                        <span className="text-blue-600 font-semibold">{progress}%</span>span>
                </div>div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                  />
                </div>div>
          </div>div>
        )
}</div>
