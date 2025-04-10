import { useState, FormEvent, useRef } from "react";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

    // Add clear function
    const handleClear = () => {
      setSearchTerm("");
      // Keep focus on the input after clearing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

  return (
    <div className="search-container">
      <h1 className="search-title">Find Your Next Meal! 🍽️</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
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

          <button type="submit" className="search-button" title="Search">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
