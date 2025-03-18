'use client';

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '@/firebaseConfig'; // Make sure this is correctly set up

const db = getFirestore(firebaseApp); // Initialize Firestore

interface Location {
  latitude: number;
  longitude: number;
}

interface Submission {
  name: string;
  location: Location;
  injuryArea: string;
  painLevel: number;
  message: string;
  address: string;
  timestamp: any;
}

export default function DoctorPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'submissions'));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setSubmission({
            name: docData.name,
            location: docData.location,
            injuryArea: docData.injuryArea,
            painLevel: docData.painLevel,
            message: docData.message,
            address: docData.address,
            timestamp: docData.timestamp.toDate(), // Convert timestamp to a JavaScript Date object
          });
        }
      } catch (error) {
        setError('Failed to load data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white text-black p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Patient Submission Details</h1>

        {loading && <p className="text-center text-xl">Loading...</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {!submission ? (
          <p className="text-center text-lg">No submission available.</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Name</div>
              <div className="text-lg font-semibold">{submission.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Location</div>
              <div className="text-lg">{`Lat: ${submission.location.latitude}, Lon: ${submission.location.longitude}`}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Injury Area</div>
              <div className="text-lg">{submission.injuryArea}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Pain Level</div>
              <div className="text-lg">{submission.painLevel}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Message</div>
              <div className="text-lg">{submission.message}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Address</div>
              <div className="text-lg">{submission.address}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Timestamp</div>
              <div className="text-lg">{submission.timestamp.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
