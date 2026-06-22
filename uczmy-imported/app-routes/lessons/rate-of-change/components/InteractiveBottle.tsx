"use client";

import { useState } from "react";
import { MathJax } from "better-react-mathjax";

export default function InteractiveBottle() {
  const [time, setTime] = useState(3);
  const volume = 50 * time;
  const maxVolume = 500;
  const waterPercentage = (volume / maxVolume) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="flex flex-col space-y-6">
        <div>
          <label htmlFor="time-slider" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Czas (t) w sekundach: <span className="font-bold text-blue-600 dark:text-blue-400">{time.toFixed(1)}s</span>
          </label>
          <input
            id="time-slider" type="range" min="0" max="10" step="0.1"
            value={time} onChange={(e) => setTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-500"
          />
        </div>
        <div className="text-center text-lg p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700">
            <MathJax inline>{`Objętość po \\(t = ${time.toFixed(1)}\\)s wynosi:`}</MathJax>
            <MathJax>{`$$v(${time.toFixed(1)}) = 50 \\cdot ${time.toFixed(1)} = ${volume.toFixed(0)}ml$$`}</MathJax>
        </div>
      </div>
      <div className="flex justify-center items-end h-80">
        <div className="relative w-40 h-full border-4 border-slate-300 dark:border-slate-600 rounded-t-3xl bg-slate-100 dark:bg-slate-800/50 shadow-inner">
          <div
            className="absolute bottom-0 left-0 w-full bg-blue-500/80"
            style={{ height: `${waterPercentage}%`, transition: "height 0.1s linear" }}
          ></div>
           <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{volume.toFixed(0)} ml</span>
           </div>
        </div>
      </div>
    </div>
  );
}