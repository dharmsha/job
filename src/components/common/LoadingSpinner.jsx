'use client';

const LoadingSpinner = ({ message = "Loading...", fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Spinner */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          
          {/* Message */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
          
          {/* Loading dots */}
          <div className="flex space-x-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-4">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;