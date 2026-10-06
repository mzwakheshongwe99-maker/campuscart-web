import { ProductCategory } from '@/types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-all', name: 'All', slug: 'all', icon: '🔥', displayOrder: 0 },
  { id: 'cat-meals', name: 'Meals', slug: 'meals', icon: '🍔', displayOrder: 1 },
  { id: 'cat-fast-food', name: 'Fast Food', slug: 'fast-food', icon: '🍟', displayOrder: 2 },
  { id: 'cat-lunch', name: 'Lunch', slug: 'lunch', icon: '🥪', displayOrder: 3 },
  { id: 'cat-snacks', name: 'Snacks', slug: 'snacks', icon: '🍫', displayOrder: 4 },
  { id: 'cat-drinks', name: 'Drinks', slug: 'drinks', icon: '🥤', displayOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', icon: '🍰', displayOrder: 6 },
  { id: 'cat-noodles', name: 'Noodles', slug: 'noodles', icon: '🍜', displayOrder: 7 },
  { id: 'cat-coffee', name: 'Coffee & Tea', slug: 'coffee', icon: '☕', displayOrder: 8 },
];
