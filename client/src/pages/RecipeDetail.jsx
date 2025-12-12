import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Clock, Users, ChefHat, ArrowLeft, Trash2, Heart, MessageCircle, Send, Share2 } from 'lucide-react';
import { API_URL } from '../config';

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Likes and comments state
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchRecipe();
        fetchComments();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const res = await axios.get(`${API_URL}/recipes/${id}`);
            setRecipe(res.data);
            setLikesCount(res.data.likes?.length || 0);
            if (user) {
                setIsLiked(res.data.likes?.includes(user._id) || false);
            }
        } catch (err) {
            setError('Failed to load recipe');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${API_URL}/comments/recipe/${id}`);
            setComments(res.data);
        } catch (err) {
            console.error('Failed to load comments');
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/recipes/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsLiked(res.data.isLiked);
            setLikesCount(res.data.likesCount);
        } catch (err) {
            console.error('Failed to toggle like');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/comments`, {
                recipeId: id,
                text: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (err) {
            alert('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/recipes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/recipes');
        } catch (err) {
            alert('Failed to delete recipe');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: `Check out this recipe: ${recipe.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading recipe...</div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
                <button onClick={() => navigate('/recipes')} className="text-orange-600 hover:text-orange-700">
                    Back to Recipes
                </button>
            </div>
        );
    }

    const isAuthor = user && recipe.author && user._id === recipe.author.id;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/recipes')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Recipes
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 md:h-96 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-9xl">🍳</span>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
                        <div className="flex items-center space-x-2">
                            {isAuthor && (
                                <button
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-700 p-2"
                                    title="Delete recipe"
                                >
                                    <Trash2 className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>

                    {/* Like and Comment Stats */}
                    <div className="flex items-center space-x-6 mb-6">
                        <button
                            onClick={handleToggleLike}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${isLiked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{likesCount}</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-medium">{comments.length} comments</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <Share2 className="h-5 w-5" />
                            <span className="font-medium">Share</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <Clock className="h-5 w-5 mr-2 text-orange-600" />
                            <span className="font-medium">{recipe.cookTime ? `${recipe.cookTime} minutes` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Users className="h-5 w-5 mr-2 text-orange-600" />
                            <span className="font-medium">{recipe.servings || 'N/A'} servings</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {recipe.difficulty}
                            </span>
                        </div>
                    </div>

                    {recipe.author && (
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {recipe.author?.username ? recipe.author.username[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                                <Link
                                    to={`/user/${recipe.author?.id}`}
                                    className="text-sm text-gray-600 hover:text-orange-600"
                                >
                                    By <span className="font-medium">{recipe.author?.username || 'Unknown'}</span>
                                </Link>
                                <div className="text-xs text-gray-500">{new Date(recipe.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                        <ul className="space-y-2">
                            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-orange-600 mr-3">•</span>
                                    <span className="text-gray-700">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                        <ol className="space-y-4">
                            {recipe.instructions && recipe.instructions.map((instruction, index) => (
                                <li key={index} className="flex">
                                    <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 pt-1">{instruction}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-200 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Comments ({comments.length})
                        </h2>

                        {/* Add Comment Form */}
                        {user ? (
                            <form onSubmit={handleSubmitComment} className="mb-6">
                                <div className="flex space-x-4">
                                    <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {user.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 flex">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !newComment.trim()}
                                            className="bg-orange-600 text-white px-4 py-2 rounded-r-lg hover:bg-orange-700 disabled:bg-gray-400"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-500 mb-6">
                                <Link to="/login" className="text-orange-600 hover:underline">Log in</Link> to leave a comment
                            </p>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-4">
                                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                                            {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-50 rounded-lg px-4 py-3">
                                                <div className="flex justify-between items-start">
                                                    <Link
                                                        to={`/user/${comment.user?.id}`}
                                                        className="font-medium text-gray-900 hover:text-orange-600"
                                                    >
                                                        {comment.user?.username || 'Unknown'}
                                                    </Link>
                                                    {user && user._id === comment.userId && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-gray-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-1">{comment.text}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
