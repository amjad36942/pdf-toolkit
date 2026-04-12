import { Link } from 'react-router-dom'

export default function Header() {
    return (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                                  <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                                              <span className="text-2xl">📄</span>span>
                                              <span>PDF Toolkit</span>span>
                                  </Link>Link>
                                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                                              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>Link>
                                              <a
                                                              href="https://github.com/amjad36942/pdf-toolkit"
                                                              target="_blank"
                                                              rel="noreferrer"
                                                              className="hover:text-blue-600 transition-colors flex items-center gap-1"
                                                            >
                                                            <span>GitHub</span>span>
                                                            <span className="text-xs">↗</span>span>
                                              </a>a>
                                  </nav>nav>
                        </div>div>
                </div>div>
          </header>header>
        )
}</header>
