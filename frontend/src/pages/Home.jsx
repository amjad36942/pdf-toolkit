import { useState } from 'react'
import ToolCard from '../components/ToolCard.jsx'

const TOOLS = [
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF files to editable Word documents.', icon: '📄', category: 'Convert' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF format.', icon: '📝', category: 'Convert' },
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Combine multiple images into a single PDF.', icon: '🖼️', category: 'Convert' },
  { id: 'pdf-to-images', name: 'PDF to Images', description: 'Extract pages from PDF as images.', icon: '🖼️', category: 'Convert' },
  { id: 'pptx-to-pdf', name: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations to PDF.', icon: '📊', category: 'Convert' },
  { id: 'pdf-to-pptx', name: 'PDF to PowerPoint', description: 'Convert PDF to editable PowerPoint.', icon: '📊', category: 'Convert' },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one document.', icon: '🔗', category: 'Organize' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Split a PDF into multiple files.', icon: '✂️', category: 'Organize' },
  { id: 'delete-pages', name: 'Delete Pages', description: 'Remove specific pages from a PDF.', icon: '🗑️', category: 'Organize' },
  { id: 'edit-pdf', name: 'Edit PDF', description: 'Add text or images as overlay on a PDF.', icon: '✏️', category: 'Edit' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size while preserving quality.', icon: '🗜️', category: 'Optimize' },
  { id: 'watermark-pdf', name: 'Add Watermark', description: 'Add text watermark to your PDF pages.', icon: '💧', category: 'Edit' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate pages in your PDF document.', icon: '🔄', category: 'Organize' },
]

const CATEGORIES = ['All', 'Convert', 'Organize', 'Edit', 'Optimize']

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All-in-One PDF Toolkit</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Free, secure tools for all your PDF needs. Files are processed locally and never stored.</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No tools found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
