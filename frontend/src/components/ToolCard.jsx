import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
    return (
          <Link
                  to={`/tool/${tool.id}`}
                  className="card p-6 flex flex-col gap-3 cursor-pointer group"
                >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${tool.bgColor || 'bg-blue-50'}`}>
                  {tool.icon}
                </div>div>
                <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tool.description}</p>p>
                </div>div>
                <div className="mt-auto pt-2">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${tool.tagColor || 'bg-blue-100 text-blue-700'}`}>
                          {tool.tag}
                        </span>span>
                </div>div>
          </Link>Link>
        )
}</Link>
