import React from "react";
import {
  Search,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";

const AuditLogFilters = ({
  search,
  setSearch,
  action,
  setAction,
  entityType,
  setEntityType,
  onClear,
}) => {
  const hasFilters =
    search || action || entityType;

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white">

      {/* Filter Header */}

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
            <Filter
              size={18}
              className="text-gray-600"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Filters
            </h2>

            <p className="text-xs text-gray-500">
              Search and filter audit activities
            </p>
          </div>

        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-red-500"
          >
            <X size={15} />
            Clear
          </button>
        )}

      </div>

      {/* Filters */}

      <div className="p-5">

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          {/* Search */}

          <div className="lg:col-span-6">

            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Search
            </label>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by action, description, actor..."
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#25D366]
                  focus:ring-2
                  focus:ring-[#25D366]/10
                "
              />

            </div>

          </div>

          {/* Action */}

          <div className="lg:col-span-3">

            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Action
            </label>

            <div className="relative">

              <select
                value={action}
                onChange={(e) =>
                  setAction(e.target.value)
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  pr-10
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#25D366]
                  focus:ring-2
                  focus:ring-[#25D366]/10
                "
              >

                <option value="">
                  All Actions
                </option>

                <option value="LOGIN_SUCCESS">
                  Login Success
                </option>

                <option value="LOGIN_FAILED">
                  Login Failed
                </option>

                <option value="PASSWORD_RESET_REQUESTED">
                  Password Reset Requested
                </option>

                <option value="PASSWORD_RESET">
                  Password Reset
                </option>

                <option value="COMPANY_CREATED">
                  Company Created
                </option>

                <option value="COMPANY_UPDATED">
                  Company Updated
                </option>

              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

            </div>

          </div>

          {/* Entity */}

          <div className="lg:col-span-3">

            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Entity
            </label>

            <div className="relative">

              <select
                value={entityType}
                onChange={(e) =>
                  setEntityType(e.target.value)
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  pr-10
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#25D366]
                  focus:ring-2
                  focus:ring-[#25D366]/10
                "
              >

                <option value="">
                  All Entities
                </option>

                <option value="AUTHENTICATION">
                  Authentication
                </option>

                <option value="COMPANY">
                  Company
                </option>

                <option value="SUPER_ADMIN">
                  Super Admin
                </option>

                <option value="EMPLOYEE">
                  Employee
                </option>

              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AuditLogFilters;