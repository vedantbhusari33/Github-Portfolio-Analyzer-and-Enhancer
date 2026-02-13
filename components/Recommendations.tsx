
import React from 'react';
import { AnalysisResult } from '../types';

interface RecommendationsProps {
  result: AnalysisResult;
}

const Recommendations: React.FC<RecommendationsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      {/* Actionable Suggestions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <i className="fa-solid fa-bolt text-indigo-500 mr-3"></i>
          Actionable Next Steps
        </h3>
        <div className="space-y-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                rec.priority === 'High' ? 'bg-rose-500' : rec.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{rec.title}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  rec.priority === 'High' ? 'bg-rose-100 text-rose-700' : rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Red Flags */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-500 mr-3"></i>
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((str, i) => (
              <li key={i} className="flex items-start text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <i className="fa-solid fa-check text-emerald-500 mt-1 mr-3 text-sm"></i>
                <span className="text-sm font-medium">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <i className="fa-solid fa-circle-exclamation text-rose-500 mr-3"></i>
            Red Flags & Risks
          </h3>
          <ul className="space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start text-slate-700 bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                <i className="fa-solid fa-triangle-exclamation text-rose-500 mt-1 mr-3 text-sm"></i>
                <span className="text-sm font-medium">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
