
# GitHub Portfolio Analyzer & Enhancer

### Problem Statement
Recruiters scan GitHub profiles in seconds. Students often lack the narrative depth, consistency signals, or "impact-first" presentation needed to pass these audits. This tool uses AI to transform a basic profile into a professional developer showcase.

### 10 Innovative Features Added:
1. **Recruiter View Mode**: A high-impact toggle to see hire signals, risks, and quick verdicts.
2. **GitHub Resume Snapshot**: One-click generation of a clean, project-focused one-page resume.
3. **Impact Signal Heatmap**: Visual green/yellow/red indicators for Documentation, Depth, Consistency, and Impact.
4. **Project Storytelling Score**: AI audit to see if projects answer the "What, Who, Why, and How".
5. **Fake Project Detector**: Automatic identification of tutorial clones and low-effort copy-pastes.
6. **Archive Recommendation Engine**: Specific advice on which repos to pin for visibility vs archive for cleanliness.
7. **Recruiter Confidence Score**: A percentage metric based on clarity and identity consistency.
8. **Growth Roadmap Timeline**: A concrete 7-day, 30-day, and 90-day action plan for the developer.
9. **Before vs After Simulation**: See your potential portfolio score after implementing the AI's top fixes.
10. **Role-Specific Benchmarking**: Audits tailored for Frontend, Backend, AI/ML, and Mobile roles.

### Tech Stack
- **AI**: Gemini 3 Flash for deep portfolio reasoning.
- **Frontend**: React 18, Recharts (Radar/Pie), Tailwind CSS.
- **API**: GitHub REST API.

### How to Run
1. Install: `npm install`
2. Configure: `process.env.API_KEY` with your Gemini key.
3. Start: `npm run dev`

### Scoring Explanation
Scores are weighted heavily towards **Impact (25%)** and **Technical Depth (25%)**. Documentation and Organization make up the remaining 50%. The confidence score subtracts points for "Tutorial Clones" and lack of readme-driven development.
