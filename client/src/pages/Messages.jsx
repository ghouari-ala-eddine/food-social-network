import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { MessageCircle, Search } from 'lucide-react';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConversations();
    }, [user, navigate]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/messages/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
        } catch (err) {
            console.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MessageCircle className="h-8 w-8 mr-3 text-orange-600" />
                    Messages
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                {conversations.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-xl text-gray-600">No messages yet</p>
                        <p className="text-gray-500 mt-2">Start a conversation by visiting a user's profile</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {conversations.map((conversation) => (
                            <Link
                                key={conversation.partner.id}
                                to={`/messages/${conversation.partner.id}`}
                                className="block p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    {conversation.partner.profilePicture ? (
                                        <img
                                            src={conversation.partner.profilePicture}
                                            alt={conversation.partner.username}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {conversation.partner.username[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {conversation.partner.username}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                                {conversation.lastMessage.senderId === user._id ? 'You: ' : ''}
                                                {conversation.lastMessage.content}
                                            </p>
                                            {conversation.unreadCount > 0 && (
                                                <span className="ml-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
