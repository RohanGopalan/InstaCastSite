'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [injuryArea, setInjuryArea] = useState('');
  const [message, setMessage] = useState('');
  const [painLevel, setPainLevel] = useState(5); // Default pain level
  const [address, setAddress] = useState(''); // New state for the address
  const [error, setError] = useState('');

  useEffect(() => {
    // Get the user's location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;
          
          // Round the latitude and longitude to 4 decimal places
          latitude = latitude.toFixed(4);
          longitude = longitude.toFixed(4);

          setLocation({ latitude, longitude });
          fetchAddress(latitude, longitude); // Fetch address when location is found
        },
        (err) => {
          setError('Unable to retrieve location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Function to fetch address from OpenCage API
  const fetchAddress = async (latitude, longitude) => {
    const api_key = '461281886bb944ccaa5ba4387891963a'; // OpenCage API key
    const query = `${latitude},${longitude}`;
    const api_url = 'https://api.opencagedata.com/geocode/v1/json';
    const request_url = `${api_url}?key=${api_key}&q=${encodeURIComponent(query)}&pretty=1&no_annotations=1`;

    try {
      const response = await fetch(request_url);
      if (response.ok) {
        const data = await response.json();
        if (data.results.length > 0) {
          setAddress(data.results[0].formatted); // Set address from the API response
        } else {
          setAddress('Address not found');
        }
      } else {
        console.log('Error fetching address:', response.status);
      }
    } catch (error) {
      setError('Unable to fetch address');
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted!\nLocation: ${JSON.stringify(location)}\nInjury: ${injuryArea}\nPain Level: ${painLevel}\nMessage: ${message}\nAddress: ${address}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Emergency Assistance Form</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-lg font-medium mb-2">
              Location (Latitude, Longitude)
            </label>
            {location ? (
              <p className="text-[15px]">
                Latitude: {location.latitude} <br /> Longitude: {location.longitude}
              </p>
            ) : (
              <p className="text-sm">Fetching your location...</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-lg font-medium mb-2">
              Address
            </label>
            <p className="text-sm">{address || 'Fetching address...'}</p>
          </div>

          <div>
            <label htmlFor="injuryArea" className="block text-lg font-medium mb-2">
              Area of Injury
            </label>
            <select
              id="injuryArea"
              value={injuryArea}
              onChange={(e) => setInjuryArea(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100"
              required
            >
              <option value="">Select an area...</option>
              <option value="head">Head</option>
              <option value="arm">Arm</option>
              <option value="leg">Leg</option>
              <option value="torso">Torso</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="painLevel" className="block text-lg font-medium mb-2">
              Pain Level (1 = No pain, 10 = Worst pain imaginable)
            </label>
            <input
              type="range"
              id="painLevel"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-lg font-medium mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full p-3 rounded-lg bg-gray-100"
              placeholder="Provide any additional information..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
