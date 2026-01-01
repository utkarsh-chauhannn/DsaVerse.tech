import React, { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import './MarkAsLearned.css';

const MarkAsLearned = ({ topicType, topicName }) => {
  const { currentUser } = useAuth();
  const { progress, markTopicAsLearned } = useProgress();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!currentUser) return null;

  const isLearned = progress?.[topicType]?.[topicName]?.understood || false;

  const handleClick = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await markTopicAsLearned(topicType, topicName);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`mark-learned-btn ${isLearned ? 'learned' : ''}`}
      title={isLearned ? 'Mark as not learned' : 'Mark this topic as learned'}
      disabled={isUpdating}
    >
      {isUpdating ? 'Updating...' : (isLearned ? '✓ Learned' : 'Mark as Learned')}
    </button>
  );
};

export default MarkAsLearned;

