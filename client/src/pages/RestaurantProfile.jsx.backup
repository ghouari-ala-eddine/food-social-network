import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, Users, MapPin, X, Check } from 'lucide-react';

const Reservations = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchReservations();
    }, [user, navigate]);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reservations/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(res.data);
        } catch (err) {
            console.error('Failed to load reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReservations();
        } catch (err) {
            console.error('Failed to cancel reservation:', err);
            alert('Failed to cancel reservation');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-gray-100 text-gray-800'
        };
        return badges[status] || badges.pending;
    };

    const getStatusIcon = (status) => {
        if (status === 'confirmed') return <Check className="h-4 w-4" />;
        if (status === 'cancelled') return <X className="h-4 w-4" />;
        return <Clock className="h-4 w-4" />;
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const upcomingReservations = reservations.filter(r =>
        r.status !== 'cancelled' && r.status !== 'completed' && new Date(r.date) >= new Date()
    );
    const pastReservations = reservations.filter(r =>
        r.status === 'cancelled' || r.status === 'completed' || new Date(r.date) < new Date()
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>

            {/* Upcoming Reservations */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming</h2>
                {upcomingReservations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No upcoming reservations</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {reservation.restaurant?.restaurantName}
                                        </h3>
                                        {reservation.restaurant?.address && (
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {reservation.restaurant.address}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusBadge(reservation.status)}`}>
                                        {getStatusIcon(reservation.status)}
                                        <span className="ml-1 capitalize">{reservation.status}</span>
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                                        {new Date(reservation.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                                        {reservation.time}
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <Users className="h-5 w-5 mr-2 text-orange-500" />
                                        {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                                    </div>
                                </div>

                                {reservation.specialRequests && (
                                    <div className="bg-gray-50 rounded p-3 mb-4">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
                                        </p>
                                    </div>
                                )}

                                {reservation.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Cancel Reservation
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Reservations */}
            {pastReservations.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Past</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pastReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {reservation.restaurant?.restaurantName}
                                        </h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(reservation.status)}`}>
                                        {reservation.status}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                                        {new Date(reservation.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                                        {reservation.time}
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <Users className="h-5 w-5 mr-2 text-gray-400" />
                                        {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservations;
