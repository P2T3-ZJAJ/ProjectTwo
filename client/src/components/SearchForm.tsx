// client/src/components/SearchForm.tsx
import { useState, FormEvent, useRef, useEffect } from "react";

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialSearchTerm?: string;
  onClear?: () => void;
}

const SearchForm = ({ onSearch, initialSearchTerm = "", onClear }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    // keep focus on the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // call the onClear callback if provided
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Find Your Next Meal! 🍽️</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
          <div className="search-input-container">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search recipes"
            />
            
            {searchTerm && (
              <button
                type="button"
                className="search-clear-button"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>

          <button type="submit" className="search-button" title="Search">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;