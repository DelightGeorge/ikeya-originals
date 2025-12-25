import { useState } from "react";
import Layout from "../../Shared/Layout/Layout";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react";
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
    category: "FASHION",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creates a temporary local preview
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please upload an image.");

    setLoading(true);

    // Using FormData to send file to Cloudinary via Backend
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("image", imageFile);
    console.log("File to upload:", imageFile);
    if (!imageFile) {
      alert("No image selected!");
      return;
    }

    try {
      await api.post("/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Check your connection or Admin status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Console
          </button>

          <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Image Upload Area (2/5 columns) */}
              <div className="md:col-span-2 bg-neutral-50 border-r border-neutral-100 p-8">
                <label className="text-[10px] uppercase font-bold tracking-widest block mb-4 text-neutral-500">
                  Product Visual
                </label>

                {previewUrl ? (
                  <div className="relative group aspect-[4/5] bg-white border border-neutral-200 overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center aspect-[4/5] border-2 border-dashed border-neutral-200 bg-white cursor-pointer hover:border-amber-900 transition-colors group"
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="text-center p-6">
                      <ImageIcon
                        className="mx-auto text-neutral-300 group-hover:text-amber-900 mb-2"
                        size={32}
                        strokeWidth={1}
                      />
                      <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                        Upload Image
                      </p>
                      <p className="text-[8px] text-neutral-300 mt-2 uppercase">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Form Content (3/5 columns) */}
              <div className="md:col-span-3 p-8 md:p-12">
                <header className="mb-10">
                  <h1 className="text-2xl font-display uppercase tracking-tighter font-bold">
                    List New <span className="text-amber-900 italic">Item</span>
                  </h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none transition text-sm"
                      placeholder="e.g. Signature Silk Kaftan"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest">
                        Category
                      </label>
                      <select
                        className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none transition text-sm bg-transparent"
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="FASHION">Fashion</option>
                        <option value="NATURALS">Naturals</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none transition text-sm"
                        placeholder="0.00"
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      required
                      className="w-full border border-neutral-100 p-3 focus:border-black outline-none transition text-sm font-light leading-relaxed"
                      placeholder="Describe the materials and craft..."
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <button
                    disabled={loading || success}
                    className="w-full bg-black text-white py-4 mt-4 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-amber-900 transition-all duration-500 flex items-center justify-center gap-3 disabled:bg-neutral-200"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : success ? (
                      <>
                        <Check size={16} /> Item Published
                      </>
                    ) : (
                      "Publish Product"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
