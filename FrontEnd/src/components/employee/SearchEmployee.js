import React, { useState } from 'react';
import EmployeeService from '../../services/EmployeeService';

const SearchEmployee = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      onClear();
      return;
    }

    setLoading(true);
    setError(null);

    EmployeeService.searchEmployees(query)
      .then(response => {
        onSearch(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Search failed. ' + error.message);
        setLoading(false);
      });
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="form-inline">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-outline-primary" disabled={!query || loading}>
              <i className="fas fa-search me-2"></i>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={!query || loading}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
};

export default SearchEmployee;