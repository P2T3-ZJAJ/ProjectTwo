import React from 'react';

import type { Mealinfo } from "../interfaces/UserData";
// import auth from '../utils/AuthService';

// Define the props for the component
interface MealinfoProps {
    meals: Mealinfo[] | null; // users can be an array of UserData objects or null
}

const UserList: React.FC<MealinfoProps> = ({ meals }) => {
    return (
        <>
            <h2 className="pb-5">
                Check out all your Recipies!
            </h2>
            {meals && meals.map((meals) => (
                <div className="row align-center mb-5" key={meals.id}>
                    <div className="col-md-6">
                        <h3>{meals.id}. {meals.calories}</h3>
                    </div>
                </div>
            ))}
        </>
    );
};

export default UserList;
