import { useState, useCallback } from 'react';

export interface Annotation {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  type: 'highlight' | 'comment';
  text: string;
  comment?: string;
  position: {
    start: number;
    end: number;
  };
  timestamp: Date;
}

interface UseResumeAnnotationsOptions {
  documentId: string;
  currentUserId: string;
  currentUserName: string;
}

export const useResumeAnnotations = ({
  documentId,
  currentUserId,
  currentUserName,
}: UseResumeAnnotationsOptions) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'Sarah Johnson',
      userColor: '#3b82f6',
      type: 'highlight',
      text: 'Led team of 8 engineers',
      comment: 'Impressive leadership experience',
      position: { start: 150, end: 175 },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Mike Chen',
      userColor: '#10b981',
      type: 'highlight',
      text: 'Reduced deployment time by 70%',
      comment: 'Great impact on efficiency!',
      position: { start: 280, end: 310 },
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
  ]);

  const addAnnotation = useCallback(
    (
      type: 'highlight' | 'comment',
      text: string,
      position: { start: number; end: number },
      comment?: string
    ) => {
      const userColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const userColor = userColors[Math.floor(Math.random() * userColors.length)];

      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        userId: currentUserId,
        userName: currentUserName,
        userColor,
        type,
        text,
        comment,
        position,
        timestamp: new Date(),
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      return newAnnotation;
    },
    [currentUserId, currentUserName]
  );

  const removeAnnotation = useCallback((annotationId: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
  }, []);

  const updateAnnotation = useCallback((annotationId: string, comment: string) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === annotationId ? { ...a, comment } : a))
    );
  }, []);

  const getAnnotationsByUser = useCallback(
    (userId: string) => {
      return annotations.filter((a) => a.userId === userId);
    },
    [annotations]
  );

  return {
    annotations,
    addAnnotation,
    removeAnnotation,
    updateAnnotation,
    getAnnotationsByUser,
  };
};
