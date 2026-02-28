import React, { useState, useEffect } from 'react';
import TrainCard from './TrainCard';
import { useTrainContext } from '../../context/Context';

const TrainList = () => {
  const { trains, showTrainResults } = useTrainContext();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showTrainResults) return null;

  return (
    <div className="h-[100vh]">
      {trains.length > 0 ? (
        <ul className="h-full pt-32 lg:pt-36 pb-4 overflow-y-auto space-y-3 px-1">
          {trains.map((train) => (
            <TrainCard key={train.train_number} train={train} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-64 pt-32">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-surface-500 text-sm font-medium">No trains found</p>
            <p className="text-surface-400 text-xs mt-1">Try different stations or date</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainList;
