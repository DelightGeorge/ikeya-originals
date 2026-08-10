import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Shared/Layout/Layout";
import {
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
} from "lucide-react";
import {
  getHeroImages,
  addHeroImage,
  deleteHeroImage,
  reorderHeroImage,
} from "../../services/heroImageService";

const HeroImages = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [busyId, setBusyId] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getHeroImages();
      const data = Array.isArray(res.data) ? res.data : [];
      setImages(data);
    } catch (err) {
      console.error("Fetch hero images error:", err);
      setError("Unable to load slider images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  };

  const clearSelection = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setUploadError("Please choose an image first");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const data = new FormData();
      data.append("image", imageFile);
      const res = await addHeroImage(data);
      setImages((prev) => [...prev, res.data]);
      clearSelection();
    } catch (err) {
      console.error("Upload hero image error:", err);
      setUploadError(err?.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this image from the homepage slider?")) return;
    setBusyId(id);
    try {
      await deleteHeroImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Delete hero image error:", err);
      alert(err?.response?.data?.message || "Failed to delete image.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReorder = async (id, direction) => {
    setBusyId(id);
    try {
      await reorderHeroImage(id, direction);
      await fetchImages();
    } catch (err) {
      console.error("Reorder hero image error:", err);
      alert(err?.response?.data?.message || "Failed to reorder image.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 px-6 pb-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-xs text-neutral-500 mb-6 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-tighter text-black font-bold">
              Homepage <span className="text-amber-900 italic">Slider</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2">
              Manage the images that rotate on your homepage hero
            </p>
          </div>

          {/* Upload panel */}
          <div className="bg-white border border-neutral-100 shadow-sm p-8 mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <UploadCloud size={14} /> Add New Slide
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-56 flex-shrink-0">
                {previewUrl ? (
                  <div className="relative aspect-video bg-neutral-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 aspect-video cursor-pointer hover:border-amber-800 transition-colors">
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    <ImageIcon size={24} className="text-neutral-400 mb-2" />
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest">Choose Image</p>
                    <p className="text-[9px] text-neutral-400 mt-1">Max 5MB</p>
                  </label>
                )}
              </div>

              <div className="flex-1 w-full">
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  For best results, use a tall portrait photo (similar to your product shots).
                  It'll display full-bleed on phones, and letterboxed with a blurred backdrop on
                  larger screens.
                </p>
                {uploadError && (
                  <p className="text-red-500 text-xs mb-4 flex items-center gap-1">
                    <AlertCircle size={12} /> {uploadError}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || !imageFile}
                    className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-800 transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      "Add To Slider"
                    )}
                  </button>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="border border-neutral-200 text-neutral-500 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current slides */}
          <div className="bg-white border border-neutral-100 shadow-sm p-8">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6">
              Current Slides {!loading && `(${images.length})`}
            </h3>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-amber-900" size={24} />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-sm text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchImages}
                  className="text-amber-800 text-xs uppercase tracking-widest font-bold hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[10px] uppercase tracking-widest text-neutral-300 italic">
                  No slides uploaded yet. The homepage is showing default images until you add some.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, index) => (
                  <div key={img.id} className="border border-neutral-100 group">
                    <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                      <img src={img.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                        Slide {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(img.id, "up")}
                          disabled={busyId === img.id || index === 0}
                          className="text-neutral-400 hover:text-black transition-colors p-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move earlier"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleReorder(img.id, "down")}
                          disabled={busyId === img.id || index === images.length - 1}
                          className="text-neutral-400 hover:text-black transition-colors p-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move later"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={busyId === img.id}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1.5 disabled:opacity-50"
                        title="Remove slide"
                      >
                        {busyId === img.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HeroImages;