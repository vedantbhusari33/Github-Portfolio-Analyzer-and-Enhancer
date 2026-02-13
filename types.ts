
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  html_url: string;
  homepage: string;
  size: number;
  readme?: string;
}

export interface SubScores {
  documentation: number;
  codeStructure: number;
  activityConsistency: number;
  organization: number;
  impact: number;
  technicalDepth: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RepoSummary {
  name: string;
  suggestedName: string;
  summary: string;
  score: number;
  elevatorPitch: string;
  isFakeOrTutorial: boolean;
  fakeReason?: string;
  storytelling: {
    problemSolved: boolean;
    targetAudience: boolean;
    valueProposition: boolean;
    differentiation: boolean;
  };
}

export interface AnalysisResult {
  overallScore: number;
  recruiterConfidence: number;
  projectedScoreAfterFixes: number;
  subScores: SubScores;
  strengths: string[];
  redFlags: string[];
  recommendations: Recommendation[];
  repoSummaries: RepoSummary[];
  careerBenchmark: string;
  recruiterSummary: {
    hireSignals: string[];
    risks: string[];
    verdict: string;
    quickSummary: string;
  };
  impactHeatmap: {
    documentation: 'Green' | 'Yellow' | 'Red';
    codeDepth: 'Green' | 'Yellow' | 'Red';
    consistency: 'Green' | 'Yellow' | 'Red';
    realWorldImpact: 'Green' | 'Yellow' | 'Red';
  };
  archiveStrategy: {
    toArchive: string[];
    toPin: string[];
    toImprove: string[];
  };
  growthRoadmap: {
    sevenDays: string[];
    thirtyDays: string[];
    ninetyDays: string[];
  };
}

export type DeveloperRole = 'General' | 'Frontend' | 'Backend' | 'Fullstack' | 'AI/ML' | 'Mobile';
