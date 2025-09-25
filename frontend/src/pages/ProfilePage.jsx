import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { Camera, User, Edit2, Calendar, Mail, AtSign, UserPlus, Check, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams(); // Get the user id from URL parameters
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    email: '',
    dob: '',
    bio: 'No bio yet...'
  });

  // Determine if this is the user's own profile
  const isOwnProfile = !id || id === authUser?._id;
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // If no ID or it's the current user's ID, use authUser data
        if (!id || id === authUser?._id) {
          setUser(authUser);
          setProfileData({
            username: authUser?.username || '',
            fullName: authUser?.fullName || '',
            email: authUser?.email || '',
            dob: authUser?.dob || '',
            bio: authUser?.bio || 'No bio yet...'
          });
        } else {
          // Fetch the requested user's profile
          const response = await axiosInstance.get(`/api/users/${id}`);
          setUser(response.data);
          setProfileData({
            username: response.data?.username || '',
            fullName: response.data?.fullName || '',
            email: response.data?.email || '',
            dob: response.data?.dob || '',
            bio: response.data?.bio || 'No bio yet...'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        // Redirect to own profile on error
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, authUser, navigate]);
  
  const handleImageUpload = async (e) => {
    if (!isOwnProfile) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          await updateProfile({ profilePicture: base64Image });
          setSelectedImage(base64Image);
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to update profile picture');
        } finally {
          setIsUploadingImage(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading image file');
        setIsUploadingImage(false);
      };
    } catch (error) {
      toast.error('Error processing image');
      setIsUploadingImage(false);
    }
  };
  
  const handleSave = () => {
    if (!isOwnProfile) return;
    updateProfile(profileData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171C2E]">
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-blue-600 h-12 w-12" />
          <p className="mt-4 text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171C2E]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">User not found</h2>
          <p className="mt-2 text-gray-400">The requested profile could not be found.</p>
          <button 
            onClick={() => navigate('/profile')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go to your profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171C2E] text-white pt-16">
      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#171C2E]/60 to-transparent"></div>
      </div>
      
      {/* Profile Header */}
      <div className="container mx-auto px-4 relative -mt-24">
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0 -mt-20 md:ml-4">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-gray-900 shadow-xl overflow-hidden bg-gray-800">
                  {isUploadingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Loader className="animate-spin text-blue-600" size={40} />
                    </div>
                  ) : (
                    <img 
                      src={selectedImage || user.profilePicture || '/avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition duration-300 group-hover:opacity-90"
                    />
                  )}
                </div>
                {isOwnProfile && (
                  <label className={`absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-opacity duration-300 hover:bg-blue-500 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Camera size={18} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={isUploadingImage || isUpdatingProfile}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow pt-4 md:pt-0">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profileData.fullName || profileData.username}</h1>
                  <p className="text-gray-400 flex items-center gap-1">
                    <AtSign size={16} /> {profileData.username}
                  </p>
                </div>
                
                {isOwnProfile && !isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : isOwnProfile && isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <Check size={16} />
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <UserPlus size={16} />
                      Add Friend
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-gray-300">
                {isOwnProfile && isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      name="bio"
                      value={profileData.bio || ''}
                      onChange={handleChange}
                      placeholder="Tell others about yourself..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                      maxLength={250}
                    />
                    <p className="text-sm text-gray-400 text-right">
                      {(profileData.bio?.length || 0)}/250 characters
                    </p>
                  </div>
                ) : (
                  <p className="italic">
                    {profileData.bio || (isOwnProfile ? "Add a bio to tell people about yourself..." : "No bio yet...")}
                  </p>
                )}
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="text-blue-500" size={18} />
                  <span className="font-medium">Email:</span>
                  {isOwnProfile && isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled
                    />
                  ) : (
                    <span>{isOwnProfile ? profileData.email : "•••••••••"}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <AtSign className="text-purple-500" size={18} />
                  <span className="font-medium">Username:</span>
                  {isOwnProfile && isEditing ? (
                    <input  
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{profileData.username}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="text-green-500" size={18} />
                  <span className="font-medium">Full Name:</span>
                  {isOwnProfile && isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{profileData.fullName || 'Not specified'}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="text-orange-500" size={18} />
                  <span className="font-medium">Birthday:</span>
                  {isOwnProfile && isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{profileData.dob || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;