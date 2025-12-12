import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Clock, Users, Plus, Heart } from 'lucide-react';
import { API_URL } from '../config';

const Recipes = () => {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(`${API_URL}/recipes`);
            setRecipes(res.data);
        } catch (err) {
            setError('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading recipes...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
                {user && (
                    <Link
                        to="/recipes/create"
                        className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Recipe
                    </Link>
                )}
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {recipes.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-600 mb-4">No recipes yet</p>
                    {user && (
                        <Link to="/recipes/create" className="text-orange-600 hover:text-orange-700">
                            Be the first to create one!
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
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
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {recipe.cookTime ? `${recipe.cookTime} min` : 'N/A'}
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {recipe.servings || 'N/A'} servings
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {recipe.difficulty}
                                    </span>
                                </div>

                                {recipe.author && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-sm text-gray-600">By {recipe.author.username}</span>
                                        <div className="flex items-center text-gray-500">
                                            <Heart className="h-4 w-4 mr-1" />
                                            <span className="text-sm">{recipe.likes?.length || 0}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recipes;
