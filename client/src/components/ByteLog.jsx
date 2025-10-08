import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from './common/LoadingSpinner';

const ByteLog = () => {
  // Hardcoded ByteLog issues
  const hardcodedBytelogs = [
    {
      id: 1,
      title: 'ByteLog - Issue 1',
      date: '2025-05-06',
      thumbnail: '/Bytelog thumbnail/The Bytelog.png',
      downloadUrl: '/Bytelog/The Bytelog_20250506_171940_0000.pdf'
    }
  ];

  const [bytelogs, setBytelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBytelogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/bytelogs/list');
        if (response.data.success) {
          // Combine hardcoded and API bytelogs
          setBytelogs([...hardcodedBytelogs, ...response.data.data]);
        } else {
          // Use only hardcoded if API fails
          setBytelogs(hardcodedBytelogs);
        }
      } catch (err) {
        console.error('Error fetching bytelogs:', err);
        // Use hardcoded bytelogs as fallback
        setBytelogs(hardcodedBytelogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBytelogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ByteLog Newsletters
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            ByteLog is our monthly newsletter released by ByteZen to keep you updated with recent technologies and the tech world.
          </p>
          <p className="mt-2 text-base text-gray-600">
            Download our newsletters to stay informed about the latest news, events, and innovations.
          </p>
        </div>

        {bytelogs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no newsletters available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bytelogs.map((bytelog) => (
              <div
                key={bytelog.id}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex-shrink-0 h-96 overflow-hidden bg-gray-200">
                  <img
                    className="w-full h-full object-contain"
                    src={bytelog.thumbnail}
                    alt={`${bytelog.title} thumbnail`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Thumbnail+Not+Available';
                    }}
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600">
                        {formatDate(bytelog.date)}
                      </p>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                      {bytelog.title}
                    </h3>
                  </div>
                  <div className="mt-6">
                    <a
                      href={bytelog.downloadUrl}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      download
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ByteLog;
