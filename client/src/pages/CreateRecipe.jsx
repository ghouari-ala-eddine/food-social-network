import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

const CreateRecipe = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [image, setImage] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const addIngredient = () => setIngredients([...ingredients, '']);
    const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
    const updateIngredient = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addInstruction = () => setInstructions([...instructions, '']);
    const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));
    const updateInstruction = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
            const filteredInstructions = instructions.filter(inst => inst.trim() !== '');

            await axios.post('http://localhost:5000/api/recipes', {
                title,
                description,
                ingredients: filteredIngredients,
                instructions: filteredInstructions,
                cookTime,
                servings: parseInt(servings),
                difficulty,
                image
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/recipes');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to create a recipe</h2>
                <button onClick={() => navigate('/login')} className="text-orange-600 hover:text-orange-700">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Chocolate Chip Cookies"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Brief description of your recipe..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min)</label>
                        <input
                            type="number"
                            value={cookTime}
                            onChange={(e) => setCookTime(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                        <input
                            type="number"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => updateIngredient(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g., 2 cups flour"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="mt-2 flex items-center text-orange-600 hover:text-orange-700"
                    >
                        <Plus className="h-5 w-5 mr-1" /> Add Ingredient
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
                    {instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-md font-semibold">
                                {index + 1}
                            </span>
                            <textarea
                                value={instruction}
                                onChange={(e) => updateInstruction(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Describe this step..."
                                rows="2"
                            />
                            <button
                                type="button"
                                onClick={() => removeInstruction(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addInstruction}
                        className="mt-2 flex items-center text-orange-600 hover:text-orange-700"
                    >
                        <Plus className="h-5 w-5 mr-1" /> Add Step
                    </button>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 disabled:bg-gray-400 font-medium"
                    >
                        {loading ? 'Creating...' : 'Create Recipe'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/recipes')}
                        className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
