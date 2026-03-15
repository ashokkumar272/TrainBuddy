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
        <>
          {/* Results count header */}
          <div className="pt-32 lg:pt-36 pb-2">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              {trains.length} train{trains.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <ul className="pb-6 space-y-3 overflow-y-auto" style={{ height: 'calc(100% - 5rem)' }}>
            {trains.map((train) => (
              <TrainCard key={train.train_number} train={train} />
            ))}
          </ul>
        </>
      ) : (
        <div className="flex items-center justify-center h-full pt-32">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-surface-700 mb-1">No trains found</h3>
            <p className="text-sm text-surface-400">Try different stations or a different travel date</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainList;
