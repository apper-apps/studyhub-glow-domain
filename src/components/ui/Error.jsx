import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Error icon with gradient background */}
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
        </div>
        
        {/* Error message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {/* Retry button */}
        {onRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onRetry} variant="primary" className="gap-2">
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>
        )}
        
        {/* Support message */}
        <p className="text-sm text-gray-500">
          If this problem persists, please check your internet connection or try refreshing the page.
        </p>
      </div>
    </div>
  );
};

export default Error;