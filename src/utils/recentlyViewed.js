const STORAGE_KEY = "ikeya_recently_viewed";
const MAX_ITEMS = 8;
export const RECENTLY_VIEWED_EVENT = "recentlyViewedUpdated";

export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (product) => {
  if (!product?.id) return;
  try {
    const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
    const entry = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      type: product.type,
      stock: product.stock,
    };
    const updated = [entry, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT));
  } catch (error) {
    console.error("Error saving recently viewed:", error);
  }
};