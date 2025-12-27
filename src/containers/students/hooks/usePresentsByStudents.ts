import { useEffect, useState, useCallback } from 'react';
import { getPresentsStudent, ReportPresent } from '../services/studentService';

export function usePresentsByStudents(studentId: number) {
  const [presents, setPresents] = useState<ReportPresent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPresents = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const data = await getPresentsStudent(studentId);
      console.log('Presents fetched:', data); // <- para debug
      setPresents(data);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching presents:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPresents();
  }, [fetchPresents]);

  const reload = () => {
    fetchPresents();
  };

  return { presents, loading, error, reload };
}
