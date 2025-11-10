interface FilterOption {
  label: string;
  value: string;
}

interface SearchProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  resultsCount: number;
  selectedFilters: string[];
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  selectedSort: string;
  onSortChange: (value: string) => void;
  sortOptions: FilterOption[];
  canReset: boolean;
}

export default function Search({
  searchTerm,
  onChange,
  onReset,
  resultsCount,
  selectedFilters,
  onFilterChange,
  filterOptions,
  selectedSort,
  onSortChange,
  sortOptions,
  canReset,
}: SearchProps) {
  const resultsLabel = searchTerm
    ? `Showing ${resultsCount} advocates for "${searchTerm}"`
    : `Showing ${resultsCount} advocates`;

  return (
    <div className="space-y-3">
      <p className="text-[#101010] font-bold">Search</p>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="search-input"
          className="h-[50px] w-full flex rounded-[10px] border border-gray-300 px-4 text-gray-900 focus:border-[#347866] focus:outline-none focus:ring-2 focus:ring-[#347866]/40"
          value={searchTerm}
          onChange={onChange}
          placeholder="Search by name, city, degree, or specialty"
        />
        <button
          className="h-[50px] rounded-[10px] bg-[#347866] px-6 text-lg font-medium text-white transition-colors hover:bg-[#3f937c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[250px]"
          onClick={onReset}
          disabled={!canReset}
        >
          Reset Search
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-gray-600">{resultsLabel}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-start sm:gap-6">
          <fieldset className="flex flex-col sm:flex-row sm:items-center">
            <legend className="font-medium">Filter by degree:</legend>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const isSelected = selectedFilters.includes(option.value);
                return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-1 rounded-[8px] border px-3 py-2 transition-colors ${
                    isSelected
                      ? "border-[#347866] bg-[#347866]/10 text-[#347866]"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#347866]/70 hover:bg-[#347866]/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="degree-filter"
                    value={option.value}
                    checked={isSelected}
                    onChange={(event) => onFilterChange(event.target.value)}
                    className="sr-only"
                  />
                  <span>{option.label}</span>
                </label>
              );})}
            </div>
          </fieldset>
          <div className="flex flex-col">
            <label htmlFor="sort-select" className="font-medium">
              Sort by experience:
            </label>
            <select
              id="sort-select"
              className="h-[42px] rounded-[10px] border border-gray-300 bg-white px-3 text-gray-900 focus:border-[#347866] focus:outline-none focus:ring-2 focus:ring-[#347866]/40"
              value={selectedSort}
              onChange={(event) => onSortChange(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

