import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [assessments, setAssessments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessmentsRes, progressRes] = await Promise.all([
        fetch(`${API}/assessments`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (assessmentsRes.ok) {
        const assessmentsData = await assessmentsRes.json();
        setAssessments(assessmentsData);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAssessments = assessments.length > 0;
  const avgProgress = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + p.overall_progress, 0) / progress.length)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto" data-testid="dashboard">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Dashboard</h1>
          <p className="text-slate-600">Track your learning journey and career progress</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {!hasAssessments ? (
              /* Getting Started Section */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary to-green-800 rounded-xl p-12 text-white mb-8"
              >
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold mb-4" style={{fontFamily: 'Outfit'}}>
                    Welcome to SkillGapAI!
                  </h2>
                  <p className="text-lg mb-6 text-slate-100">
                    Start your career transformation journey by selecting a target role and assessing your current skills.
                  </p>
                  <Button 
                    onClick={() => navigate('/roles')}
                    data-testid="get-started-roles-btn"
                    className="bg-white text-primary hover:bg-slate-100 rounded-full px-8 h-12 font-medium"
                  >
                    Explore Career Roles <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Stats Grid */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{fontFamily: 'Outfit'}}>{assessments.length}</div>
                  <div className="text-slate-600">Career Paths Started</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{fontFamily: 'Outfit'}}>{avgProgress}%</div>
                  <div className="text-slate-600">Average Progress</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{fontFamily: 'Outfit'}}>{progress.length}</div>
                  <div className="text-slate-600">Skills In Progress</div>
                </motion.div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{fontFamily: 'Outfit'}}>Explore Roles</h3>
                    <p className="text-sm text-slate-600">Find your target career</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/roles')}
                  data-testid="dashboard-explore-roles-btn"
                  variant="outline"
                  className="w-full rounded-full"
                >
                  View All Roles <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{fontFamily: 'Outfit'}}>Learning Resources</h3>
                    <p className="text-sm text-slate-600">Curated learning materials</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/resources')}
                  data-testid="dashboard-resources-btn"
                  variant="outline"
                  className="w-full rounded-full"
                >
                  Browse Resources <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const Briefcase = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default Dashboard;