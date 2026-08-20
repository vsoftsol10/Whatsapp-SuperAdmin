import { useEffect, useRef } from "react";
import { Eye, Pencil, Power, Trash2 } from "lucide-react";

export default function CompanyActionMenu({
  company,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onClose,
  isLastRow = false
}) {

  const menuRef = useRef(null);

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, [onClose]);

  const handleClick = (callback) => (e) => {

    e.stopPropagation();

    callback(company);

    onClose();

  };

  return (

    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className={`absolute right-0 z-[9999] w-56 rounded-xl border border-gray-200 bg-white shadow-2xl ${
        isLastRow
          ? "bottom-full mb-2"
          : "top-full mt-2"
      }`}
    >

      <button
        onClick={handleClick(onView)}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Eye size={18} />
        View
      </button>

      <button
        onClick={handleClick(onEdit)}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Pencil size={18} />
        Edit
      </button>

      <button
        onClick={handleClick(onDelete)}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
        Delete
      </button>

    </div>

  );

}