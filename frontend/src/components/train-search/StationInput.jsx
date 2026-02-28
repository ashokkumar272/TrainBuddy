import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axios';

const StationInput = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  onStationSelect 
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStationCode, setSelectedStationCode] = useState('');
  const suggestionRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (cityName) => {
    if (!cityName.trim() || cityName.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/stations/suggestions?city=${encodeURIComponent(cityName)}`
      );
      if (response.data.status && response.data.data.suggestions) {
        setSuggestions(response.data.data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching station suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!newValue.trim()) {
      setSelectedStationCode('');
      setSuggestions([]);
      setShowSuggestions(false);
      onChange('');
      if (onStationSelect) onStationSelect('', '');
      return;
    }

    debounceRef.current = setTimeout(() => fetchSuggestions(newValue), 150);
    onChange(newValue);
  };

  const handleStationSelect = (stationName, stationCode, cityName, event) => {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const displayText = `${stationName} - ${stationCode}`;
    setInputValue(displayText);
    setSelectedStationCode(stationCode);
    setShowSuggestions(false);
    onChange(stationCode);
    if (onStationSelect) onStationSelect(stationCode, stationName, cityName);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
    if (inputValue.trim() && inputValue.length >= 1) fetchSuggestions(inputValue);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 300);
  };

  return (
    <div className="relative" ref={suggestionRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${className} ${loading ? 'pr-10' : ''}`}
        autoComplete="off"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck="false"
        inputMode="text"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-200 border-t-primary-600"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[9999] w-full mt-1.5 bg-white border border-surface-200 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-fade-in-down">
          {suggestions.map((cityData, cityIndex) => (
            <div key={cityIndex}>
              {cityData.stations.map((station, stationIndex) => (
                <div
                  key={`${cityIndex}-${stationIndex}`}
                  className="px-4 py-3 hover:bg-primary-50 active:bg-primary-100 cursor-pointer border-b border-surface-100 last:border-0 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                  onMouseDown={(e) => handleStationSelect(station.stationName, station.stationCode, cityData.city, e)}
                  onTouchStart={(e) => handleStationSelect(station.stationName, station.stationCode, cityData.city, e)}
                  style={{ minHeight: '44px', WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-surface-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-surface-800">{station.stationName}</p>
                      <p className="text-xs text-surface-500">{station.stationCode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !loading && inputValue.trim().length >= 1 && (
        <div className="absolute z-[9999] w-full mt-1.5 bg-white border border-surface-200 rounded-xl shadow-xl">
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-surface-500">No stations found for "{inputValue}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationInput;
