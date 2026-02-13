
import React, { useState } from 'react';
import Layout from './components/Layout';
import ScoreVisualizer from './components/ScoreVisualizer';
import Recommendations from './components/Recommendations';
import { fetchGitHubData, extractUsername } from './services/githubService';
import { analyzePortfolio } from './services/geminiService';
import { GitHubUser, GitHubRepo, AnalysisResult, DeveloperRole } from './types';

const ROLES: DeveloperRole[] = ['General', 'Frontend', 'Backend', 'Fullstack', 'AI/ML', 'Mobile'];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [selectedRole, setSelectedRole] = useState<DeveloperRole>('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ user: GitHubUser; repos: GitHubRepo[] } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('Initializing analysis...');
  const [recruiterMode, setRecruiterMode] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = extractUsername(url);
    if (!username) {
      setError('Please enter a valid GitHub username or URL');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setResult(null);

    try {
      setLoadingMsg(`Accessing GitHub API for @${username}...`);
      const gitHubData = await fetchGitHubData(username);
      setData(gitHubData);

      setLoadingMsg(`AI is auditing your portfolio for ${selectedRole} standards...`);
      const analysis = await analyzePortfolio(gitHubData.user, gitHubData.repos, selectedRole);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (level: string) => {
    switch (level) {
      case 'Green': return 'bg-emerald-500';
      case 'Yellow': return 'bg-amber-400';
      case 'Red': return 'bg-rose-500';
      default: return 'bg-slate-200';
    }
  };

  const handleReset = () => {
    setData(null);
    setResult(null);
    setUrl('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* INPUT VIEW */}
        {!data && !loading && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Recruiter-Ready <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">GitHub Audit</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find tutorial clones, measure real-world impact, and see your 90-day growth roadmap.
            </p>
            
            <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fa-brands fa-github text-slate-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="github.com/username"
                    className="block w-full pl-11 pr-3 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg shadow-sm"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
                >
                  {loading ? (
                    <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Auditing...</>
                  ) : (
                    'Audit My Profile'
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">Focus Role:</span>
                <div className="flex gap-2 flex-wrap">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedRole === role 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </form>
            {error && <p className="mt-6 text-rose-500 font-bold bg-rose-50 inline-block px-6 py-3 rounded-2xl border border-rose-100">{error}</p>}
          </div>
        )}

        {/* LOADING VIEW */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-32 h-32 mb-10">
               <div className="absolute inset-0 border-8 border-indigo-50 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fa-brands fa-github text-5xl text-indigo-600"></i>
               </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">AI Analysis in Progress</h2>
            <p className="text-slate-500 font-medium text-lg animate-pulse">{loadingMsg}</p>
          </div>
        )}

        {/* RESULTS VIEW */}
        {data && result && !loading && (
          <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header with Mode Toggle and Reset Button at start */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleReset}
                  className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors font-bold flex items-center"
                  title="Start Over"
                >
                  <i className="fa-solid fa-rotate-left mr-2"></i> Reset
                </button>
                <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
                <img src={data.user.avatar_url} className="w-12 h-12 rounded-xl shadow-md" alt="Avatar" />
                <div>
                  <h2 className="font-black text-slate-900 leading-tight">{data.user.name || data.user.login}</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedRole} Professional</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black uppercase transition-colors ${!recruiterMode ? 'text-indigo-600' : 'text-slate-400'}`}>Student</span>
                <button 
                  onClick={() => setRecruiterMode(!recruiterMode)}
                  className={`w-14 h-7 rounded-full relative transition-all duration-300 ${recruiterMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${recruiterMode ? 'left-8' : 'left-1'}`} />
                </button>
                <span className={`text-xs font-black uppercase transition-colors ${recruiterMode ? 'text-indigo-600' : 'text-slate-400'}`}>Recruiter</span>
                <button 
                  onClick={handlePrint} 
                  className="ml-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-black flex items-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <i className="fa-solid fa-file-pdf mr-2"></i> Export Resume
                </button>
              </div>
            </div>

            {/* MAIN DASHBOARD CONTENT */}
            <div className="space-y-8 print:hidden">
              {!recruiterMode ? (
                /* STUDENT VIEW */
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                      <ScoreVisualizer result={result} repos={data.repos} />
                    </div>
                    <div className="lg:col-span-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-[2rem] border border-indigo-100 h-full flex flex-col justify-center text-center">
                         <h3 className="text-sm font-black text-indigo-400 uppercase mb-2 tracking-widest">Growth Potential</h3>
                         <div className="flex items-center justify-center gap-6 mb-4">
                            <div className="flex flex-col">
                               <span className="text-slate-400 text-[10px] font-black uppercase">Current</span>
                               <span className="text-3xl font-black text-slate-500">{result.overallScore}</span>
                            </div>
                            <i className="fa-solid fa-arrow-trend-up text-indigo-400 text-xl"></i>
                            <div className="flex flex-col">
                               <span className="text-indigo-600 text-[10px] font-black uppercase">Simulated</span>
                               <span className="text-5xl font-black text-indigo-600">{result.projectedScoreAfterFixes}</span>
                            </div>
                         </div>
                         <p className="text-xs font-bold text-slate-500 leading-relaxed">By fixing identified red flags, your hireability score could jump significantly.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {Object.entries(result.impactHeatmap).map(([key, value]) => (
                      <div key={key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`text-sm font-black ${value === 'Green' ? 'text-emerald-600' : value === 'Yellow' ? 'text-amber-500' : 'text-rose-500'}`}>{value}</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getHeatmapColor(value)} shadow-sm`}></div>
                      </div>
                    ))}
                  </div>

                  <Recommendations result={result} />
                  
                  {/* Roadmap Section */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                      <i className="fa-solid fa-map-location-dot text-indigo-600 mr-4"></i>
                      90-Day Success Roadmap
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-indigo-600 text-xs uppercase tracking-widest flex items-center">
                          <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-[10px]">FIX</span>
                          Immediate (7 Days)
                        </h4>
                        <ul className="space-y-3">
                          {result.growthRoadmap.sevenDays.map((item, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start leading-relaxed">
                              <i className="fa-solid fa-circle-check text-indigo-400 mt-1 mr-3 text-[10px]"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-l border-slate-100 pl-8">
                        <h4 className="font-bold text-violet-600 text-xs uppercase tracking-widest flex items-center">
                           <span className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center mr-3 text-[10px]">DEV</span>
                           Short-term (30 Days)
                        </h4>
                        <ul className="space-y-3">
                          {result.growthRoadmap.thirtyDays.map((item, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start leading-relaxed">
                              <i className="fa-solid fa-circle-check text-violet-400 mt-1 mr-3 text-[10px]"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-l border-slate-100 pl-8">
                        <h4 className="font-bold text-emerald-600 text-xs uppercase tracking-widest flex items-center">
                           <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3 text-[10px]">NET</span>
                           Long-term (90 Days)
                        </h4>
                        <ul className="space-y-3">
                          {result.growthRoadmap.ninetyDays.map((item, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start leading-relaxed">
                              <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3 text-[10px]"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* RECRUITER MODE VIEW */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><i className="fa-solid fa-user-tie text-9xl"></i></div>
                      <h3 className="text-3xl font-black mb-6">Recruiter Verdict</h3>
                      <p className="text-slate-400 leading-relaxed text-lg mb-8">{result.recruiterSummary.quickSummary}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div>
                          <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">Hiring Signals</h4>
                          <ul className="space-y-3">
                            {result.recruiterSummary.hireSignals.map((sig, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <i className="fa-solid fa-check-circle text-emerald-400 mt-1 mr-3"></i>
                                {sig}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-4">Hiring Risks</h4>
                          <ul className="space-y-3">
                            {result.recruiterSummary.risks.map((risk, i) => (
                              <li key={i} className="flex items-start text-sm text-slate-300">
                                <i className="fa-solid fa-triangle-exclamation text-rose-400 mt-1 mr-3"></i>
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
                         <div>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Recruiter Confidence</span>
                            <span className="text-4xl font-black text-indigo-400">{result.recruiterConfidence}%</span>
                         </div>
                         <div className="bg-indigo-600 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                            Verdict: {result.recruiterSummary.verdict}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-black text-slate-900">Project Integrity Audit</h3>
                      <div className="grid grid-cols-1 gap-6">
                        {result.repoSummaries.map((repo, i) => (
                          <div key={i} className={`p-8 rounded-3xl border ${repo.isFakeOrTutorial ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-200'} shadow-sm group hover:shadow-md transition-all`}>
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="font-black text-xl text-slate-900 flex items-center">
                                  {repo.name}
                                  {repo.isFakeOrTutorial && <span className="ml-3 bg-rose-100 text-rose-700 text-[10px] px-2 py-1 rounded-full uppercase font-black">Tutorial detected</span>}
                                </h4>
                                <p className="text-sm text-indigo-600 font-bold mt-1">AI Pitch: {repo.suggestedName}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-3xl font-black text-slate-900">{repo.score}</span>
                                <span className="text-[10px] text-slate-400 block font-black uppercase">Impact</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed italic">"{repo.elevatorPitch}"</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                              {Object.entries(repo.storytelling).map(([key, val]) => (
                                <div key={key} className={`text-[10px] font-black px-3 py-2 rounded-xl flex items-center justify-center border ${val ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                  <i className={`fa-solid ${val ? 'fa-check-circle' : 'fa-circle-xmark'} mr-2`}></i>
                                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                </div>
                              ))}
                            </div>
                            
                            {repo.isFakeOrTutorial && (
                              <div className="p-4 bg-white/50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium flex items-start">
                                <i className="fa-solid fa-lightbulb mt-0.5 mr-3"></i>
                                {repo.fakeReason || "This project shows low original activity or matches known tutorial patterns."}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-black text-slate-900 uppercase mb-6 tracking-widest border-b border-slate-100 pb-2">Archive Engine</h3>
                      <div className="space-y-6">
                         <div>
                            <span className="text-[10px] font-black text-rose-500 uppercase mb-3 block">High Noise (Archive)</span>
                            <div className="flex flex-wrap gap-2">
                               {result.archiveStrategy.toArchive.length > 0 ? 
                                 result.archiveStrategy.toArchive.map(name => (
                                   <span key={name} className="bg-rose-50 text-rose-700 text-[10px] px-3 py-1.5 rounded-xl border border-rose-100 font-bold">{name}</span>
                                 )) : <span className="text-xs text-slate-400 italic">None suggested</span>}
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase mb-3 block">High Signal (Pin)</span>
                            <div className="flex flex-wrap gap-2">
                               {result.archiveStrategy.toPin.map(name => (
                                 <span key={name} className="bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1.5 rounded-xl border border-emerald-100 font-bold">{name}</span>
                               ))}
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase mb-3 block">Needs Polish</span>
                            <div className="flex flex-wrap gap-2">
                               {result.archiveStrategy.toImprove.map(name => (
                                 <span key={name} className="bg-indigo-50 text-indigo-700 text-[10px] px-3 py-1.5 rounded-xl border border-indigo-100 font-bold">{name}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl">
                      <h4 className="font-black uppercase text-xs tracking-widest mb-4">Resume Heatmap</h4>
                      <div className="space-y-4">
                        {Object.entries(result.impactHeatmap).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between bg-white/10 p-4 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <div className={`w-4 h-4 rounded-full shadow-lg ${getHeatmapColor(value)} border-2 border-white/20`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* RESUME PDF SNAPSHOT (Hidden from UI, visible only for PDF/Print) */}
            <div className="hidden print:block print:p-0 print:m-0 bg-white min-h-screen text-slate-900">
              <div className="max-w-[800px] mx-auto p-12 space-y-10">
                {/* Header */}
                <header className="flex justify-between items-start border-b-4 border-slate-900 pb-10">
                  <div>
                    <h1 className="text-5xl font-black mb-2 tracking-tight uppercase">{data.user.name || data.user.login}</h1>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">{selectedRole} Developer</p>
                    <div className="flex gap-4 text-slate-500 font-bold text-sm">
                      <span><i className="fa-brands fa-github mr-2"></i>github.com/{data.user.login}</span>
                      {data.user.bio && <span><i className="fa-solid fa-user mr-2"></i>{data.user.bio}</span>}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl inline-block shadow-xl">
                      <span className="block text-[10px] font-black uppercase mb-1 tracking-widest">Verification Score</span>
                      <span className="text-5xl font-black">{result.overallScore}</span>
                      <span className="text-xl text-slate-500">/100</span>
                    </div>
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Benchmark: {result.careerBenchmark}</p>
                  </div>
                </header>

                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-8 space-y-10">
                    {/* Verdict */}
                    <section>
                      <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-6 pb-2 text-slate-800 tracking-widest">Recruiter Verdict</h3>
                      <p className="text-lg leading-relaxed font-medium text-slate-700 italic">"{result.recruiterSummary.verdict}"</p>
                      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{result.recruiterSummary.quickSummary}</p>
                    </section>

                    {/* Featured Projects */}
                    <section>
                      <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-6 pb-2 text-slate-800 tracking-widest">Project Highlights</h3>
                      <div className="space-y-8">
                        {result.repoSummaries.slice(0, 3).map((repo, i) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-xl font-black text-slate-900">{repo.suggestedName}</h4>
                              <span className="text-sm font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Impact Score: {repo.score}</span>
                            </div>
                            <p className="text-sm font-bold text-indigo-600 mb-2">{repo.elevatorPitch}</p>
                            <p className="text-sm leading-relaxed text-slate-600">{repo.summary}</p>
                            <div className="flex gap-3 mt-3">
                              {repo.storytelling.problemSolved && <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 uppercase">Problem Solved</span>}
                              {repo.storytelling.differentiation && <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 uppercase">Unique Edge</span>}
                              <span className="text-[9px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100 uppercase">{data.repos.find(r => r.name === repo.name)?.language || 'GitHub Topic'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="col-span-4 space-y-10">
                    {/* Strengths */}
                    <section>
                      <h3 className="text-sm font-black uppercase border-b border-slate-200 mb-4 pb-1 text-slate-800 tracking-widest">Key Strengths</h3>
                      <ul className="space-y-3">
                        {result.strengths.slice(0, 4).map((s, i) => (
                          <li key={i} className="text-xs font-bold text-slate-700 flex items-start">
                            <i className="fa-solid fa-check text-emerald-500 mt-0.5 mr-2"></i>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Potential */}
                    <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                      <h3 className="text-xs font-black uppercase text-indigo-600 mb-3 tracking-widest">Growth Potential</h3>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-indigo-600">{result.projectedScoreAfterFixes}</span>
                        <i className="fa-solid fa-arrow-up text-emerald-500"></i>
                      </div>
                      <p className="text-[10px] font-bold text-indigo-400 leading-relaxed uppercase">Simulated score after recommended AI optimizations</p>
                    </section>

                    {/* Heatmap */}
                    <section>
                      <h3 className="text-sm font-black uppercase border-b border-slate-200 mb-4 pb-1 text-slate-800 tracking-widest">Portfolio Health</h3>
                      <div className="space-y-3">
                        {Object.entries(result.impactHeatmap).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${getHeatmapColor(value)}`} />
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Tech Stack */}
                    <section>
                      <h3 className="text-sm font-black uppercase border-b border-slate-200 mb-4 pb-1 text-slate-800 tracking-widest">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(data.repos.map(r => r.language).filter(Boolean))).slice(0, 8).map(l => (
                          <span key={l} className="bg-slate-900 text-white px-2 py-1 text-[10px] font-black rounded-lg uppercase">{l}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>

                {/* Footer */}
                <footer className="border-t-2 border-slate-100 pt-8 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Verified GitHub Professional Audit</span>
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>Recruiter Confidence: {result.recruiterConfidence}%</span>
                </footer>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
