
import React from 'react';
import { Loader2 } from './Icons';

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={48} className="text-amber-500 animate-spin mx-auto mb-4" />
        <p className="text-white text-xl">Loading Store...</p>
      </div>
    </div>
  );
};

export default Loader;
