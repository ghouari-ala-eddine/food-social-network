import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MealPlanner from './pages/MealPlanner';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Offers from './pages/Offers';
import RestaurantProfile from './pages/RestaurantProfile';
import RestaurantDashboard from './pages/RestaurantDashboard';
import Reservations from './pages/Reservations';
import NearbyRestaurants from './pages/NearbyRestaurants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/create" element={<CreateRecipe />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="planner" element={<MealPlanner />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Chat />} />
            <Route path="offers" element={<Offers />} />
            <Route path="restaurant/:id" element={<RestaurantProfile />} />
            <Route path="restaurant-dashboard" element={<RestaurantDashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="nearby" element={<NearbyRestaurants />} />
            {/* Add more routes here later */}
            <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
