import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import availableComics from './comics.json';

// Helper function to format a Date object to YYYYMMDD string
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

// Helper function to get the path for a comic based on date
const getComicPathForDate = (date) => {
  const formattedDate = formatDateToYYYYMMDD(date);
  // Assuming your images are .png. Adjust if you have mixed types or need more complex logic.
  return `${process.env.PUBLIC_URL}/comics/${formattedDate}.png`;
};

function App() {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [currentComicUrl, setCurrentComicUrl] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For the "Loading comic..." text

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparisons

  const navigateToDate = useCallback((newDate) => {
    newDate.setHours(0,0,0,0); // Normalize date for consistency
    setCurrentDisplayDate(newDate);
  }, []);

  // Effect to update comic URL and reset error when currentDisplayDate changes
  useEffect(() => {
    setIsLoading(true); // Show "Loading comic..." text
    const newUrl = getComicPathForDate(currentDisplayDate);
    setCurrentComicUrl(newUrl);
    setImageLoadError(false); // Reset error for the new attempt
  }, [currentDisplayDate]);

  const showLatestComic = useCallback(() => {
    navigateToDate(new Date()); // new Date() will be today
  }, [navigateToDate]);

  // Initial load: set to latest comic (today)
  useEffect(() => {
    showLatestComic();
  }, [showLatestComic]); // This effect runs once on mount due to useCallback stabilization

  const handleImageLoad = () => {
    setImageLoadError(false);
    setIsLoading(false); // Hide "Loading comic..." text, image will be shown
  };

  const handleImageError = () => {
    setImageLoadError(true);
    setIsLoading(false); // Hide "Loading comic..." text, error message will be shown
  };

  // const showNextComic = () => {
  //   const nextDate = new Date(currentDisplayDate);
  //   nextDate.setDate(currentDisplayDate.getDate() + 1);
  //   navigateToDate(nextDate);
  // };

  const showPreviousComic = () => {
    const prevDate = new Date(currentDisplayDate);
    prevDate.setDate(currentDisplayDate.getDate() - 1);
    navigateToDate(prevDate);
  };

  const showRandomComic = () => {
    const randomComic = availableComics[Math.floor(Math.random() * availableComics.length)];
    const year = parseInt(randomComic.substring(0, 4), 10);
    const month = parseInt(randomComic.substring(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(randomComic.substring(6, 8), 10);
    const randomDate = new Date(year, month, day);
    navigateToDate(randomDate);
  };
  
  // const isNextDisabled = () => {
  //   const nextDisplayDay = new Date(currentDisplayDate);
  //   nextDisplayDay.setDate(nextDisplayDay.getDate() + 1);
  //   return nextDisplayDay > today;
  // };

  return (
    <div className="app-container">
      <h1>Running Onion</h1>
      <p className="comic-date-display">
        Displaying comic for: {currentDisplayDate.toLocaleDateString()}
      </p>
      <div className="comic-viewer">
        {/* The image tag is now always rendered if currentComicUrl is present.
            Its onLoad/onError will toggle isLoading and imageLoadError.
            The key prop ensures React treats the img as a new element if the src changes,
            helping to reliably trigger onLoad/onError for the new source. */}
        {currentComicUrl && (
          <img
            key={currentComicUrl} 
            src={currentComicUrl}
            alt={`Comic for ${currentDisplayDate.toLocaleDateString()}`}
            className="comic-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isLoading || imageLoadError ? 'none' : 'block' }} // Hide img while "Loading..." text is shown, or if there's an error
          />
        )}

        {/* Display messages based on state */}
        {isLoading && <p>Loading comic...</p>}
        {!isLoading && imageLoadError && (
          <div className="game-container">
            <p>No comic found for {currentDisplayDate.toLocaleDateString()}. Enjoy the game!</p>
            <iframe src="/game.html" title="Running Onion Game" className="game-iframe" width="800" height="600" style={{ border: 'none' }}></iframe>
          </div>
        )}
        {/* If !isLoading && !imageLoadError, and currentComicUrl is valid, the image will be visible
            because its style would be display: 'block' */}
      </div>
      <div className="navigation-buttons">
        <button onClick={showPreviousComic}>
          &larr; Previous Day
        </button>
        <button onClick={showRandomComic}>
          Random
        </button>
        {/* <button onClick={showNextComic} disabled={isNextDisabled()}>
           Next Day &rarr;
        </button> */}
      </div>
      <div className="latest-button-container">
        <button onClick={showLatestComic}>
          Go to Today's Comic ({new Date().toLocaleDateString()}) 
        </button>
      </div>
    </div>
  );
}

export default App;