import React, { useState } from 'react';

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onSearch(query);
      };
    
      return (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      );
    };
    
    export default SearchBar;