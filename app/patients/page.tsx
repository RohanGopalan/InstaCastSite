'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from '@/firebaseConfig'; // Ensure this file is correctly set up

const db = getFirestore(firebaseApp); // Initialize Firestore

interface Location {
  latitude: number;
  longitude: number;
}

export default function PatientPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [injuryArea, setInjuryArea] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    // Get the current geolocation of the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Math.round(position.coords.latitude * 10000) / 10000;
          const lng = Math.round(position.coords.longitude * 10000) / 10000;
          setLocation({ latitude: lat, longitude: lng });
          fetchAddress(lat.toString(), lng.toString());
        },
        () => setError('Unable to retrieve location')
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  }, []);

  const fetchAddress = async (latitude: string, longitude: string): Promise<void> => {
    const api_key = '461281886bb944ccaa5ba4387891963a'; // OpenCage API key
    const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${api_key}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

    try {
      const response = await fetch(api_url);
      if (response.ok) {
        const data = await response.json();
        setAddress(data.results[0]?.formatted || 'Address not found');
      } else {
        console.log('Error fetching address:', response.status);
      }
    } catch (error) {
      setError('Unable to fetch address');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !location || !injuryArea) {
      alert('Please fill out all required fields.');
      return;
    }

    const formData = {
      name,
      location,
      injuryArea,
      painLevel,
      message,
      address,
      timestamp: new Date(),
    };

    try {
      // Save the data to Firestore collection 'submissions'
      await addDoc(collection(db, 'submissions'), formData);
      alert('Data successfully saved to Firebase!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Emergency Assistance Form</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[19px] font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-[19px] font-medium mb-2">
              Location (Latitude, Longitude)
            </label>
            {location ? (
              <p className="text-[15px]">Latitude: {location.latitude}, Longitude: {location.longitude}</p>
            ) : (
              <p className="text-[15px]">Fetching your location...</p>
            )}
          </div>

          <div>
            <label className="block text-[19px] font-medium mb-2">
              Address
            </label>
            <p className="text-[15px]">{address || 'Fetching address...'}</p>
          </div>

          <div>
            <label htmlFor="injuryArea" className="block text-[19px] font-medium mb-2">
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
              <option value="Wrist">Wrist</option>
              <option value="Elbow">Elbow</option>
              <option value="Ankle">Ankle</option>
              <option value="Knee">Knee</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="painLevel" className="block text-[19px] font-medium mb-2">Pain Level</label>
            <label className="block text-[16px] mb-2">1 = No pain, 10 = Excruciating pain</label>
            <input
              type="range"
              id="painLevel"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
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
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-100"
              placeholder="Provide any additional information..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Save to Firestore
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
