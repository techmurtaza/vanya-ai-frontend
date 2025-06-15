import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/config/api';
import { useSession } from '../context/SessionContext';

type SearchType = 'question' | 'flashcard'; // This may no longer be relevant

const search = async (query: string, sessionId: string) => {
  const { data } = await apiClient.get('/search', {
    params: { query, sessionId },
  });
  return data;
};

export const useSearch = (query: string) => {
  const { sessionId } = useSession();

  return useQuery({
    queryKey: ['search', query, sessionId],
    queryFn: () => search(query, sessionId!),
    enabled: !!query && !!sessionId, // Only run if query and sessionId exist
  });
}; 