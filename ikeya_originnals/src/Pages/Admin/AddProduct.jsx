import { useState } from "react";
import Layout from "../../Shared/Layout/Layout";
import { ArrowLeft, Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "FASHION",
    category: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      return alert("Please fill in all fields");
    }
    if (!imageFile) return alert("Please upload an image");

    const parsedPrice = Number(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return alert("Invalid price");
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", parsedPrice); // send as number
      data.append("type", formData.type);
      data.append("category", formData.category);
      data.append("image", imageFile);

      await api.post("/products/add", data); // backend endpoint
      setSuccess(true);

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error("Add Product Error:", err);
      alert(err?.response?.data?.message || "Failed to add product");
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
            className="flex items-center gap-2 text-xs text-neutral-500 mb-6"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="grid md:grid-cols-5 border bg-white">
            <div className="md:col-span-2 p-6 bg-neutral-50">
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} className="w-full h-full object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black text-white p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed h-full cursor-pointer">
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  <ImageIcon size={32} />
                  <p className="text-xs mt-2">Upload Image</p>
                </label>
              )}
            </div>

            <div className="md:col-span-3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  required
                  placeholder="Product Name"
                  className="w-full border-b p-2"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  required
                  placeholder="Category (e.g. Kaftans)"
                  className="w-full border-b p-2"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <select
                  className="w-full border-b p-2"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="FASHION">Fashion</option>
                  <option value="BEAUTY">Beauty</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Price (₦)"
                  className="w-full border-b p-2"
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <textarea
                  required
                  placeholder="Description"
                  className="w-full border p-3"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <button
                  disabled={loading || success}
                  className="w-full bg-black text-white py-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={16} /> Published
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
