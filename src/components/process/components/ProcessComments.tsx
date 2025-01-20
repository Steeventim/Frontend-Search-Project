import React from 'react';
import type { Comment } from '../../../types/process';

interface ProcessCommentsProps {
  comments: Comment[];
}

export const ProcessComments: React.FC<ProcessCommentsProps> = ({ comments }) => {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="text-sm bg-gray-50 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{comment.userName}</span>
            <span className="text-gray-500 text-xs">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};