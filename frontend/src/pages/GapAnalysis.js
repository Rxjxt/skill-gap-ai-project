import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';
import { toast } from 'sonner';

const GapAnalysis = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateAnalysis();
  }, [assessmentId]);

  const generateAnalysis = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`${API}/analysis/gap?assessment_id=${assessmentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        toast.success('Analysis complete!');
      } else {
        toast.error('Failed to generate analysis');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const generateRoadmap = async () => {
    try {
      const response = await fetch(`${API}/roadmap/generate?analysis_id=${analysis.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Roadmap generated!');
        navigate(`/roadmap/${data.id}`);
      } else {
        toast.error('Failed to generate roadmap');
      }
    } catch (error) {
      toast.error('Connection error');
    }
  };

  const getRadarData = () => {
    if (!analysis) return [];
    return analysis.skill_gaps.map(gap => ({
      skill: gap.skill.length > 15 ? gap.skill.substring(0, 15) + '...' : gap.skill,
      current: gap.current_level,
      required: gap.required_level,
    }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-orange-100 text-orange-700 border-orange-200',
      'Low': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading || generating) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-600">AI is analyzing your skills...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Skill Gap Analysis</h1>
          <p className="text-slate-600">AI-powered insights into your learning path</p>
        </div>

        {/* Readiness Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary to-green-800 rounded-xl p-8 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold mb-2 uppercase tracking-wide">Career Readiness Score</div>
              <div className="text-6xl font-bold" style={{fontFamily: 'Outfit'}}>{analysis?.readiness_score}%</div>
              <p className="text-slate-200 mt-2">
                {analysis?.readiness_score >= 80 ? 'Excellent! You\'re almost ready.' : 
                 analysis?.readiness_score >= 60 ? 'Good progress! Keep learning.' :
                 'Great start! Focus on key skills.'}
              </p>
            </div>
            <TrendingUp className="w-24 h-24 opacity-20" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-4" style={{fontFamily: 'Outfit'}}>Skills Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getRadarData()}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar name="Current" dataKey="current" stroke="#14532d" fill="#14532d" fillOpacity={0.3} strokeWidth={3} />
                <Radar name="Required" dataKey="required" stroke="#ea580c" fill="#ea580c" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <span>Current Level</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded-full"></div>
                <span>Required Level</span>
              </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold" style={{fontFamily: 'Outfit'}}>AI Insights</h2>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
              {analysis?.ai_insights.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skill Gaps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6" style={{fontFamily: 'Outfit'}}>Skill Gaps to Address</h2>
          <div className="space-y-4">
            {analysis?.skill_gaps.map((gap, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-lg">{gap.skill}</span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(gap.priority)}`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 ml-8">
                    Current: Level {gap.current_level} | Required: Level {gap.required_level} | Gap: {gap.gap} levels
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-end">
          <Button
            onClick={generateRoadmap}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 font-medium"
            data-testid="generate-roadmap-btn"
          >
            Generate Learning Roadmap <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default GapAnalysis;