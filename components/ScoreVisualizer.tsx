
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SubScores, AnalysisResult, GitHubRepo } from '../types';

interface ScoreVisualizerProps {
  result: AnalysisResult;
  repos: GitHubRepo[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({ result, repos }) => {
  const radarData = [
    { subject: 'Documentation', A: result.subScores.documentation, fullMark: 100 },
    { subject: 'Code Structure', A: result.subScores.codeStructure, fullMark: 100 },
    { subject: 'Consistency', A: result.subScores.activityConsistency, fullMark: 100 },
    { subject: 'Organization', A: result.subScores.organization, fullMark: 100 },
    { subject: 'Impact', A: result.subScores.impact, fullMark: 100 },
    { subject: 'Depth', A: result.subScores.technicalDepth, fullMark: 100 },
  ];

  const languageMap: Record<string, number> = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });
  const languageData = Object.entries(languageMap).map(([name, value]) => ({ name, value }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Overall Score Card */}
      <div className={`col-span-1 lg:col-span-1 p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center shadow-sm ${getScoreBg(result.overallScore)}`}>
        <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Portfolio Score</h3>
        <div className={`text-7xl font-black mb-4 ${getScoreColor(result.overallScore)}`}>
          {result.overallScore}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${result.overallScore >= 80 ? 'bg-emerald-500' : result.overallScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${result.overallScore}%` }}
          />
        </div>
        <div className="bg-white/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight text-slate-600 mb-1">
          {result.careerBenchmark}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="col-span-1 lg:col-span-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-tighter">Skill Matrix</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="col-span-1 lg:col-span-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-tighter">Stack Diversity</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {languageData.slice(0, 3).map((lang, i) => (
            <span key={lang.name} className="flex items-center text-[10px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
              {lang.name}
            </span>
          ))}
        </div>
      </div>

      {/* Benchmark Bar */}
      <div className="col-span-1 lg:col-span-1 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-tighter">Benchmarking</h3>
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Your Level
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {result.overallScore}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div style={{ width: `${result.overallScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
             <span>Junior (40)</span>
             <span>Mid (75)</span>
             <span>Elite (90+)</span>
          </div>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <i className="fa-solid fa-lightbulb text-amber-500 mr-2"></i>
            {result.overallScore < 70 
              ? "Focus on README detail to jump to Mid-level." 
              : "High documentation quality. Try increasing impact next."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreVisualizer;
