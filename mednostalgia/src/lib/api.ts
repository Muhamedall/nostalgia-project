import { Product } from '@/types';

// Mock data for demonstration
const products: Product[] = [
  {
    id: '1',
    name: 'Running Shoes',
    price: 120,
    category: 'shoes',
    size: 'M',
    image: '/shoes.jpg',
    description: 'Comfortable running shoes for all terrains.',
  },
  {
    id: '2',
    name: 'Casual Shirt',
    price: 50,
    category: 'clothing',
    size: 'L',
    image: '/shirt.jpg',
    description: 'A stylish casual shirt for everyday wear.',
  },
  {
    id: '3',
    name: 'Formal Shoes',
    price: 150,
    category: 'shoes',
    size: 'S',
    image: '/formal-shoes.jpg',
    description: 'Elegant formal shoes for special occasions.',
  },
];

// Fetch all products (used in the search results page)
export async function fetchProducts({ category, price, size }: FetchProductsParams): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (size && product.size !== size) return false;
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });
}

// Fetch a single product by ID (used in the product details page)
export async function fetchProductById(id: string): Promise<Product | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  return products.find((product) => product.id === id);
}