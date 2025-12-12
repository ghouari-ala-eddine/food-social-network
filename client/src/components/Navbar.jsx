import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChefHat, User, Search, LogOut, UserCircle, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch unread count');
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            <span className="ml-2 text-xl font-bold text-gray-800">FoodNetwork</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link to="/recipes" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Recipes</Link>
                        <Link to="/offers" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Offers</Link>
                        <Link to="/nearby" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Nearby</Link>
                        <Link to="/planner" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Meal Planner</Link>
                        {user && (
                            <>
                                <Link to="/reservations" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Reservations</Link>
                                <Link to="/messages" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Messages</Link>
                            </>
                        )}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="bg-gray-100 rounded-full py-1 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            />
                            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>

                        {user ? (
                            <>
                                <Link to="/notifications" className="relative text-gray-600 hover:text-orange-500">
                                    <Bell className="h-6 w-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 focus:outline-none"
                                    >
                                        <UserCircle className="h-6 w-6" />
                                        <span className="text-sm font-medium">{user.username}</span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                My Profile
                                            </Link>
                                            {user.accountType === 'restaurant' ? (
                                                <Link
                                                    to="/restaurant-dashboard"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <ChefHat className="h-4 w-4 mr-2" />
                                                    Dashboard
                                                </Link>
                                            ) : (
                                                <Link
                                                    to="/recipes/create"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <ChefHat className="h-4 w-4 mr-2" />
                                                    Create Recipe
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-orange-500 text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/recipes" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Recipes</Link>
                        <Link to="/offers" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Offers</Link>
                        <Link to="/nearby" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Nearby</Link>
                        <Link to="/planner" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Meal Planner</Link>

                        {user ? (
                            <>
                                <Link to="/reservations" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Reservations</Link>
                                <Link to="/messages" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Messages</Link>
                                <Link to="/notifications" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Notifications</Link>
                                <Link to="/profile" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                                {user.accountType === 'restaurant' ? (
                                    <Link to="/restaurant-dashboard" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                ) : (
                                    <Link to="/recipes/create" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Create Recipe</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="block text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
