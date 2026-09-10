
import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";

export default function TestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  testimonial,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    designation: "",
    companyName: "",
    content: "",
    rating: 5,
    status: "DRAFT",
    displayOrder: 0,
    isFeatured: false,
  });

  // ================================
  // Load data when editing
  // ================================
  useEffect(() => {
    if (testimonial) {
      setFormData({
        customerName: testimonial.customerName || "",
        designation: testimonial.designation || "",
        companyName: testimonial.companyName || "",
        content: testimonial.content || "",
        rating: testimonial.rating || 5,
        status: testimonial.status || "DRAFT",
        displayOrder: testimonial.displayOrder || 0,
        isFeatured: testimonial.isFeatured || false,
      });
    } else {
      setFormData({
        customerName: "",
        designation: "",
        companyName: "",
        content: "",
        rating: 5,
        status: "DRAFT",
        displayOrder: 0,
        isFeatured: false,
      });
    }
  }, [testimonial, isOpen]);

  if (!isOpen) return null;

  // ================================
  // Handle input
  // ================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================================
  // Handle rating
  // ================================
  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // ================================
  // Submit
  // ================================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      rating: Number(formData.rating),
      displayOrder: Number(formData.displayOrder),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* ================================
            Header
        ================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {testimonial
                ? "Edit Testimonial"
                : "Add Testimonial"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {testimonial
                ? "Update customer testimonial details."
                : "Add a customer testimonial to your landing page."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================================
            Form
        ================================= */}
        <form onSubmit={handleSubmit}>

          <div className="p-6 space-y-5">

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Designation + Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Marketing Manager"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Customer Review <span className="text-red-500">*</span>
              </label>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter customer testimonial..."
                rows={5}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>

              <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      size={24}
                      className={
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }
                    />
                  </button>
                ))}

                <span className="ml-2 text-sm text-gray-500">
                  {formData.rating}/5
                </span>

              </div>
            </div>

            {/* Status + Display Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="HIDDEN">
                    Hidden
                  </option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-green-500"
              />

              <label
                htmlFor="isFeatured"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Mark as featured testimonial
              </label>

            </div>

          </div>

          {/* ================================
              Footer
          ================================= */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#25D366" }}
            >
              {loading
                ? "Saving..."
                : testimonial
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
