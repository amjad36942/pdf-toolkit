import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link to={'/tool/' + tool.id} className="card hover:border-blue-300 hover:shadow-md transition-all duration-200 group block">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{tool.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tool.description}</p>
          <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{tool.category}</span>
        </div>
      </div>
    </Link>
  )
}
