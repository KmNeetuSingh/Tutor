import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export const RequestItem = ({
  request,
  onAction,
  actionText = 'View Details',
  className = '',
  ...props
}) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      applied: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  return (
    <Card className={`mb-4 ${className}`} {...props}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{request.subject}</h3>
          <p className="mt-1 text-sm text-gray-500">{request.description}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
        </div>
        {onAction && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAction(request)}
          >
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RequestItem; 