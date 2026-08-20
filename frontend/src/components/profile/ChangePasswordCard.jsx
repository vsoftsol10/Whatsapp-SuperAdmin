import { useState } from "react";
import api from "../../api/axios";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function ChangePasswordCard() {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("New Password and Confirm Password do not match");
    }

    try {

      setLoading(true);

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword
        }
      );

      alert(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* Header */}

      <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">

        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">

          <ShieldCheck
            size={20}
            className="text-[#25D366]"
          />

        </div>

        <div>

          <h2 className="text-lg font-semibold">
            Change Password
          </h2>

          <p className="text-sm text-gray-500">
            Update your account password
          </p>

        </div>

      </div>

      {/* Form */}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <PasswordInput
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          setValue={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
          full
        />

        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          setValue={setNewPassword}
          show={showNew}
          setShow={setShowNew}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
        />

      </div>

      {/* Button */}

      <div className="px-6 pb-6 flex justify-end">

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="
          h-11
          px-8
          rounded-xl
          bg-[#25D366]
          text-white
          font-medium
          transition
          hover:bg-[#1fb95a]
          disabled:opacity-60
          "
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>

    </div>

  );

}

function PasswordInput({
  label,
  placeholder,
  value,
  setValue,
  show,
  setShow,
  full = false,
}) {

  return (

    <div className={full ? "md:col-span-2" : ""}>

      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>

      <div className="relative">

        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="
          w-full
          h-11
          pl-11
          pr-11
          rounded-xl
          border
          border-gray-300
          bg-white
          outline-none
          transition
          focus:ring-2
          focus:ring-green-100
          focus:border-[#25D366]
          "
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

      </div>

    </div>

  );

}