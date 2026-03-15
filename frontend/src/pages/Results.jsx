import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout';
import { TrainSearchContainer } from '../components/train-search';
import { BuddySystemContainer } from '../components/buddy-system';
import { ContentDivider } from '../components/common';
import { useTrainContext } from '../context/Context';

const Results = () => {
  const navigate = useNavigate();
  const { showTrainResults, suggestions, trains } = useTrainContext();

  const hasTrainResults = showTrainResults && trains && trains.length > 0;
  const hasBuddyResults = !!suggestions;
  const hasAnyResults = hasTrainResults || hasBuddyResults;
  const bothVisible = hasTrainResults && hasBuddyResults;
  const onlyBuddies = hasBuddyResults && !hasTrainResults;

  // If no results in context (e.g. direct navigation), redirect home
  useEffect(() => {
    if (!hasAnyResults) {
      navigate('/', { replace: true });
    }
  }, [hasAnyResults, navigate]);

  if (!hasAnyResults) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-surface-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <div className={`flex flex-col items-center relative w-full ${
        bothVisible ? 'lg:max-w-none' : 'max-w-6xl'
      } mx-auto px-4 sm:px-6 gap-4 pt-20 lg:pt-16`}>
        {onlyBuddies ? (
          <>
            <div className="w-full">
              <TrainSearchContainer />
            </div>
            <div className="w-full animate-fade-in">
              <BuddySystemContainer />
            </div>
          </>
        ) : (
          <div className={`flex flex-col lg:flex-row items-center m-auto lg:items-start w-full ${
            bothVisible ? 'lg:gap-6' : 'lg:gap-0'
          } ${
            bothVisible ? 'lg:justify-center' : 'lg:justify-around'
          }`}>
            <div className={`w-full ${bothVisible ? 'lg:w-1/2 lg:flex-1' : ''}`}>
              <TrainSearchContainer />
            </div>
            {bothVisible && <ContentDivider />}
            <div className={`w-full ${bothVisible ? 'lg:w-1/2 lg:flex-1' : 'lg:w-auto'} animate-fade-in`}>
              <BuddySystemContainer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
