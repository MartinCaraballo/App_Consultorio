'use client'

import React, {useState} from "react";

export default function WeekdayBar() {
    const today = new Date().getDay() - 1;
    const dayToHighlight = today > 0 ? today : 0;

    const week = () => {
        let week = [];
        let current = new Date();
        // set to monday.
        current.setDate((current.getDate() - current.getDay() + 1));
        for (let i = 0; i < 6; i++) {
            week.push(
                new Date(current)
            );
            current.setDate(current.getDate() + 1);
        }
        return week;
    }
    const daysNameOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const [selectedDay, setSelectedDay] = useState(daysNameOfWeek[dayToHighlight]);

    return (
        <div className="flex justify-center p-2 border-gray-300 rounded-lg">
            <div className="inline-flex overflow-x-auto max-w-full font-bold">
                {week().map((day, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedDay(daysNameOfWeek[index])}
                        className={`flex-shrink-0 w-28 text-center py-2 cursor-pointer ${
                            selectedDay === daysNameOfWeek[index] ? 'bg-gray-600 text-white' : 'text-gray-700'
                        } rounded-lg transition-colors duration-300`}
                    >
                        {`${daysNameOfWeek[index]} ${day.getDate()}`}
                    </div>
                ))}
            </div>
        </div>
    );
}