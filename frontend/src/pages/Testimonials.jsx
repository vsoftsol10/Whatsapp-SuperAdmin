
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";

import TestimonialModal from "../components/testimonial/TestimonialModal";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);

  // 3-dot menu
  const [openMenu, setOpenMenu] = useState(null);

  // ================================
  // Fetch Testimonials
  // ================================
  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch testimonials"
        );
      }

      setTestimonials(data);
    } catch (error) {
      console.error("Fetch testimonials error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Initial Load
  // ================================
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ================================
  // Open Add Modal
  // ================================
  const handleAdd = () => {
    setSelectedTestimonial(null);
    setOpenMenu(null);
    setIsModalOpen(true);
  };

  // ================================
  // Open Edit Modal
  // ================================
  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setOpenMenu(null);
    setIsModalOpen(true);
  };

  // ================================
  // Close Modal
  // ================================
  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  // ================================
  // Add / Update Testimonial
  // ================================
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const isEditing = Boolean(selectedTestimonial);

      const url = isEditing
        ? `${API_URL}/testimonials/${selectedTestimonial.id}`
        : `${API_URL}/testimonials`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } testimonial`
        );
      }

      // Close modal
      setIsModalOpen(false);
      setSelectedTestimonial(null);

      // Refresh list
      await fetchTestimonials();

    } catch (error) {
      console.error(
        isEditing
          ? "Update testimonial error:"
          : "Create testimonial error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // Delete Testimonial
  // ================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete testimonial"
        );
      }

      setOpenMenu(null);

      await fetchTestimonials();

    } catch (error) {
      console.error("Delete testimonial error:", error);
      alert(error.message);
    }
  };

  // ================================
  // Publish / Hide Testimonial
  // ================================
  const handleToggleStatus = async (testimonial) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus =
        testimonial.status === "PUBLISHED"
          ? "HIDDEN"
          : "PUBLISHED";

      const response = await fetch(
        `${API_URL}/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName: testimonial.customerName,
            designation: testimonial.designation,
            companyName: testimonial.companyName,
            content: testimonial.content,
            rating: testimonial.rating,
            status: newStatus,
            displayOrder: testimonial.displayOrder,
            isFeatured: testimonial.isFeatured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update testimonial status"
        );
      }

      setOpenMenu(null);

      await fetchTestimonials();

    } catch (error) {
      console.error(
        "Toggle testimonial status error:",
        error
      );

      alert(error.message);
    }
  };

  // ================================
  // Status Badge
  // ================================
  const getStatusClasses = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "HIDDEN":
        return "bg-gray-100 text-gray-700";

      case "DRAFT":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ================================
  // Rating Stars
  // ================================
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading testimonials...
        </p>
      </div>
    );
  }

  // ================================
  // Page
  // ================================
  return (
    <div
      className="p-6 space-y-6"
      onClick={() => setOpenMenu(null)}
    >

      {/* ================================
          Page Header
      ================================= */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Testimonials
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage customer testimonials displayed on the
            landing page.
          </p>
        </div>

        {/* Add Testimonial */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          <Plus size={18} />
          Add Testimonial
        </button>

      </div>

      {/* ================================
          Testimonials Table
      ================================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Company
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Review
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Rating
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Order
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody>

              {testimonials.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >

                    <div className="text-gray-500">

                      <p className="font-medium">
                        No testimonials found
                      </p>

                      <p className="text-sm mt-1">
                        Add your first customer testimonial.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                testimonials.map((testimonial) => (

                  <tr
                    key={testimonial.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    {/* Customer */}
                    <td className="px-6 py-4">

                      <div>

                        <p className="font-medium text-gray-800">
                          {testimonial.customerName}
                        </p>

                        {testimonial.designation && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {testimonial.designation}
                          </p>
                        )}

                      </div>

                    </td>

                    {/* Company */}
                    <td className="px-6 py-4">

                      <span className="text-sm text-gray-700">
                        {testimonial.companyName || "-"}
                      </span>

                    </td>

                    {/* Review */}
                    <td className="px-6 py-4 max-w-xs">

                      <p
                        className="text-sm text-gray-600 line-clamp-2"
                        title={testimonial.content}
                      >
                        {testimonial.content}
                      </p>

                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">

                      {renderStars(testimonial.rating)}

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                          testimonial.status
                        )}`}
                      >
                        {testimonial.status}
                      </span>

                    </td>

                    {/* Order */}
                    <td className="px-6 py-4">

                      <span className="text-sm text-gray-700">
                        {testimonial.displayOrder}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="relative flex justify-end">

                        {/* 3 Dot Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              openMenu === testimonial.id
                                ? null
                                : testimonial.id
                            );
                          }}
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                          title="More actions"
                        >
                          <MoreVertical size={19} />
                        </button>

                        {/* Dropdown */}
                        {openMenu === testimonial.id && (

                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-10 z-50 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                          >

                            {/* Edit */}
                            <button
                              onClick={() =>
                                handleEdit(testimonial)
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>

                            {/* Publish / Hide */}
                            <button
                              onClick={() =>
                                handleToggleStatus(testimonial)
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >

                              {testimonial.status === "PUBLISHED" ? (
                                <>
                                  <EyeOff size={16} />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye size={16} />
                                  Publish
                                </>
                              )}

                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(testimonial.id)
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================
          Add / Edit Modal
      ================================= */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        testimonial={selectedTestimonial}
        loading={saving}
      />

    </div>
  );
}

