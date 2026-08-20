import ProfileSidebarCard from "../components/profile/ProfileSidebarCard";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import ChangePasswordCard from "../components/profile/ChangePasswordCard";

export default function ProfilePage() {
  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account information and security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Sidebar */}

        <div>
          <ProfileSidebarCard />
        </div>

        {/* Right */}

        <div className="lg:col-span-2 space-y-6">

          <PersonalInfoCard />

          <ChangePasswordCard />

        </div>

      </div>

    </div>
  );
}