import React, { useState } from "react";
import { fetchAutocomplete } from "../api/placesApi";
import "./LocationAutocomplete.css";

function LocationAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const predictions = await fetchAutocomplete(value);
      setResults(predictions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="autocomplete-container">
      <input
        className="autocomplete-input"
        value={query}
        onChange={handleChange}
        placeholder="Enter location..."
      />

      {results.length > 0 && (
        <ul className="autocomplete-list">
          {results.map((p) => (
            <li
              key={p.placeId}
              className="autocomplete-item"
              onClick={() => {
                onSelect(p);
                setQuery(p.description);
                setResults([]);
              }}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutocomplete;
