import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';
import { toast } from 'sonner';

const Progress = () => {
  const { token } = React.useContext(AuthContext);
  const [progressData, setProgressData] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, rolesRes] = await Promise.all([
        fetch(`${API}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/roles`)
      ]);

      if (progressRes.ok) {
        const progress = await progressRes.json();
        setProgressData(progress);
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        const rolesMap = {};
        rolesData.forEach(role => {
          rolesMap[role.id] = role;
        });
        setRoles(rolesMap);
      }
    } catch (error) {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Your Progress</h1>
          <p className="text-slate-600">Track your learning journey and achievements</p>
        </div>

        {progressData.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2" style={{fontFamily: 'Outfit'}}>No Progress Yet</h3>
            <p className="text-slate-600">Start a skill assessment to begin tracking your progress.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {progressData.map((progress, index) => {
              const role = roles[progress.career_role_id];
              return (
                <motion.div
                  key={progress.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>
                        {role?.title || 'Career Role'}
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="text-sm text-slate-600">Overall Progress</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary" style={{fontFamily: 'Outfit'}}>
                        {progress.overall_progress}%
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mb-6">
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.overall_progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-primary transition-all duration-1000"
                      />
                    </div>
                  </div>

                  {/* Individual Skills */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-3" style={{fontFamily: 'Outfit'}}>Skill Progress</h3>
                    {progress.skill_progress.map((skillProg, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {skillProg.progress === 100 && (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            )}
                            <span className="font-medium">{skillProg.skill}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">{skillProg.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skillProg.progress}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-primary to-green-600"
                          />
                        </div>
                        {skillProg.notes && (
                          <p className="text-xs text-slate-600 mt-2">{skillProg.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Progress;