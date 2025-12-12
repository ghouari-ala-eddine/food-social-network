import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Bell, UserPlus, Check, Heart, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchNotifications();
    }, [user, navigate]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return (
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-red-500" />
                    </div>
                );
            case 'comment':
                return (
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                );
            case 'reservation':
                return (
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                );
            case 'reservation_confirmed':
                return (
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                );
            case 'reservation_cancelled':
                return (
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-red-500" />
                    </div>
                );
            case 'follow':
                return (
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-orange-600" />
                    </div>
                );
            default:
                return (
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-gray-600" />
                    </div>
                );
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Bell className="h-8 w-8 mr-3 text-orange-600" />
                    Notifications
                </h1>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                        <Check className="h-4 w-4 mr-1" />
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-gray-600">No notifications yet</p>
                    <p className="text-gray-500 mt-2">We'll notify you when something happens</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-orange-50' : ''
                                }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700">{notification.message}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="h-2 w-2 bg-orange-600 rounded-full flex-shrink-0 ml-2"></div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
