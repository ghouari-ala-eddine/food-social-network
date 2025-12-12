import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MealPlanner = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
    const [mealPlan, setMealPlan] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [showRecipeSelector, setShowRecipeSelector] = useState(null); // { date, mealType }
    const [loading, setLoading] = useState(true);

    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMealPlan();
        fetchRecipes();
    }, [user, currentWeekStart]);

    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function getWeekDates() {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    const fetchMealPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const weekDates = getWeekDates();
            const startDate = formatDate(weekDates[0]);
            const endDate = formatDate(weekDates[6]);

            const res = await axios.get(`http://localhost:5000/api/meal-plan?startDate=${startDate}&endDate=${endDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Organize by date and meal type
            const organized = {};
            res.data.forEach(plan => {
                if (!organized[plan.date]) organized[plan.date] = {};
                organized[plan.date][plan.mealType] = plan;
            });
            setMealPlan(organized);
        } catch (err) {
            console.error('Failed to load meal plan');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/recipes');
            setRecipes(res.data);
        } catch (err) {
            console.error('Failed to load recipes');
        }
    };

    const addMeal = async (date, mealType, recipeId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/meal-plan', {
                date: formatDate(date),
                mealType,
                recipeId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMealPlan();
            setShowRecipeSelector(null);
        } catch (err) {
            alert('Failed to add meal');
        }
    };

    const removeMeal = async (mealPlanId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/meal-plan/${mealPlanId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMealPlan();
        } catch (err) {
            alert('Failed to remove meal');
        }
    };

    const previousWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    if (!user) return null;

    const weekDates = getWeekDates();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Calendar className="h-8 w-8 mr-3 text-orange-600" />
                    Meal Planner
                </h1>
                <div className="flex items-center space-x-4">
                    <button onClick={previousWeek} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-medium">
                        {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                    </span>
                    <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-8 border-b border-gray-200">
                        <div className="p-4 bg-gray-50 font-semibold text-gray-700"></div>
                        {weekDates.map((date, index) => (
                            <div key={index} className="p-4 bg-gray-50 text-center border-l border-gray-200">
                                <div className="font-semibold text-gray-700">{daysOfWeek[index]}</div>
                                <div className="text-sm text-gray-500">{date.getDate()}</div>
                            </div>
                        ))}
                    </div>

                    {mealTypes.map((mealType) => (
                        <div key={mealType} className="grid grid-cols-8 border-b border-gray-200">
                            <div className="p-4 bg-gray-50 font-medium text-gray-700 capitalize flex items-center border-r border-gray-200">
                                {mealType}
                            </div>
                            {weekDates.map((date, index) => {
                                const dateStr = formatDate(date);
                                const meal = mealPlan[dateStr]?.[mealType];

                                return (
                                    <div key={index} className="p-2 border-l border-gray-200 min-h-[100px] relative">
                                        {meal ? (
                                            <div className="bg-orange-50 border border-orange-200 rounded p-2 relative group">
                                                <button
                                                    onClick={() => removeMeal(meal.id)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {meal.recipe?.title || 'Unknown Recipe'}
                                                </div>
                                                {meal.recipe?.cookTime && (
                                                    <div className="text-xs text-gray-500 mt-1">{meal.recipe.cookTime} min</div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowRecipeSelector({ date, mealType })}
                                                className="w-full h-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                                            >
                                                <Plus className="h-6 w-6" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Recipe Selector Modal */}
            {showRecipeSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">Select a Recipe</h3>
                            <button onClick={() => setShowRecipeSelector(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {recipes.length === 0 ? (
                                <p className="text-center text-gray-600">No recipes available. Create some recipes first!</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {recipes.map((recipe) => (
                                        <button
                                            key={recipe.id}
                                            onClick={() => addMeal(showRecipeSelector.date, showRecipeSelector.mealType, recipe.id)}
                                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
                                        >
                                            <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center flex-shrink-0">
                                                {recipe.image ? (
                                                    <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover rounded" />
                                                ) : (
                                                    <span className="text-2xl">🍳</span>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-gray-900">{recipe.title}</h4>
                                                <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
                                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                    {recipe.cookTime && <span>{recipe.cookTime} min</span>}
                                                    <span className={`px-2 py-0.5 rounded ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {recipe.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
