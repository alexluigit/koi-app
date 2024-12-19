import type { CategoryItem } from '@/types/home';

export const mockCategoryItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Category ${i + 1}`,
  icon: '/static/images/rice.png',
})) as CategoryItem[];
