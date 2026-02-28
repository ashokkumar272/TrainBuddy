import React, { useState, useEffect } from "react";
import StationInput from "./StationInput";
import { useTrainContext } from "../../context/Context";

const SearchForm = () => {
  const {
    toStation,
    setToStation,
    fromStation,
    setFromStation,
    toStationCode,
    setToStationCode,
    fromStationCode,
    setFromStationCode,
    selectedDate,
    setSelectedDate,
    searchTrains,
    findBuddies,
    loading,
    error,
    setError,
    setList,
    showTrainResults,
    setShowTrainResults,
    toggleView,
    list,
    trains,
    searchInitiated,
    setSearchInitiated,
    suggestions,
  } = useTrainContext();

  const hasSearchResults = (showTrainResults && trains.length > 0) || suggestions;
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (searchInitiated && isSmallScreen) {
      setIsFormCollapsed(true);
    } else if (!searchInitiated) {
      setIsFormCollapsed(false);
    }
  }, [searchInitiated, isSmallScreen]);

  const handleSearchTrains = (e) => {
    e.preventDefault();
    setShowTrainResults(true);
    toggleView("trains");
    searchTrains();
  };

  const handleFindBuddy = (e) => {
    e.preventDefault();
    toggleView("buddies");
    findBuddies();
  };

  const shouldShowCollapsedBar = searchInitiated && isSmallScreen;

  // Collapsed mini-bar for mobile
  if (shouldShowCollapsedBar && isFormCollapsed) {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
      <div className="fixed top-16 left-0 right-0 z-[50] px-4 pt-3">
        <button
          onClick={() => { setIsFormCollapsed(false); setSearchInitiated(false); }}
          className="w-full px-4 py-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-surface-200/60 hover:shadow-xl transition-all flex items-center justify-between group max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-sm text-surface-800">
                {fromStation && toStation ? `${fromStation} → ${toStation}` : "Search Trains"}
              </div>
              {selectedDate && (
                <div className="text-xs text-surface-500 mt-0.5">{formatDate(selectedDate)}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-400 hidden sm:block">Tap to modify</span>
            <svg className="w-4 h-4 text-surface-400 group-hover:text-surface-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {error && (
          <div className="mt-3 max-w-6xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl text-sm text-red-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed left-0 right-0 z-[100] ${
      hasSearchResults ? 'top-16' : 'top-0 bottom-0 flex items-center justify-center'
    }`}>
      {/* Collapse button */}
      {shouldShowCollapsedBar && !isFormCollapsed && (
        <div className="flex justify-end mb-2 max-w-6xl mx-auto px-4">
          <button
            onClick={() => setIsFormCollapsed(true)}
            className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
            aria-label="Collapse search form"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}

      <form
        className={`flex flex-col lg:flex-row gap-4 justify-center items-stretch ${
          hasSearchResults ? "p-4 mt-3" : "p-5 md:p-6 lg:p-8"
        } bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-surface-200/60 hover:shadow-xl transition-all w-full max-w-6xl mx-4 sm:mx-auto`}
        onSubmit={handleSearchTrains}
      >
        {/* Heading only when no results */}
        {!hasSearchResults && (
          <div className="lg:hidden text-center mb-2">
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Find Your Travel Buddy</h1>
            <p className="text-sm text-surface-500 mt-1">Search trains and connect with fellow travelers</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row lg:flex-row gap-3 w-full">
          <StationInput
            value={fromStation}
            onChange={setFromStation}
            onStationSelect={(code, name, city) => {
              setFromStationCode(code);
              setFromStation(name);
              setError(null);
            }}
            placeholder="Boarding Station"
            className={`input ${hasSearchResults ? "!py-2.5" : "!py-3 lg:!py-4"} !rounded-xl lg:flex-1`}
          />
          <StationInput
            value={toStation}
            onChange={setToStation}
            onStationSelect={(code, name, city) => {
              setToStationCode(code);
              setToStation(name);
              setError(null);
            }}
            placeholder="Destination Station"
            className={`input ${hasSearchResults ? "!py-2.5" : "!py-3 lg:!py-4"} !rounded-xl lg:flex-1`}
          />
          <input
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`input ${hasSearchResults ? "!py-2.5" : "!py-3 lg:!py-4"} !rounded-xl lg:w-48 lg:flex-shrink-0`}
            value={selectedDate}
            type="date"
          />
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0 justify-center ${
          hasSearchResults ? "mt-1 lg:mt-0" : "mt-2 lg:mt-0"
        }`}>
          <button
            onClick={handleSearchTrains}
            className={`btn-primary ${hasSearchResults ? "!py-2.5" : "!py-3 lg:!py-4"} !px-8 w-full sm:w-auto`}
            type="button"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Trains
              </span>
            )}
          </button>

          <button
            onClick={handleFindBuddy}
            className={`btn-accent ${hasSearchResults ? "!py-2.5" : "!py-3 lg:!py-4"} !px-8 w-full sm:w-auto`}
            type="button"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Finding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Find Buddy
              </span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl text-sm text-red-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
