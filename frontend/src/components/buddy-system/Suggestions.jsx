import React from "react";
import Suggested from "./Suggested";
import { useTrainContext } from "../../context/Context";

const Suggestions = ({ suggestions, setSuggestions }) => {
  const { buddies, loading, toggleView } = useTrainContext();

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-surface-200 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-surface-900">Travel Buddies</h2>
          {buddies.length > 0 && (
            <span className="badge-accent text-xs">{buddies.length}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleView('trains')}
            className="lg:hidden btn-secondary btn-sm"
          >
            Trains
          </button>
          <button
            onClick={() => setSuggestions(false)}
            className="btn-ghost btn-sm !text-red-500 hover:!bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Buddy list */}
      <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-surface-500">Finding travel buddies...</p>
          </div>
        ) : buddies.length > 0 ? (
          buddies.map((buddy) => (
            <Suggested
              key={buddy._id}
              id={buddy._id}
              name={buddy.name || buddy.username}
              profession={buddy.profession}
              isFriend={buddy.isFriend}
              travelDetails={buddy.travelDetails}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-surface-500 font-medium">No travel buddies found</p>
            <p className="text-xs text-surface-400">Try a different route or date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
