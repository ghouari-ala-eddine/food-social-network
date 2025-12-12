const storage = require('../utils/storage');

const COLLECTION = 'mealplans';

class MealPlan {
    constructor(data) {
        this.userId = data.userId;
        this.date = data.date;
        this.mealType = data.mealType;
        this.recipeId = data.recipeId;
        this.createdAt = new Date().toISOString();
    }

    static async create(mealPlanData) {
        const mealPlan = new MealPlan(mealPlanData);
        return storage.addItem(COLLECTION, mealPlan);
    }

    static async findByUser(userId) {
        return storage.findMany(COLLECTION, { userId });
    }

    static async findByUserAndDateRange(userId, startDate, endDate) {
        const plans = storage.getAll(COLLECTION);
        return plans.filter(plan =>
            plan.userId === userId &&
            plan.date >= startDate &&
            plan.date <= endDate
        );
    }

    static async findById(id) {
        return storage.findById(COLLECTION, id);
    }

    static async delete(id) {
        return storage.deleteById(COLLECTION, id);
    }

    static async deleteByUserDateAndMeal(userId, date, mealType) {
        const plans = storage.getAll(COLLECTION);
        const plan = plans.find(p =>
            p.userId === userId &&
            p.date === date &&
            p.mealType === mealType
        );
        if (plan) {
            return storage.deleteById(COLLECTION, plan.id);
        }
        return null;
    }
}

module.exports = MealPlan;
