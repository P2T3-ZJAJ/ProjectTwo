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
    <form onSubmit={handleSubmit} className="search-form mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-input"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search recipes"
        />
        <button type="submit" className="btn btn-primary px-4">
          <i className="bi bi-search me-2"></i>
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
