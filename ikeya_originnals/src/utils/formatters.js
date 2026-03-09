/**
 * Format price from kobo (smallest currency unit) to Nigerian Naira
 * @param {number} priceInKobo - Price in kobo (1 Naira = 100 kobo)
 * @returns {string} Formatted price string (e.g., "₦5,000")
 */
export const formatPrice = (priceInKobo) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(priceInKobo / 100);
};
