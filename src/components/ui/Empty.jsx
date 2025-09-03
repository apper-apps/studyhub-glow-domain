import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  icon = "Plus",
  action,
  actionText = "Add New"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Empty state icon with gradient background */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-12 h-12 text-indigo-400" />
        </div>
        
        {/* Empty state content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        
        {/* Action button */}
        {action && (
          <Button onClick={action} variant="primary" size="lg" className="gap-2">
            <ApperIcon name={icon} className="w-4 h-4" />
            {actionText}
          </Button>
        )}
        
        {/* Motivational message */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-indigo-700 font-medium">
            ✨ Stay organized and never miss a deadline
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empty;