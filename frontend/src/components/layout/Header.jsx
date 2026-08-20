
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { menuItems } from "../../config/menuItems";
export default function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}`, {});

      // Immediately update frontend
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );

    } catch (err) {
      console.log("Failed to mark notification as read:", err);
    }
  };


  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      // Remove notification immediately from UI
      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (err) {
      console.log("Failed to delete notification:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearch = (value) => {

    setSearch(value);


    if (!value) {

      setSearchResults([]);

      return;

    }


    const results = menuItems.filter(item =>

      item.roles.includes(role) &&

      item.name
        .toLowerCase()
        .includes(
          value.toLowerCase()
        )

    );


    setSearchResults(results);

  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <>
      <header
        className="
        fixed
        top-0
        right-0
        left-72
        h-20
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        px-8
        z-40
        "
      >
        {/* Search */}

        <div className="relative w-[650px]">

          <Search
            size={20}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search modules..."
            className="
w-full
h-12
pl-12
pr-4
rounded-xl
bg-gray-100
outline-none
transition
focus:ring-2
focus:ring-[#25D366]
"
          />

          {
            searchResults.length > 0 && (

              <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                {/* <div className="px-4 py-3 border-b text-xs font-semibold text-gray-500 uppercase">
Modules
</div> */}

                {
                  searchResults.map(item => {

                    const Icon = item.icon;

                    return (

                      <button
                        key={item.name}
                        onClick={() => {

                          navigate(item.path);

                          setSearch("");

                          setSearchResults([]);

                        }}

                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition text-left"
                      >

                        <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
                          <Icon size={18} className="text-[#25D366]" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Open {item.name} module
                          </p>
                        </div>

                      </button>

                    )

                  })

                }

              </div>

            )
          }


        </div>

        {/* Right */}

        <div
          className="
          flex
          items-center
          gap-6
          "
        >

          {/* Notification */}
          <button
            ref={notificationRef}
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >

            <Bell size={22} />

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto">

                <div className="p-4 border-b font-semibold">
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">
                    No notifications
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border-b hover:bg-gray-50 ${item.isRead ? "" : "bg-green-50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">

                        {/* Notification content */}
                        <div
                          onClick={() => markNotificationAsRead(item.id)}
                          className="flex-1 cursor-pointer"
                        >
                          <h4 className="font-semibold">
                            {item.title}
                          </h4>

                          <p className="text-sm text-gray-600 mt-1">
                            {item.message}
                          </p>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          className="
          p-2
          rounded-lg
          text-gray-400
          hover:text-red-600
          hover:bg-red-50
          transition
          flex-shrink-0
        "
                          title="Delete notification"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}

          </button>

          {/* Profile */}

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              onClick={() => setOpen(!open)}
              className="
              flex
              items-center
              gap-3
              px-2
              py-2
              rounded-xl
              hover:bg-gray-100
              transition
              "
            >

              <div
                className="
                w-11
                h-11
                rounded-full
                bg-[#25D366]
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-lg
                "
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="text-left">

                <p className="font-semibold text-sm">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500">
                  {role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : "Employee"}
                </p>

              </div>

              <ChevronDown
                size={18}
                className={`transition ${open ? "rotate-180" : ""}`}
              />

            </button>

            {open && (

              <div
                className="
                absolute
                right-0
                top-16
                w-56
                bg-white
                rounded-xl
                shadow-xl
                border
                border-gray-200
                overflow-hidden
                "
              >

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="
  w-full
  flex
  items-center
  gap-3
  px-4
  py-3
  hover:bg-gray-100
  transition
  "
                >

                  <User size={18} />

                  My Profile

                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-red-600
                  hover:bg-red-50
                  transition
                  "
                >

                  <LogOut size={18} />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </header>

      {/* Logout Confirmation */}

      {showLogoutModal && (

        <div
          className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          "
        >

          <div
            className="
            w-[380px]
            bg-white
            rounded-2xl
            shadow-2xl
            p-6
            "
          >

            <h2
              className="
              text-xl
              font-bold
              text-gray-900
              "
            >
              Logout
            </h2>

            <p
              className="
              mt-3
              text-gray-600
              "
            >
              Are you sure you want to logout?
            </p>

            <div
              className="
              mt-6
              flex
              justify-end
              gap-3
              "
            >

              <button
                onClick={() => setShowLogoutModal(false)}
                className="
                px-5
                py-2
                rounded-lg
                border
                border-gray-300
                hover:bg-gray-100
                transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="
                px-5
                py-2
                rounded-lg
                bg-red-600
                text-white
                hover:bg-red-700
                transition
                "
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
}