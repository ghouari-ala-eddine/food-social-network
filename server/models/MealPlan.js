// In-memory meal plan storage
const mealPlans = [];
let mealPlanIdCounter = 1;

class MealPlan {
    constructor(data) {
        this.id = mealPlanIdCounter++;
        this.userId = data.userId;
        this.date = data.date; // YYYY-MM-DD format
        this.mealType = data.mealType; // breakfast, lunch, dinner
        this.recipeId = data.recipeId;
        this.createdAt = new Date();
    }

    static async create(mealPlanData) {
        const mealPlan = new MealPlan(mealPlanData);
        mealPlans.push(mealPlan);
        return mealPlan;
    }

    static async findByUser(userId) {
        return mealPlans.filter(plan => plan.userId === userId);
    }

    static async findByUserAndDateRange(userId, startDate, endDate) {
        return mealPlans.filter(plan =>
            plan.userId === userId &&
            plan.date >= startDate &&
            plan.date <= endDate
        );
    }

    static async findById(id) {
        return mealPlans.find(plan => plan.id === parseInt(id));
    }

    static async delete(id) {
        const index = mealPlans.findIndex(plan => plan.id === parseInt(id));
        if (index === -1) return null;

        const deleted = mealPlans.splice(index, 1);
        return deleted[0];
    }

    static async deleteByUserDateAndMeal(userId, date, mealType) {
        const index = mealPlans.findIndex(plan =>
            plan.userId === userId &&
            plan.date === date &&
            plan.mealType === mealType
        );
        if (index === -1) return null;

        const deleted = mealPlans.splice(index, 1);
        return deleted[0];
    }
}

module.exports = MealPlan;
