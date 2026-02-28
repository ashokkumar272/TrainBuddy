import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axios";
import ClassInfo from "./ClassInfo";

const TrainCard = ({ train }) => {
  const [isListing, setIsListing] = useState(false);
  const [listingError, setListingError] = useState(null);
  const [listingSuccess, setListingSuccess] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [unlistSuccess, setUnlistSuccess] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const checkUserListing = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axiosInstance.get('/api/users/me');
        
        if (response.data.success) {
          setUserData(response.data.user);
            const travelStatus = response.data.user.travelStatus;
          if (travelStatus && 
              travelStatus.isActive && 
              travelStatus.boardingStation === train.fromStation?.code && 
              travelStatus.destinationStation === train.toStation?.code && 
              travelStatus.trainNumber === train.trainNumber) {
            
            let trainDate;
            if (train.train_date) {
              const dateParts = train.train_date.split('-');
              if (dateParts.length === 3) {
                trainDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
              } else {
                trainDate = new Date(train.train_date);
              }
            } else {
              trainDate = new Date();
            }
            
            const userDate = new Date(travelStatus.travelDate);
            
            if (trainDate.toDateString() === userDate.toDateString()) {
              setIsListed(true);
              setListingSuccess(true);
              if (travelStatus.preferredClass) {
                setSelectedClass(travelStatus.preferredClass);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking user listing:", error);
      }
    };

    checkUserListing();
  }, [train]);

  const handleClassSelect = (classType) => {
    setSelectedClass(classType);
  };

  const handleListYourself = async () => {
    if (isListed) {
      await performListingAction();
      return;
    }
    
    if (!selectedClass) {
      setListingError("Please select a travel class before listing yourself");
      return;
    }
    
    await performListingAction();
  };
  
  const performListingAction = async () => {
    setIsListing(true);
    setListingError(null);
    setUnlistSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setListingError("Please login to list yourself on this train");
        setIsListing(false);
        return;
      }

      if (isListed) {
        const travelStatusData = {
          boardingStation: "",
          destinationStation: "",
          travelDate: null,
          trainNumber: "",
          preferredClass: "",
          isActive: false
        };

        const response = await axiosInstance.put('/api/users/travel-status', travelStatusData);
        if (response.data.success) {
          setIsListed(false);
          setListingSuccess(false);
          setUnlistSuccess(true);
          setTimeout(() => setUnlistSuccess(false), 3000);
        } else {
          setListingError("Failed to unlist from this train");
        }
      } else {
        let trainDate;
        try {
          if (train.train_date) {
            const dateParts = train.train_date.split('-');
            if (dateParts.length === 3) {
              trainDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            } else {
              trainDate = new Date(train.train_date);
            }
          } else {
            trainDate = new Date();
          }
        } catch (error) {
          console.error('Error parsing train date:', error);
          trainDate = new Date();
        }

        const travelStatusData = {
          boardingStation: train.fromStation?.code || train.from,
          destinationStation: train.toStation?.code || train.to,
          travelDate: trainDate.toISOString(),
          trainNumber: train.trainNumber || train.train_number,
          preferredClass: selectedClass,
          isActive: true
        };

        const response = await axiosInstance.put('/api/users/travel-status', travelStatusData);
        if (response.data.success) {
          setIsListed(true);
          setListingSuccess(true);
        } else {
          setListingError("Failed to list yourself on this train");
        }
      }
    } catch (error) {
      console.error('Error updating travel status:', error);
      setListingError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsListing(false);
    }
  };

  return (
    <li
      key={train.trainNumber || train.train_number}
      className="card-hover p-4 md:p-5 !rounded-xl relative animate-fade-in"
    >
      {/* Listed ribbon */}
      {isListed && listingSuccess && (
        <div className="absolute top-0 right-0">
          <div className="badge-accent !rounded-none !rounded-bl-lg !rounded-tr-xl text-xs font-semibold px-3 py-1">
            Listed
          </div>
        </div>
      )}

      {/* Header: Train name + date */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base md:text-lg font-bold text-surface-900 leading-tight">
            {train.trainName || train.train_name}
          </h3>
          <span className="text-xs text-primary-600 font-medium">
            #{train.trainNumber || train.train_number}
          </span>
        </div>
        <span className="badge-primary text-xs">
          {train.train_date}
        </span>
      </div>

      {/* Route: From → To */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <p className="font-semibold text-surface-900 text-sm md:text-base">
            <span className="hidden md:inline">
              {train.fromStation?.name || train.from_station_name}
              <span className="text-surface-500 ml-1 text-xs">({train.fromStation?.code || train.from})</span>
            </span>
            <span className="md:hidden text-sm">{train.fromStation?.code || train.from}</span>
          </p>
          <p className="text-xs text-surface-500 font-medium mt-0.5">{train.departureTime || train.from_std}</p>
        </div>

        <div className="flex flex-col items-center mx-3">
          <span className="text-[10px] text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full mb-1">
            {train.duration ? `${Math.floor(train.duration / 60)}h ${train.duration % 60}m` : 'N/A'}
          </span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <div className="w-16 md:w-24 h-px bg-primary-300" />
            <svg className="w-3 h-3 text-primary-500 -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {train.distance && (
            <span className="text-[10px] text-surface-400 mt-1">{train.distance} km</span>
          )}
        </div>

        <div className="flex-1 text-right">
          <p className="font-semibold text-surface-900 text-sm md:text-base">
            <span className="hidden md:inline">
              {train.toStation?.name || train.to_station_name}
              <span className="text-surface-500 ml-1 text-xs">({train.toStation?.code || train.to})</span>
            </span>
            <span className="md:hidden text-sm">{train.toStation?.code || train.to}</span>
          </p>
          <p className="text-xs text-surface-500 font-medium mt-0.5">{train.arrivalTime || train.to_sta}</p>
        </div>
      </div>

      {/* Class selection */}
      <div className="border-t border-surface-100 pt-3">
        <ClassInfo
          train={train}
          selectedClass={selectedClass}
          onClassSelect={handleClassSelect}
        />
      </div>

      {/* Action button */}
      <div className="flex justify-center mt-3">
        {isListed && listingSuccess ? (
          <div className="flex flex-col items-center w-full gap-2">
            <p className="text-xs text-accent-700 font-medium text-center">
              You are listed in <span className="font-bold">{selectedClass}</span> class
            </p>
            <button
              onClick={handleListYourself}
              disabled={isListing}
              className="btn-danger btn-sm w-full max-w-xs"
            >
              {isListing ? "Processing..." : "Unlist Yourself"}
            </button>
          </div>
        ) : unlistSuccess ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm text-primary-700 font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Unlisted successfully
          </div>
        ) : selectedClass ? (
          <button
            onClick={handleListYourself}
            disabled={isListing}
            className="btn-primary w-full max-w-xs"
          >
            {isListing ? "Processing..." : "List Yourself on This Train"}
          </button>
        ) : null}
      </div>

      {listingError && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {listingError}
        </div>
      )}
    </li>
  );
};

export default TrainCard;