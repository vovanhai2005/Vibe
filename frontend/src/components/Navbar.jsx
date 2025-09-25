import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Home, Search, MessageCircle, Bell, Bookmark, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 h-full bg-white bg-opacity-80 backdrop-blur-md shadow-md py-4 w-20 flex flex-col items-center z-50">
      {/* Logo at the top */}
      <Link to="/" className="mb-8 mt-2 flex items-center justify-center w-full">
        <img 
          src="/Vibe.png" 
          alt="Vibe Logo" 
          className="h-10 w-auto" 
        />
      </Link>
      
      {/* Navigation Icons */}
      <div className="flex flex-col items-center w-full space-y-2 flex-grow">
        <Link 
          to="/" 
          className="p-3 w-14 h-14 rounded-xl hover:bg-gray-100 transition flex items-center justify-center" 
          data-tooltip-id="nav-tooltip" 
          data-tooltip-content="Home"
        >
          <Home className="h-6 w-6 text-gray-700" />
        </Link>

        <Link
          to="/search"
          className="p-3 w-14 h-14 rounded-xl hover:bg-gray-100 transition flex items-center justify-center"
          data-tooltip-id="nav-tooltip"
          data-tooltip-content="Search"
        >
          <Search className="h-6 w-6 text-gray-700" />
        </Link>
      </div>
      
      {/* Auth at the bottom */}
      <div className="mt-auto mb-6 w-full flex flex-col items-center">
        {authUser ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            <Link 
              to="/profile" 
              className="p-3 w-14 h-14 rounded-xl hover:bg-gray-100 transition flex items-center justify-center" 
              data-tooltip-id="nav-tooltip" 
              data-tooltip-content="Profile"
            >
              {authUser.profilePicture ? (
                <img 
                  src={authUser.profilePicture} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-700" />
              )}
            </Link>
            <button 
              onClick={handleLogout}
              className="p-3 w-14 h-14 rounded-xl hover:bg-red-100 transition flex items-center justify-center"
              data-tooltip-id="nav-tooltip"
              data-tooltip-content="Logout"
            >
              <LogOut className="h-6 w-6 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            <Link 
              to="/login" 
              className="p-3 w-14 h-14 rounded-xl hover:bg-gray-100 transition flex items-center justify-center" 
              data-tooltip-id="nav-tooltip" 
              data-tooltip-content="Login"
            >
              <LogIn className="h-6 w-6 text-gray-700" />
            </Link>
            <Link 
              to="/signup" 
              className="p-3 w-14 h-14 rounded-xl hover:bg-blue-100 transition flex items-center justify-center" 
              data-tooltip-id="nav-tooltip" 
              data-tooltip-content="Sign Up"
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
            </Link>
          </div>
        )}
      </div>
      
      {/* Tooltip for showing labels */}
      <Tooltip id="nav-tooltip" place="right" />
    </nav>
  );
};

export default Navbar;