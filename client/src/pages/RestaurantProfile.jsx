import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { MapPin, Phone, Star, MessageCircle, Calendar, X } from 'lucide-react';
import { API_URL } from '../config';

const RestaurantProfile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('menu');
    const [newRating, setNewRating] = useState(5);
    const [newReview, setNewReview] = useState('');

    // Reservation state
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [reservationDate, setReservationDate] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [partySize, setPartySize] = useState(2);
    const [specialRequests, setSpecialRequests] = useState('');

    useEffect(() => {
        fetchRestaurant();
        fetchMenu();
        fetchRatings();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/${id}`);
            setRestaurant(res.data);
        } catch (err) {
            console.error('Failed to load restaurant:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API_URL}/menu/restaurant/${id}`);
            setMenu(res.data);
        } catch (err) {
            console.error('Failed to load menu:', err);
        }
    };

    const fetchRatings = async () => {
        try {
            const res = await axios.get(`${API_URL}/ratings/restaurant/${id}`);
            setRatings(res.data);
        } catch (err) {
            console.error('Failed to load ratings:', err);
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/ratings`, {
                restaurantId: parseInt(id),
                rating: newRating,
                review: newReview
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewRating(5);
            setNewReview('');
            await fetchRatings();
            await fetchRestaurant();
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit rating:', err);
            alert('Failed to submit rating');
        }
    };

    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/reservations`, {
                restaurantId: parseInt(id),
                date: reservationDate,
                time: reservationTime,
                partySize: parseInt(partySize),
                specialRequests
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowReservationModal(false);
            setReservationDate('');
            setReservationTime('');
            setPartySize(2);
            setSpecialRequests('');

            alert('Reservation submitted successfully!');
            navigate('/reservations');
        } catch (err) {
            console.error('Failed to submit reservation:', err);
            alert('Failed to submit reservation');
        }
    };

    if (loading || !restaurant) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const categories = [...new Set(menu.map(item => item.category))];
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        {restaurant.profilePicture ? (
                            <img
                                src={restaurant.profilePicture}
                                alt={restaurant.restaurantName}
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-24 w-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {restaurant.restaurantName ? restaurant.restaurantName[0].toUpperCase() : 'R'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.restaurantName || restaurant.username}</h1>
                            {restaurant.description && (
                                <p className="text-gray-600 mb-2">{restaurant.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                {restaurant.address && (
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {restaurant.address}
                                    </div>
                                )}
                                {restaurant.phone && (
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {restaurant.phone}
                                    </div>
                                )}
                            </div>
                            {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {restaurant.cuisine.map((c) => (
                                        <span key={c} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {user && user._id !== parseInt(id) && (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowReservationModal(true)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Make Reservation
                            </button>
                            <button
                                onClick={() => navigate(`/messages/${id}`)}
                                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reservation Modal */}
            {showReservationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Make a Reservation</h2>
                            <button
                                onClick={() => setShowReservationModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReservation}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    min={today}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                <input
                                    type="time"
                                    value={reservationTime}
                                    onChange={(e) => setReservationTime(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Party Size</label>
                                <select
                                    value={partySize}
                                    onChange={(e) => setPartySize(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                                <textarea
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    rows="3"
                                    placeholder="Any dietary restrictions, seating preferences, etc."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowReservationModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                >
                                    Confirm Reservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'menu'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Menu
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Reviews
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'menu' && (
                        <div>
                            {menu.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No menu items available</p>
                            ) : (
                                categories.map((category) => (
                                    <div key={category} className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {menu.filter(item => item.category === category).map((item) => (
                                                <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                                        {!item.available && (
                                                            <span className="text-xs text-red-600 mt-1 inline-block">Currently unavailable</span>
                                                        )}
                                                    </div>
                                                    <span className="text-orange-600 font-bold ml-4">${item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {user && user._id !== parseInt(id) && (
                                <form onSubmit={handleSubmitRating} className="mb-8 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 ${star <= newRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                                        <textarea
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Share your experience..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            )}

                            <div className="space-y-4">
                                {ratings.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No reviews yet</p>
                                ) : (
                                    ratings.map((rating) => (
                                        <div key={rating.id} className="border-b pb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    {rating.user && rating.user.profilePicture ? (
                                                        <img
                                                            src={rating.user.profilePicture}
                                                            alt={rating.user.username}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                                            {rating.user ? rating.user.username[0].toUpperCase() : 'U'}
                                                        </div>
                                                    )}
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">{rating.user ? rating.user.username : 'Anonymous'}</p>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(rating.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {rating.review && <p className="text-gray-700 ml-13">{rating.review}</p>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;