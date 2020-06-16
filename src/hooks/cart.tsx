import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const listProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      if (listProducts) {
        setProducts([...JSON.parse(listProducts)]);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      setProducts(
        products.map(p =>
          p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      // TODO ADD A NEW ITEM TO THE CART
      const productExists = products.find(p => p.id === product.id);

      if (productExists) {
        increment(product.id);
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products, increment],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex >= 0) {
        if (products[productIndex].quantity === 1) {
          const filteredProducts = products.filter(p => p.id !== id);

          setProducts(filteredProducts);

          await AsyncStorage.setItem(
            '@GoMarketplace:products',
            JSON.stringify(filteredProducts),
          );
        } else {
          const updatedProducts = [...products];

          updatedProducts[productIndex].quantity -= 1;

          setProducts(updatedProducts);

          await AsyncStorage.setItem(
            '@GoMarketplace:products',
            JSON.stringify(updatedProducts),
          );
        }
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
