import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-orange-50 to-white">
            <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Discover & Share <span className="text-orange-500">Culinary Magic</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    Join our community of food lovers. Find recipes by ingredients you have, plan your meals, and share your masterpieces.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/recipes" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10 transition duration-300 shadow-lg hover:shadow-xl">
                        Explore Recipes <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition duration-300 shadow-sm hover:shadow-md">
                        Join Now
                    </Link>
                </div>
            </div>

            {/* Feature Grid Placeholder */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🥗</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
                    <p className="text-gray-500">Find recipes based on ingredients currently in your fridge.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📅</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Meal Planner</h3>
                    <p className="text-gray-500">Organize your weekly meals and generate shopping lists automatically.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👨‍🍳</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Social Cooking</h3>
                    <p className="text-gray-500">Follow chefs, share your creations, and get inspired by the community.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
