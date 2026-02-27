import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Choose Your Buzzword Pack
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Pick the category that matches your meeting type.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md active:scale-95 rounded-xl p-6 text-left transition-all duration-150 flex flex-col gap-2"
            >
              <div className="text-4xl">{category.icon}</div>
              <div className="font-semibold text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500">{category.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                {category.words.slice(0, 4).join(', ')}…
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
