import api from "./api";

export const getHeroImages = () => api.get("/hero-images");
export const addHeroImage = (formData) => api.post("/hero-images", formData);
export const deleteHeroImage = (id) => api.delete(`/hero-images/${id}`);
export const reorderHeroImage = (id, direction) =>
  api.patch(`/hero-images/${id}/reorder`, { direction });