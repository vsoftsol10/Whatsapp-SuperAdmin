import { useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";

import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";

const countries = getCountries();

const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const NAME_REGEX = /^[A-Za-z\s.'-]+$/;

const VALID_PLANS = [
  "Trial",
  "Starter",
  "Professional",
  "Enterprise",
];

const VALID_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
];

export default function EditCompanyModal({
  open,
  company,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    countryCode: "IN",
    phone: "",
    address: "",
    plan: "Trial",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // =========================================================
  // LOAD COMPANY DATA
  // =========================================================

  useEffect(() => {
    if (!open || !company) return;

    let countryCode = company.countryCode || "IN";
    let phone = company.phone || "";

    /*
      If backend already stores:

      phone = +919876543210

      we separate the country code and phone number
      for the frontend.
    */

    if (phone.startsWith("+")) {
      try {
        const matchedCountry = countries.find((country) => {
          const callingCode = getCountryCallingCode(country);

          return phone.startsWith(`+${callingCode}`);
        });

        if (matchedCountry) {
          countryCode = matchedCountry;

          const callingCode =
            getCountryCallingCode(matchedCountry);

          phone = phone
            .replace(`+${callingCode}`, "")
            .replace(/\D/g, "");
        }
      } catch (error) {
        console.error("Failed to parse phone number:", error);
      }
    } else {
      phone = phone.replace(/\D/g, "");
    }

    setForm({
      companyName: company.companyName || "",
      ownerName: company.ownerName || "",
      email: company.email || "",
      countryCode,
      phone,
      address: company.address || "",
      plan: company.plan || "Trial",
      status: company.status || "ACTIVE",
    });

    setErrors({});
    setSubmitError("");
    setCountryOpen(false);
    setCountrySearch("");
  }, [open, company]);

  // =========================================================
  // FIELD VALIDATORS
  // =========================================================

  const validateCompanyName = (value) => {
    const v = value.trim();

    if (!v) {
      return "Company name is required";
    }

    if (v.length < 2) {
      return "Company name must be at least 2 characters";
    }

    if (v.length > 100) {
      return "Company name must not exceed 100 characters";
    }

    return "";
  };

  const validateOwnerName = (value) => {
    const v = value.trim();

    if (!v) {
      return "Owner name is required";
    }

    if (v.length < 2) {
      return "Owner name must be at least 2 characters";
    }

    if (v.length > 100) {
      return "Owner name must not exceed 100 characters";
    }

    if (!NAME_REGEX.test(v)) {
      return "Owner name can contain only letters, spaces, dots, apostrophes and hyphens";
    }

    return "";
  };

  const validateEmail = (value) => {
    const v = value.trim();

    if (!v) {
      return "Email address is required";
    }

    if (v.length > 254) {
      return "Email address is too long";
    }

    if (!EMAIL_REGEX.test(v)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const validatePhone = (value, countryCode) => {
    if (!value) {
      return "Phone number is required";
    }

    try {
      const fullPhoneNumber =
        `+${getCountryCallingCode(countryCode)}${value}`;

      if (!isValidPhoneNumber(fullPhoneNumber)) {
        return "Please enter a valid phone number";
      }
    } catch (error) {
      return "Please enter a valid phone number";
    }

    return "";
  };

  const validateAddress = (value) => {
    const v = value.trim();

    if (!v) {
      return "Address is required";
    }

    if (v.length < 5) {
      return "Address must be at least 5 characters";
    }

    if (v.length > 250) {
      return "Address must not exceed 250 characters";
    }

    return "";
  };

  const validatePlan = (value) => {
    return VALID_PLANS.includes(value)
      ? ""
      : "Invalid subscription plan";
  };

  const validateStatus = (value) => {
    return VALID_STATUSES.includes(value)
      ? ""
      : "Invalid company status";
  };

  // =========================================================
  // VALIDATE ALL FIELDS
  // =========================================================

  const validateAll = (values) => {
    const newErrors = {
      companyName: validateCompanyName(values.companyName),
      ownerName: validateOwnerName(values.ownerName),
      email: validateEmail(values.email),
      phone: validatePhone(
        values.phone,
        values.countryCode
      ),
      address: validateAddress(values.address),
      plan: validatePlan(values.plan),
      status: validateStatus(values.status),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    return newErrors;
  };

  // =========================================================
  // INDIVIDUAL VALIDATORS FOR BLUR
  // =========================================================

  const validators = {
    companyName: validateCompanyName,
    ownerName: validateOwnerName,
    email: validateEmail,
    address: validateAddress,
    plan: validatePlan,
    status: validateStatus,
  };

  // =========================================================
  // ERROR HANDLER
  // =========================================================

  const setFieldError = (name, message) => {
    setErrors((prev) => {
      const next = { ...prev };

      if (message) {
        next[name] = message;
      } else {
        delete next[name];
      }

      return next;
    });
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while user is correcting the field
    setFieldError(name, "");

    // Remove general backend error
    setSubmitError("");
  };

  // =========================================================
  // BLUR
  // =========================================================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const validator = validators[name];

    if (validator) {
      setFieldError(name, validator(value));
    }
  };

  // =========================================================
  // PHONE CHANGE
  // =========================================================

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));

    setFieldError("phone", "");
    setSubmitError("");
  };

  // =========================================================
  // PHONE BLUR
  // =========================================================

  const handlePhoneBlur = () => {
    setFieldError(
      "phone",
      validatePhone(
        form.phone,
        form.countryCode
      )
    );
  };

  // =========================================================
  // COUNTRY SELECT
  // =========================================================

  const handleCountrySelect = (country) => {
    setForm((prev) => ({
      ...prev,
      countryCode: country,
    }));

    setCountryOpen(false);
    setCountrySearch("");

    if (form.phone) {
      setFieldError(
        "phone",
        validatePhone(form.phone, country)
      );
    }
  };

  // =========================================================
  // COUNTRY SEARCH
  // =========================================================

  const filteredCountries = countries.filter(
    (country) => {
      const callingCode =
        getCountryCallingCode(country);

      const searchValue =
        `${country} ${callingCode}`.toLowerCase();

      return searchValue.includes(
        countrySearch.toLowerCase()
      );
    }
  );

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");

    const newErrors = validateAll(form);

    setErrors(newErrors);

    // Stop submission if validation fails
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const companyName =
      form.companyName.trim();

    const ownerName =
      form.ownerName.trim();

    const email =
      form.email.trim();

    const address =
      form.address.trim();

    const fullPhoneNumber =
      `+${getCountryCallingCode(form.countryCode)}${form.phone}`;

    try {
      setSubmitting(true);

      const submitData = {
        ...form,
        companyName,
        ownerName,
        email,
        address,
        phone: fullPhoneNumber,
      };

      await onSubmit(
        company.companyId,
        submitData
      );

      setErrors({});
      setSubmitError("");

      onClose();
    } catch (error) {
      console.error("Update company error:", error);

      // Duplicate email
      if (error.response?.status === 409) {
        setFieldError(
          "email",
          error.response.data?.message ||
            "This email ID is already registered"
        );
      } else {
        setSubmitError(
          error.response?.data?.message ||
            "Failed to update company. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const inputClass = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[fieldName]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-[#25D366] focus:ring-green-100"
    }`;

  if (!open || !company) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Company
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update company information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <form
          id="edit-company-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 overflow-y-auto p-7"
        >

          {/* COMPANY ID */}

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Company ID
            </p>

            <p className="mt-1 font-semibold text-[#25D366]">
              {company.companyId}
            </p>

          </div>

          {/* SUBMIT ERROR */}

          {submitError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">

            {/* ================================================= */}
            {/* COMPANY NAME */}
            {/* ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="ABC Technologies"
                maxLength={100}
                aria-invalid={!!errors.companyName}
                className={inputClass("companyName")}
              />

              {errors.companyName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.companyName}
                </p>
              )}

            </div>

            {/* ================================================= */}
            {/* OWNER NAME */}
            {/* ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Owner Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="John Smith"
                maxLength={100}
                aria-invalid={!!errors.ownerName}
                className={inputClass("ownerName")}
              />

              {errors.ownerName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.ownerName}
                </p>
              )}

            </div>

            {/* ================================================= */}
            {/* EMAIL */}
            {/* ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="company@email.com"
                maxLength={254}
                aria-invalid={!!errors.email}
                className={inputClass("email")}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* ================================================= */}
            {/* PHONE */}
            {/* ================================================= */}

            <div className="relative">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">

                {/* COUNTRY */}

                <div className="relative w-32">

                  <button
                    type="button"
                    onClick={() => {
                      setCountryOpen(
                        !countryOpen
                      );
                      setCountrySearch("");
                    }}
                    disabled={submitting}
                    className="flex h-[50px] w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-400 focus:border-[#25D366] focus:ring-2 focus:ring-green-100 disabled:opacity-50"
                  >

                    <span>
                      {form.countryCode}{" "}

                      <span className="text-gray-500">
                        +
                        {getCountryCallingCode(
                          form.countryCode
                        )}
                      </span>
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        countryOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {/* COUNTRY DROPDOWN */}

                  {countryOpen && (
                    <div className="absolute left-0 top-full z-[100] mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                      <div className="border-b border-gray-200 p-2">

                        <div className="flex items-center rounded-lg border border-gray-200 px-3">

                          <Search
                            size={16}
                            className="shrink-0 text-gray-400"
                          />

                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) =>
                              setCountrySearch(
                                e.target.value
                              )
                            }
                            placeholder="Search code..."
                            className="w-full border-none px-2 py-2 text-sm outline-none"
                            autoFocus
                          />

                        </div>

                      </div>

                      <div className="max-h-60 overflow-y-auto">

                        {filteredCountries.map(
                          (country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() =>
                                handleCountrySelect(
                                  country
                                )
                              }
                              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-green-50"
                            >

                              <span className="font-medium text-gray-700">
                                {country}
                              </span>

                              <span className="flex items-center gap-2">

                                <span className="text-gray-500">
                                  +
                                  {getCountryCallingCode(
                                    country
                                  )}
                                </span>

                                {form.countryCode ===
                                  country && (
                                  <Check
                                    size={16}
                                    className="text-[#25D366]"
                                  />
                                )}

                              </span>

                            </button>
                          )
                        )}

                        {filteredCountries.length ===
                          0 && (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No country code found
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* PHONE INPUT */}

                <div className="flex-1">

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="9876543210"
                    maxLength={15}
                    aria-invalid={!!errors.phone}
                    className={`h-[50px] ${inputClass(
                      "phone"
                    )}`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ADDRESS */}
            {/* ================================================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="4"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter company address"
                maxLength={250}
                aria-invalid={!!errors.address}
                className={`resize-none ${inputClass(
                  "address"
                )}`}
              />

              <div className="mt-1 flex items-center justify-between">

                {errors.address ? (
                  <p className="text-sm text-red-500">
                    {errors.address}
                  </p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.address.length}/250
                </span>

              </div>

            </div>

            {/* ================================================= */}
            {/* PLAN */}
            {/* ================================================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subscription Plan{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="plan"
                value={form.plan}
                onChange={handleChange}
                className={inputClass("plan")}
              >

                <option value="Trial">
                  Trial
                </option>

                <option value="Starter">
                  Starter
                </option>

                <option value="Professional">
                  Professional
                </option>

                <option value="Enterprise">
                  Enterprise
                </option>

              </select>

              {errors.plan && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.plan}
                </p>
              )}

            </div>

            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <div className="col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Status{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass("status")}
              >

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="EXPIRED">
                  Expired
                </option>

              </select>

              {errors.status && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.status}
                </p>
              )}

            </div>

          </div>

        </form>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-7 py-5">

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-company-form"
            disabled={submitting}
            className="rounded-xl bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#1fb85a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Updating..."
              : "Update Company"}
          </button>

        </div>

      </div>

    </div>
  );
}