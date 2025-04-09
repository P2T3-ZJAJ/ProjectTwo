import { useState, FormEvent } from "react";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Find Your Next Meal! 🍽️</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search recipes"
          />
          <button type="submit" className="search-button" title="Search">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
