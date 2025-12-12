import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, Navigation, Loader } from 'lucide-react';

const NearbyRestaurants = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [radius, setRadius] = useState(10);

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(location);
                fetchNearbyRestaurants(location.lat, location.lng, radius);
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable location services.');
                setLoading(false);
            }
        );
    };

    const fetchNearbyRestaurants = async (lat, lng, searchRadius) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/location/nearby`, {
                params: { lat, lng, radius: searchRadius }
            });
            setRestaurants(res.data);
        } catch (err) {
            console.error('Failed to load nearby restaurants:', err);
            setError('Failed to load nearby restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
        if (userLocation) {
            fetchNearbyRestaurants(userLocation.lat, userLocation.lng, newRadius);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Navigation className="h-8 w-8 mr-3 text-orange-500" />
                        Nearby Restaurants
                    </h1>
                    {userLocation && (
                        <p className="text-gray-600 mt-2">
                            Showing restaurants within {radius}km of your location
                        </p>
                    )}
                </div>

                {userLocation && (
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Radius:</label>
                        <select
                            value={radius}
                            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={50}>50 km</option>
                        </select>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={getUserLocation}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader className="h-8 w-8 text-orange-500 animate-spin" />
                    <span className="ml-3 text-gray-600">Finding nearby restaurants...</span>
                </div>
            ) : restaurants.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
                    <p className="text-gray-600">
                        Try increasing the search radius or check back later
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {restaurant.restaurantName}
                                    </h3>
                                    <div className="flex items-center bg-orange-100 px-2 py-1 rounded">
                                        <MapPin className="h-4 w-4 text-orange-600 mr-1" />
                                        <span className="text-sm font-medium text-orange-600">
                                            {restaurant.distance} km
                                        </span>
                                    </div>
                                </div>

                                {restaurant.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {restaurant.description}
                                    </p>
                                )}

                                {restaurant.address && (
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {restaurant.address}
                                    </div>
                                )}

                                {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {restaurant.cuisine.slice(0, 3).map((c) => (
                                            <span
                                                key={c}
                                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {restaurant.averageRating > 0 && (
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {restaurant.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-gray-600 ml-1">
                                            ({restaurant.totalRatings} reviews)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NearbyRestaurants;
