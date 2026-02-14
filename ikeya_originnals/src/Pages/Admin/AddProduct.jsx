import { useState } from "react";
import Layout from "../../Shared/Layout/Layout";
import { ArrowLeft, Loader2, Check, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { PRODUCT_TYPES } from "../../constants/products";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: PRODUCT_TYPES.FASHION,
    category: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 5MB" });
        return;
      }
      
      // Validate file type
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
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!imageFile) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price));
      data.append("type", formData.type);
      data.append("category", formData.category.trim());
      data.append("image", imageFile);

      await api.post("/products/add", data);
      setSuccess(true);

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error("Add Product Error:", err);
      const errorMessage = err?.response?.data?.message || "Failed to add product. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-xs text-neutral-500 mb-6 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div className="grid md:grid-cols-5 border bg-white">
            {/* Image Upload Section */}
            <div className="md:col-span-2 p-6 bg-neutral-50">
              {previewUrl ? (
                <div className="relative aspect-[3/4]">
                  <img 
                    src={previewUrl} 
                    alt="Product preview"
                    className="w-full h-full object-cover" 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black text-white p-2 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 aspect-[3/4] cursor-pointer hover:border-amber-800 transition-colors">
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                  <ImageIcon size={32} className="text-neutral-400 mb-2" />
                  <p className="text-xs text-neutral-600 uppercase tracking-widest">
                    Upload Image
                  </p>
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
                Add New Product
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

                {/* Price */}
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
                      <Loader2 className="animate-spin" size={16} /> Publishing...
                    </span>
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={16} /> Published Successfully
                    </span>
                  ) : (
                    "Publish Product"
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

export default AddProduct;
