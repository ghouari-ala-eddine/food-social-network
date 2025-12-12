import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Calendar, BookOpen, MessageCircle, UserPlus, UserMinus } from 'lucide-react';

const UserProfile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        fetchUserProfile();
        fetchUserRecipes();
        if (user) {
            checkIfFollowing();
        }
    }, [id, user]);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${id}`);
            setProfileUser(res.data);
            setFollowersCount(res.data.followers);
            setFollowingCount(res.data.following);
        } catch (err) {
            console.error('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRecipes = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${id}/recipes`);
            setUserRecipes(res.data);
        } catch (err) {
            console.error('Failed to load recipes');
        }
    };

    const checkIfFollowing = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/users/${user._id}/following`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(res.data.some(u => u.id === parseInt(id)));
        } catch (err) {
            console.error('Failed to check following status');
        }
    };

    const handleFollow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/users/${id}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(true);
            setFollowersCount(prev => prev + 1);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to follow user');
        }
    };

    const handleUnfollow = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}/unfollow`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(false);
            setFollowersCount(prev => prev - 1);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to unfollow user');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!profileUser) {
        return <div className="text-center py-12">User not found</div>;
    }

    const isOwnProfile = user && user._id === parseInt(id);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        {profileUser.profilePicture ? (
                            <img
                                src={profileUser.profilePicture}
                                alt={profileUser.username}
                                className="h-24 w-24 rounded-full object-cover border-4 border-orange-200"
                            />
                        ) : (
                            <div className="h-24 w-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {profileUser.username ? profileUser.username[0].toUpperCase() : 'U'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileUser.username}</h1>
                            {profileUser.bio && (
                                <p className="text-gray-600 mb-2 max-w-md">{profileUser.bio}</p>
                            )}
                            <div className="flex items-center text-gray-600 mb-1">
                                <Mail className="h-4 w-4 mr-2" />
                                {profileUser.email}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Member since {new Date(profileUser.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {!isOwnProfile && user && (
                        <div className="flex gap-2">
                            {isFollowing ? (
                                <button
                                    onClick={handleUnfollow}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                                >
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Follow
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/messages/${id}`)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                            </button>
                        </div>
                    )}

                    {isOwnProfile && (
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-orange-600">{userRecipes.length}</div>
                            <div className="text-sm text-gray-600">Recipes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-600">{followersCount}</div>
                            <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-600">{followingCount}</div>
                            <div className="text-sm text-gray-600">Following</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                    <BookOpen className="h-6 w-6 mr-2 text-orange-600" />
                    {isOwnProfile ? 'My Recipes' : `${profileUser.username}'s Recipes`}
                </h2>

                {userRecipes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-xl text-gray-600">No recipes yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userRecipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                to={`/recipes/${recipe.id}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                    {recipe.image ? (
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl">🍳</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
                                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                        <span>{recipe.cookTime ? `${recipe.cookTime} min` : 'N/A'}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
