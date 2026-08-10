import { useState, useEffect } from "react";
import Layout from "../../Shared/Layout/Layout";
import { ArrowLeft, Loader2, Check, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { updateProduct } from "../../services/productService";
import { PRODUCT_TYPES } from "../../constants/products";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    type: PRODUCT_TYPES.FASHION,
    category: "",
  });

  // Load the existing product so the form starts pre-filled
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price ? String(p.price / 100) : "",
          stock: typeof p.stock === "number" ? String(p.stock) : "0",
          type: p.type || PRODUCT_TYPES.FASHION,
          category: p.category?.name || "",
        });
        setExistingImageUrl(p.imageUrl || null);
      } catch (err) {
        console.error("Error loading product:", err);
        setLoadError(
          err?.response?.data?.message || "Could not load this product. Please go back and try again."
        );
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 5MB" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload a valid image file" });
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    if (formData.stock === "" || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price));
      data.append("stock", Number(formData.stock));
      data.append("type", formData.type);
      data.append("category", formData.category.trim());
      if (imageFile) {
        data.append("image", imageFile);
      }

      await updateProduct(id, data);
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 1200);
    } catch (err) {
      console.error("Update Product Error:", err);
      const errorMessage = err?.response?.data?.message || "Failed to update product. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center pt-32">
          <Loader2 className="animate-spin text-amber-900 mb-4" size={28} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
            Loading Product
          </p>
        </div>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 text-center">
          <AlertCircle size={28} className="text-red-500 mb-4" />
          <p className="text-sm text-red-600 mb-6">{loadError}</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const displayImage = previewUrl || existingImageUrl;

  return (
    <Layout>
      <div className="min-h-screen pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-xs text-neutral-500 mb-6 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div className="grid md:grid-cols-5 border bg-white">
            {/* Image Section */}
            <div className="md:col-span-2 p-6 bg-neutral-50">
              {displayImage ? (
                <div className="relative aspect-[3/4]">
                  <img
                    src={displayImage}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black text-white p-2 hover:bg-red-600 transition-colors"
                      title="Cancel new image, keep current"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <label className="absolute bottom-2 left-2 right-2 bg-white/95 text-black py-2 text-center text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white transition-colors">
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    {previewUrl ? "Choose Different Image" : "Replace Image"}
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 aspect-[3/4] cursor-pointer hover:border-amber-800 transition-colors">
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  <ImageIcon size={32} className="text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-600 uppercase tracking-widest">Upload Image</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Max 5MB</p>
                </label>
              )}
              {errors.image && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.image}
                </p>
              )}
            </div>

            {/* Form Section */}
            <div className="md:col-span-3 p-8">
              <h2 className="text-2xl font-display font-bold mb-6 uppercase tracking-tight">
                Edit Product
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <input
                    required
                    placeholder="Product Name"
                    value={formData.name}
                    className={`w-full border-b p-2 focus:border-amber-800 outline-none transition-colors ${
                      errors.name ? "border-red-500" : "border-neutral-300"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: null });
                    }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <input
                    required
                    placeholder="Category (e.g. Kaftans, Hair Oil)"
                    value={formData.category}
                    className={`w-full border-b p-2 focus:border-amber-800 outline-none transition-colors ${
                      errors.category ? "border-red-500" : "border-neutral-300"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setErrors({ ...errors, category: null });
                    }}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.category}
                    </p>
                  )}
                </div>

                {/* Product Type */}
                <div>
                  <select
                    className="w-full border-b border-neutral-300 p-2 focus:border-amber-800 outline-none transition-colors"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value={PRODUCT_TYPES.FASHION}>Fashion</option>
                    <option value={PRODUCT_TYPES.BEAUTY}>Beauty</option>
                  </select>
                </div>

                {/* Price + Stock side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      placeholder="Price (₦)"
                      value={formData.price}
                      className={`w-full border-b p-2 focus:border-amber-800 outline-none transition-colors ${
                        errors.price ? "border-red-500" : "border-neutral-300"
                      }`}
                      onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        setErrors({ ...errors, price: null });
                      }}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Stock Quantity"
                      value={formData.stock}
                      className={`w-full border-b p-2 focus:border-amber-800 outline-none transition-colors ${
                        errors.stock ? "border-red-500" : "border-neutral-300"
                      }`}
                      onChange={(e) => {
                        setFormData({ ...formData, stock: e.target.value });
                        setErrors({ ...errors, stock: null });
                      }}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <textarea
                    required
                    placeholder="Product Description"
                    value={formData.description}
                    rows={4}
                    className={`w-full border p-3 focus:border-amber-800 outline-none transition-colors resize-none ${
                      errors.description ? "border-red-500" : "border-neutral-300"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setErrors({ ...errors, description: null });
                    }}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded">
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle size={16} /> {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-amber-800 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Saving Changes...
                    </span>
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={16} /> Saved Successfully
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;