'use client'

interface FilterTabsProps {
  activeFilter: 'all' | 'skateboard' | 'shoe'
  onFilterChange: (filter: 'all' | 'skateboard' | 'shoe') => void
}

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const tabs = [
    { id: 'all' as const, label: 'All Setups' },
    { id: 'skateboard' as const, label: 'Skateboards' },
    { id: 'shoe' as const, label: 'Shoes' },
  ]
  
  return (
    <div className="flex gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === tab.id
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
