import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, UtensilsCrossed, Calendar, Clock, Users } from 'lucide-react';
import { API_URL } from '../config';

const RestaurantDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('menu');
    const [menuItems, setMenuItems] = useState([]);
    const [offers, setOffers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showAddOffer, setShowAddOffer] = useState(false);

    // Menu form
    const [menuForm, setMenuForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'main',
        image: ''
    });

    // Offer form
    const [offerForm, setOfferForm] = useState({
        title: '',
        description: '',
        discount: '',
        validUntil: '',
        image: ''
    });

    useEffect(() => {
        if (!user || user.accountType !== 'restaurant') {
            navigate('/');
            return;
        }
        fetchMenuItems();
        fetchOffers();
        fetchReservations();
    }, [user, navigate]);

    const fetchMenuItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/menu/restaurant/${user._id}`);
            setMenuItems(res.data);
        } catch (err) {
            console.error('Failed to load menu');
        }
    };

    const fetchOffers = async () => {
        try {
            const res = await axios.get(`${API_URL}/offers/restaurant/${user._id}`);
            setOffers(res.data);
        } catch (err) {
            console.error('Failed to load offers');
        }
    };

    const fetchReservations = async () => {
        if (!user || !user._id) {
            console.error('User ID missing in fetchReservations', user);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching reservations for restaurant:', user._id);
            const res = await axios.get(`${API_URL}/reservations/restaurant/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Reservations response:', res.data);
            setReservations(res.data);
        } catch (err) {
            console.error('Failed to load reservations:', err.response?.data || err.message);
        }
    };

    const handleUpdateReservationStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/reservations/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReservations();
        } catch (err) {
            alert('Failed to update reservation status');
        }
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/menu`, menuForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMenuForm({ name: '', description: '', price: '', category: 'main', image: '' });
            setShowAddMenu(false);
            fetchMenuItems();
        } catch (err) {
            alert('Failed to add menu item');
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (!confirm('Delete this menu item?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMenuItems();
        } catch (err) {
            alert('Failed to delete menu item');
        }
    };

    const handleToggleAvailability = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/menu/${id}/availability`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMenuItems();
        } catch (err) {
            alert('Failed to update availability');
        }
    };

    const handleAddOffer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/offers`, offerForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfferForm({ title: '', description: '', discount: '', validUntil: '', image: '' });
            setShowAddOffer(false);
            fetchOffers();
        } catch (err) {
            alert('Failed to add offer');
        }
    };

    const handleDeleteOffer = async (id) => {
        if (!confirm('Delete this offer?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/offers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOffers();
        } catch (err) {
            alert('Failed to delete offer');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your menu and offers</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'menu'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <UtensilsCrossed className="h-4 w-4 mr-2" />
                            Menu Items
                        </button>
                        <button
                            onClick={() => setActiveTab('offers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'offers'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Tag className="h-4 w-4 mr-2" />
                            Offers
                        </button>
                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'reservations'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Reservations
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'menu' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Menu Items ({menuItems.length})</h2>
                                <button
                                    onClick={() => setShowAddMenu(!showAddMenu)}
                                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </button>
                            </div>

                            {showAddMenu && (
                                <form onSubmit={handleAddMenuItem} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={menuForm.name}
                                                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={menuForm.price}
                                                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={menuForm.category}
                                                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="appetizer">Appetizer</option>
                                                <option value="main">Main Course</option>
                                                <option value="dessert">Dessert</option>
                                                <option value="drink">Drink</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                                            <input
                                                type="text"
                                                value={menuForm.image}
                                                onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={menuForm.description}
                                                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                                                rows="2"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                            Add Item
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddMenu(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {menuItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{item.category}</span>
                                                {!item.available && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Unavailable</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-orange-600 font-bold">${item.price}</span>
                                            <button
                                                onClick={() => handleToggleAvailability(item.id)}
                                                className="p-2 text-gray-600 hover:text-gray-900"
                                                title={item.available ? 'Mark unavailable' : 'Mark available'}
                                            >
                                                {item.available ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMenuItem(item.id)}
                                                className="p-2 text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {menuItems.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No menu items yet. Add your first item!</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'offers' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Active Offers ({offers.length})</h2>
                                <button
                                    onClick={() => setShowAddOffer(!showAddOffer)}
                                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Offer
                                </button>
                            </div>

                            {showAddOffer && (
                                <form onSubmit={handleAddOffer} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={offerForm.title}
                                                onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                            <input
                                                type="number"
                                                required
                                                value={offerForm.discount}
                                                onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                                            <input
                                                type="date"
                                                required
                                                value={offerForm.validUntil}
                                                onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                                            <input
                                                type="text"
                                                value={offerForm.image}
                                                onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                required
                                                value={offerForm.description}
                                                onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                                                rows="2"
                                                className="w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                            Add Offer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddOffer(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offers.map((offer) => (
                                    <div key={offer.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{offer.title}</h3>
                                            <button
                                                onClick={() => handleDeleteOffer(offer.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-semibold">
                                                {offer.discount}% OFF
                                            </span>
                                            <span className="text-gray-500">
                                                Until {new Date(offer.validUntil).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {offers.length === 0 && (
                                    <p className="col-span-2 text-center text-gray-500 py-8">No active offers. Create one to attract customers!</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Reservations ({reservations.length})</h2>
                            </div>

                            <div className="space-y-3">
                                {reservations.map((reservation) => {
                                    const statusColors = {
                                        pending: 'bg-yellow-100 text-yellow-800',
                                        confirmed: 'bg-green-100 text-green-800',
                                        cancelled: 'bg-red-100 text-red-800',
                                        completed: 'bg-gray-100 text-gray-800'
                                    };

                                    return (
                                        <div key={reservation.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="font-medium text-gray-900">
                                                            {reservation.user?.username || 'Unknown User'}
                                                        </h3>
                                                        <span className={`text-xs px-2 py-1 rounded ${statusColors[reservation.status]}`}>
                                                            {reservation.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {new Date(reservation.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {reservation.time}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1" />
                                                            {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                                                        </div>
                                                    </div>
                                                    {reservation.specialRequests && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
                                                        </p>
                                                    )}
                                                </div>
                                                {reservation.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {reservations.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No reservations yet. They will appear here when customers book!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
