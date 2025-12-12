import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChefHat, User, Store } from 'lucide-react';

const Register = () => {
    const [accountType, setAccountType] = useState('user');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [cuisine, setCuisine] = useState([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const cuisineOptions = ['Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'American', 'French', 'Thai', 'Mediterranean', 'Other'];

    const handleCuisineToggle = (cuisineType) => {
        setCuisine(prev =>
            prev.includes(cuisineType)
                ? prev.filter(c => c !== cuisineType)
                : [...prev, cuisineType]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const userData = {
            username,
            email,
            password,
            accountType
        };

        if (accountType === 'restaurant') {
            userData.restaurantName = restaurantName || username;
            userData.address = address;
            userData.phone = phone;
            userData.cuisine = cuisine;
            if (latitude && longitude) {
                userData.location = {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude)
                };
            }
        }

        const result = await register(userData);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <ChefHat className="h-12 w-12 text-orange-500" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">sign in to existing account</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Account Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAccountType('user')}
                                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${accountType === 'user'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <User className={`h-8 w-8 mb-2 ${accountType === 'user' ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-medium ${accountType === 'user' ? 'text-orange-600' : 'text-gray-700'}`}>User</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAccountType('restaurant')}
                                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${accountType === 'restaurant'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Store className={`h-8 w-8 mb-2 ${accountType === 'restaurant' ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-medium ${accountType === 'restaurant' ? 'text-orange-600' : 'text-gray-700'}`}>Restaurant</span>
                            </button>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                {accountType === 'restaurant' ? 'Business Name' : 'Username'}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {accountType === 'restaurant' && (
                            <>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {cuisineOptions.map((cuisineType) => (
                                            <button
                                                key={cuisineType}
                                                type="button"
                                                onClick={() => handleCuisineToggle(cuisineType)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${cuisine.includes(cuisineType)
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {cuisineType}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude (Optional)</label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="e.g., 40.7128"
                                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude (Optional)</label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="e.g., -74.0060"
                                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
