import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <p className="text-2xl md:text-3xl font-light text-gray-800 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-4 mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link 
          to="/"
          className="btn-primary px-8 py-3 text-lg"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}