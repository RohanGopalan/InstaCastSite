// pages/index.js (Next.js)
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
      <h1 className="text-[40px] font-semibold mb-12 text-center">InstaCast Emergency Site</h1>
      
      <div className="flex flex-col items-center justify-center space-y-6 w-full">
        <Link href="/patients" className="w-full">
          <button className="w-full text-center py-5 bg-blue-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            For Patients
          </button>
        </Link>

        <Link href="/doctors" className="w-full">
          <button className="w-full text-center py-5 bg-green-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
            For Doctors
          </button>
        </Link>
      </div>
    </div>
  );
}
