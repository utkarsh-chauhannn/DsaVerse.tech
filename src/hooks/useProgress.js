import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProgress, updateAlgorithmProgress, updateDataStructureProgress, markAsLearned, addTimeSpent } from '../services/progressService';

export const useProgress = () => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    } else {
      setProgress(null);
      setLoading(false);
    }
  }, [currentUser]);

  const loadProgress = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getUserProgress(currentUser.uid);
      setProgress(data || {
        algorithms: {},
        dataStructures: {},
        totalTimeSpent: 0,
        achievements: []
      });
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress({
        algorithms: {},
        dataStructures: {},
        totalTimeSpent: 0,
        achievements: []
      });
    } finally {
      setLoading(false);
    }
  };

  const trackAlgorithmView = async (algorithmName) => {
    if (!currentUser) return;
    await updateAlgorithmProgress(currentUser.uid, algorithmName, {
      viewed: true,
      viewCount: (progress?.algorithms?.[algorithmName]?.viewCount || 0) + 1
    });
    loadProgress();
  };

  const trackDataStructureView = async (dsName) => {
    if (!currentUser) return;
    await updateDataStructureProgress(currentUser.uid, dsName, {
      viewed: true,
      viewCount: (progress?.dataStructures?.[dsName]?.viewCount || 0) + 1
    });
    loadProgress();
  };

  const markTopicAsLearned = async (topicType, topicName) => {
    if (!currentUser) return;
    try {
      await markAsLearned(currentUser.uid, topicType, topicName);
      await loadProgress();
    } catch (error) {
      console.error('Error marking topic as learned:', error);
      alert('Failed to mark as learned. Please check the console for details.');
    }
  };

  const trackTime = async (seconds) => {
    if (!currentUser) return;
    await addTimeSpent(currentUser.uid, seconds);
    loadProgress();
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    const totalTopics = 14 + 5; // 14 algorithms + 5 data structures
    const learnedTopics = Object.values(progress.algorithms || {})
      .filter(a => a.understood).length +
      Object.values(progress.dataStructures || {})
      .filter(ds => ds.understood).length;
    return Math.round((learnedTopics / totalTopics) * 100);
  };

  return {
    progress,
    loading,
    trackAlgorithmView,
    trackDataStructureView,
    markTopicAsLearned,
    trackTime,
    getProgressPercentage,
    refresh: loadProgress
  };
};

