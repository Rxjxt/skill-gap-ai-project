import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';
import { toast } from 'sonner';

const Roadmap = () => {
  const { analysisId } = useParams();
  const { token } = React.useContext(AuthContext);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [analysisId]);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch(`${API}/roadmap`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const currentRoadmap = data.find(r => r.id === analysisId);
        if (currentRoadmap) {
          setRoadmap(currentRoadmap);
        } else {
          toast.error('Roadmap not found');
        }
      }
    } catch (error) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'High': 'bg-red-100 text-red-700 border-red-200',
      'Medium': 'bg-orange-100 text-orange-700 border-orange-200',
      'Low': 'bg-green-100 text-green-700 border-green-200'
    };
    return styles[priority] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Learning Roadmap</h1>
          <p className="text-slate-600">Your personalized path to career readiness</p>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-green-800 rounded-xl p-8 text-white mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide">Total Duration</div>
              <div className="text-3xl font-bold" style={{fontFamily: 'Outfit'}}>{roadmap?.total_duration}</div>
            </div>
          </div>
          <p className="text-slate-200">
            Complete {roadmap?.roadmap_items.length} skills at your own pace
          </p>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold" style={{fontFamily: 'Outfit'}}>AI Recommendations</h2>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            {roadmap?.ai_recommendations.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-3">{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-8">
            {roadmap?.roadmap_items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline Dot */}
                <div className="absolute left-3 top-6 w-6 h-6 bg-white border-4 border-primary rounded-full z-10"></div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>{item.skill}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityBadge(item.priority)}`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-700 mb-2">Key Milestones:</div>
                    {item.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                        <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"
        >
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2" style={{fontFamily: 'Outfit'}}>Ready to Start?</h3>
          <p className="text-slate-600">Track your progress and explore resources to support your learning journey.</p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Roadmap;