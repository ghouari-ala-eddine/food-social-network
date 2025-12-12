import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Tag, Clock, MapPin } from 'lucide-react';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/offers');
            console.log('Fetched offers:', res.data);
            setOffers(res.data);
        } catch (err) {
            console.error('Failed to load offers:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Tag className="h-8 w-8 mr-3 text-orange-600" />
                    Daily Offers
                </h1>
                <p className="text-gray-600 mt-2">Discover amazing deals from restaurants near you</p>
            </div>

            {offers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Tag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-gray-600">No active offers at the moment</p>
                    <p className="text-gray-500 mt-2">Check back later for great deals!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <Link
                            key={offer.id}
                            to={`/restaurant/${offer.restaurantId}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {offer.image && (
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        {offer.discount}% OFF
                                    </span>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(offer.validUntil).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                                {offer.restaurant && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-center">
                                            {offer.restaurant.profilePicture ? (
                                                <img
                                                    src={offer.restaurant.profilePicture}
                                                    alt={offer.restaurant.restaurantName}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {offer.restaurant.restaurantName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{offer.restaurant.restaurantName}</p>
                                                {offer.restaurant.cuisine && offer.restaurant.cuisine.length > 0 && (
                                                    <p className="text-xs text-gray-500">{offer.restaurant.cuisine.join(', ')}</p>
                                                )}
                                            </div>
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

export default Offers;
