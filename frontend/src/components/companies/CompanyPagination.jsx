import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CompanyPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem =
    (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Showing text */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-700">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-700">
          {totalItems}
        </span>{" "}
        companies
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">

        {/* Previous */}
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (

            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                currentPage === page
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>

          ))}

        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={17} />
        </button>

      </div>

    </div>
  );
}