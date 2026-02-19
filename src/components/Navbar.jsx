import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";

const ProfileModal = ({ user }) => {
  const { logout } = useAuth();
  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await axios.delete("/api/auth/delete");
      alert("Account deleted successfully");
      logout();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          User Profile
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-800">
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-sm text-gray-600 text-capitalize">
            <span className="font-medium">Role:</span> {user.role}
          </p>
        </div>
      </div>
      <div className="p-2 bg-gray-50">
        <button
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          onClick={deleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="text-2xl font-bold text-orange-600 tracking-tight">
        <Link to="/">Moodle</Link>
      </div>

      {/* Links & Auth */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
        >
          Courses
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              Dashboard
            </Link>

            {/* Profile Dropdown Container */}
            <div className="relative">
              <button
                onClick={toggleProfileModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold uppercase text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-gray-700 font-medium">{user.name}</span>
              </button>

              {showProfileModal && <ProfileModal user={user} />}
            </div>

            <button
              onClick={logout}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
