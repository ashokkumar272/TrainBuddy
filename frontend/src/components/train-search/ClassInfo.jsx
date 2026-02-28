import React from "react";

const ClassInfo = ({ train, selectedClass, onClassSelect }) => {
  const handleClassSelect = (classType) => {
    onClassSelect(classType);
  };

  return (
    <div className="mt-2">
      {train.classesInfo && train.classesInfo.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {train.classesInfo.map((classInfo) => (
            <ClassCard
              key={classInfo.class}
              classInfo={classInfo}
              isSelected={selectedClass === classInfo.class}
              onSelect={() => handleClassSelect(classInfo.class)}
            />
          ))}
        </div>
      ) : (
        <LegacyClassDisplay
          train={train}
          selectedClass={selectedClass}
          onClassSelect={handleClassSelect}
        />
      )}
    </div>
  );
};

const ClassCard = ({ classInfo, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`rounded-xl p-2.5 sm:p-3 min-w-[110px] sm:min-w-[140px] flex-shrink-0 transition-all duration-200 border-2 ${
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-md ring-1 ring-primary-200"
          : "border-surface-200 bg-white hover:border-primary-300 hover:bg-primary-50/30"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span
            className={`font-bold text-xs px-2 py-0.5 rounded-md ${
              isSelected
                ? "bg-primary-600 text-white"
                : "bg-surface-100 text-surface-700"
            }`}
          >
            {classInfo.class}
          </span>
          {classInfo.fare && (
            <span className="text-accent-700 font-bold text-xs">
              ₹{classInfo.fare}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`font-semibold ${
              classInfo.availability && classInfo.availability.includes("WL")
                ? "text-red-600"
                : classInfo.availability && classInfo.availability.includes("AVL")
                ? "text-accent-600"
                : "text-surface-500"
            }`}
          >
            {classInfo.availability || "N/A"}
          </span>

          {classInfo.prediction && (
            <span className="text-primary-600 font-semibold">
              {classInfo.predictionPercentage
                ? `${classInfo.predictionPercentage}%`
                : classInfo.prediction}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const LegacyClassDisplay = ({ train, selectedClass, onClassSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {(train.availableClasses || train.class_type || []).map((cls) => (
        <button
          key={cls}
          onClick={() => onClassSelect(cls)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
            selectedClass === cls
              ? "bg-primary-600 text-white border-primary-600 shadow-sm"
              : "bg-surface-50 text-surface-600 border-surface-200 hover:border-primary-300 hover:bg-primary-50"
          }`}
        >
          {cls}
        </button>
      ))}
    </div>
  );
};

export default ClassInfo;
