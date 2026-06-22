"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

const data = Array.from({ length: 11 }, (_, i) => ({
  time: i,
  volume: 50 * i,
}));

export default function InteractiveChart() {
    const [currentTime, setCurrentTime] = useState(5);

    return (
        <div className="flex flex-col gap-8">
            <p className="text-lg text-slate-600 dark:text-slate-300">
                Tę samą zależność możemy przedstawić na wykresie. Oś pozioma (x) to czas, a oś pionowa (y) to objętość. Zobacz, że nasza zależność tworzy linię prostą!
            </p>
            <div className='w-full h-96'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="time" label={{ value: 'Czas (s)', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Objętość (ml)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            formatter={(value, name) => [`${value} ml`, 'Objętość']}
                            labelFormatter={(label) => `Czas: ${label}s`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                        <ReferenceDot 
                            x={currentTime} 
                            y={50 * currentTime} 
                            r={8} 
                            fill="#3b82f6" 
                            stroke="white"
                            // Błędna właściwość 'isFront' została usunięta
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <div>
                <label htmlFor="chart-slider" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Przesuwaj suwak, aby poruszać punktem na wykresie:
                </label>
                <input
                    id="chart-slider"
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 mt-2"
                />
            </div>
        </div>
    );
}