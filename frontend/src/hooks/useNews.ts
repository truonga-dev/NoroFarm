import { useQuery } from '@tanstack/react-query';
import { newsService } from '../api/services/news.service';

export const useNews = () => {
  const useArticles = (params?: any) => {
    return useQuery({
      queryKey: ['news-articles', params],
      queryFn: () => newsService.getArticles(params),
    });
  };

  const useCategories = () => {
    return useQuery({
      queryKey: ['news-categories'],
      queryFn: () => newsService.getCategories(),
    });
  };

  const useTags = () => {
    return useQuery({
      queryKey: ['news-tags'],
      queryFn: () => newsService.getTags(),
    });
  };

  const useArticle = (slug: string) => {
    return useQuery({
      queryKey: ['news-article', slug],
      queryFn: () => newsService.getArticle(slug),
      enabled: !!slug,
    });
  };

  return {
    useArticles,
    useCategories,
    useTags,
    useArticle,
  };
};
