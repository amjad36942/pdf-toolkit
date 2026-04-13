import ToolCard from '../components/ToolCard.jsx'

export const TOOLS = [
  { id:'pdf-to-word',    name:'PDF to Word',       description:'Convert PDF files to editable Word documents (.docx)',   icon:'📝', tag:'Convert', bgColor:'bg-blue-50',   tagColor:'bg-blue-100 text-blue-700' },
  { id:'word-to-pdf',    name:'Word to PDF',        description:'Convert Word documents (.doc/.docx) to PDF format',      icon:'📄', tag:'Convert', bgColor:'bg-indigo-50', tagColor:'bg-indigo-100 text-indigo-700' },
  { id:'images-to-pdf',  name:'Images to PDF',      description:'Combine multiple images (JPG, PNG, etc.) into one PDF',  icon:'🖼️', tag:'Convert', bgColor:'bg-green-50',  tagColor:'bg-green-100 text-green-700' },
  { id:'pdf-to-images',  name:'PDF to Images',      description:'Convert each PDF page to a PNG image (ZIP download)',    icon:'🗃️', tag:'Convert', bgColor:'bg-teal-50',   tagColor:'bg-teal-100 text-teal-700' },
  { id:'pptx-to-pdf',    name:'PowerPoint to PDF',  description:'Convert .pptx or .ppt presentations to PDF',            icon:'📊', tag:'Convert', bgColor:'bg-orange-50',  tagColor:'bg-orange-100 text-orange-700' },
  { id:'pdf-to-pptx',    name:'PDF to PowerPoint',  description:'Convert PDF pages to PowerPoint slides (.pptx)',         icon:'🎯', tag:'Convert', bgColor:'bg-red-50',    tagColor:'bg-red-100 text-red-700' },
  { id:'merge-pdf',      name:'Merge PDF',          description:'Combine multiple PDF files into a single document',      icon:'🔗', tag:'Organize', bgColor:'bg-purple-50', tagColor:'bg-purple-100 text-purple-700' },
  { id:'split-pdf',      name:'Split PDF',           description:'Split a PDF into individual page files (ZIP)',           icon:'✂️', tag:'Organize', bgColor:'bg-pink-50',   tagColor:'bg-pink-100 text-pink-700' },
  { id:'delete-pages',   name:'Delete Pages',       description:'Remove specific pages from a PDF document',             icon:'🗑️', tag:'Organize', bgColor:'bg-rose-50',   tagColor:'bg-rose-100 text-rose-700' },
  { id:'compress-pdf',   name:'Compress PDF',       description:'Reduce PDF file size with intelligent compression',      icon:'🗜️', tag:'Optimize', bgColor:'bg-amber-50',  tagColor:'bg-amber-100 text-amber-700' },
  { id:'watermark-pdf',  name:'Add Watermark',      description:'Add a diagonal text watermark to all PDF pages',        icon:'💧', tag:'Edit',     bgColor:'bg-cyan-50',   tagColor:'bg-cyan-100 text-cyan-700' },
  { id:'rotate-pdf',     name:'Rotate PDF',         description:'Rotate all pages by 90°, 180°, or 270°',               icon:'🔄', tag:'Edit',     bgColor:'bg-lime-50',   tagColor:'bg-lime-100 text-lime-700' },
  { id:'edit-pdf',       name:'Edit PDF',           description:'Add text overlay to any page of a PDF',                 icon:'✏️', tag:'Edit',     bgColor:'bg-violet-50', tagColor:'bg-violet-100 text-violet-700' },
  ]

const CATEGORIES = ['All', 'Convert', 'Organize', 'Optimize', 'Edit']

import { useState } from 'react'

export default function Home() {
    const [filter, setFilter] = useState('All')
    const filtered = filter === 'All' ? TOOLS : TOOLS.filter(t => t.tag === filter)

  return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
              <div className="text-center mb-12">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                All-in-One PDF Toolkit
                      </h1>h1>
                      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                                Convert, merge, split, compress and edit PDF files.
                                Free, fast, and secure — files deleted automatically after processing.
                      </p>p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                                            <span>🔒</span>span> No permanent storage
                                </span>span>
                                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                                            <span>⚡</span>span> Fast processing
                                </span>span>
                                <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                                            <span>🆓</span>span> Completely free
                                </span>span>
                      </div>div>
              </div>div>
        
          {/* Category filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map(cat => (
                    <button
                                  key={cat}
                                  onClick={() => setFilter(cat)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                  filter === cat
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                  }`}
                                >
                      {cat}
                    </button>button>
                  ))}
              </div>div>
        
          {/* Tool grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
              </div>div>
        </div>div>
      )
}</div>
