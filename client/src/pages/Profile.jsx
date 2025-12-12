import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Calendar, BookOpen, Edit } from 'lucide-react';
import { API_URL } from '../config';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userRecipes, setUserRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserRecipes();
        fetchFollowCounts();
    }, [user, navigate]);

    const fetchUserRecipes = async () => {
        try {
            const res = await axios.get(`${API_URL}/recipes`);
            const myRecipes = res.data.filter(recipe => recipe.author && recipe.author.id === user._id);
            setUserRecipes(myRecipes);
        } catch (err) {
            console.error('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowCounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/${user._id}`);
            setFollowersCount(res.data.followers);
            setFollowingCount(res.data.following);
        } catch (err) {
            console.error('Failed to load follow counts');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="h-24 w-24 rounded-full object-cover border-4 border-orange-200"
                            />
                        ) : (
                            <div className="h-24 w-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {user.username ? user.username[0].toUpperCase() : 'U'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                            {user.bio && (
                                <p className="text-gray-600 mb-2 max-w-md">{user.bio}</p>
                            )}
                            <div className="flex items-center text-gray-600 mb-1">
                                <Mail className="h-4 w-4 mr-2" />
                                {user.email}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Member since {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/profile/edit')}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </button>
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
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BookOpen className="h-6 w-6 mr-2 text-orange-600" />
                        My Recipes
                    </h2>
                    <Link
                        to="/recipes/create"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-sm font-medium"
                    >
                        Create New Recipe
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading recipes...</div>
                ) : userRecipes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-xl text-gray-600 mb-4">You haven't created any recipes yet</p>
                        <Link to="/recipes/create" className="text-orange-600 hover:text-orange-700 font-medium">
                            Create your first recipe →
                        </Link>
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

export default Profile;
