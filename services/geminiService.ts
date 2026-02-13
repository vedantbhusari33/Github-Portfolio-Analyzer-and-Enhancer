
import { GoogleGenAI, Type } from "@google/genai";
import { GitHubUser, GitHubRepo, AnalysisResult, DeveloperRole } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePortfolio(
  user: GitHubUser, 
  repos: GitHubRepo[], 
  role: DeveloperRole = 'General'
): Promise<AnalysisResult> {
  const repoData = repos.map(r => ({
    name: r.name,
    desc: r.description,
    stars: r.stargazers_count,
    lang: r.language,
    topics: r.topics,
    readmeSnippet: r.readme ? r.readme.substring(0, 1000) : 'No README provided'
  }));

  const prompt = `Analyze this GitHub profile for a developer portfolio for a ${role} role.
User: ${user.name} (@${user.login}), Bio: ${user.bio}, Repos: ${user.public_repos}.
Key Repositories: ${JSON.stringify(repoData)}

Specific Analysis Tasks:
1. Recruiter View: Provide hire signals, risks, and a concise verdict.
2. Storytelling: For each repo, check if it explains: Problem solved, Who it's for, Why it matters, What's different.
3. Fake Detection: Identify tutorial clones or copy-pasted low-effort repos.
4. Strategy: Suggest exactly which repos to archive, pin, or improve.
5. Roadmap: Provide a 7, 30, and 90-day improvement plan.
6. Simulation: Predict their score after following your top 3 fixes.
7. Confidence Score: 0-100% recruiter confidence based on consistency and clarity.

Return strictly as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          recruiterConfidence: { type: Type.NUMBER },
          projectedScoreAfterFixes: { type: Type.NUMBER },
          subScores: {
            type: Type.OBJECT,
            properties: {
              documentation: { type: Type.NUMBER },
              codeStructure: { type: Type.NUMBER },
              activityConsistency: { type: Type.NUMBER },
              organization: { type: Type.NUMBER },
              impact: { type: Type.NUMBER },
              technicalDepth: { type: Type.NUMBER },
            },
            required: ["documentation", "codeStructure", "activityConsistency", "organization", "impact", "technicalDepth"]
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          careerBenchmark: { type: Type.STRING },
          recruiterSummary: {
            type: Type.OBJECT,
            properties: {
              hireSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              verdict: { type: Type.STRING },
              quickSummary: { type: Type.STRING }
            },
            required: ["hireSignals", "risks", "verdict", "quickSummary"]
          },
          impactHeatmap: {
            type: Type.OBJECT,
            properties: {
              documentation: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
              codeDepth: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
              consistency: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
              realWorldImpact: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] }
            },
            required: ["documentation", "codeDepth", "consistency", "realWorldImpact"]
          },
          archiveStrategy: {
            type: Type.OBJECT,
            properties: {
              toArchive: { type: Type.ARRAY, items: { type: Type.STRING } },
              toPin: { type: Type.ARRAY, items: { type: Type.STRING } },
              toImprove: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["toArchive", "toPin", "toImprove"]
          },
          growthRoadmap: {
            type: Type.OBJECT,
            properties: {
              sevenDays: { type: Type.ARRAY, items: { type: Type.STRING } },
              thirtyDays: { type: Type.ARRAY, items: { type: Type.STRING } },
              ninetyDays: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["sevenDays", "thirtyDays", "ninetyDays"]
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["title", "description", "priority"]
            }
          },
          repoSummaries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                suggestedName: { type: Type.STRING },
                summary: { type: Type.STRING },
                score: { type: Type.NUMBER },
                elevatorPitch: { type: Type.STRING },
                isFakeOrTutorial: { type: Type.BOOLEAN },
                fakeReason: { type: Type.STRING },
                storytelling: {
                  type: Type.OBJECT,
                  properties: {
                    problemSolved: { type: Type.BOOLEAN },
                    targetAudience: { type: Type.BOOLEAN },
                    valueProposition: { type: Type.BOOLEAN },
                    differentiation: { type: Type.BOOLEAN }
                  },
                  required: ["problemSolved", "targetAudience", "valueProposition", "differentiation"]
                }
              },
              required: ["name", "suggestedName", "summary", "score", "elevatorPitch", "isFakeOrTutorial", "storytelling"]
            }
          }
        },
        required: [
          "overallScore", "recruiterConfidence", "projectedScoreAfterFixes", "subScores", 
          "strengths", "redFlags", "recommendations", "repoSummaries", "careerBenchmark",
          "recruiterSummary", "impactHeatmap", "archiveStrategy", "growthRoadmap"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text);
}
