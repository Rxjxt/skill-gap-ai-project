import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';
import { toast } from 'sonner';

const CareerRoles = () => {
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API}/roles`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      toast.error('Failed to load career roles');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-700',
      'Backend': 'bg-green-100 text-green-700',
      'Database': 'bg-purple-100 text-purple-700',
      'Programming': 'bg-orange-100 text-orange-700',
      'Design': 'bg-pink-100 text-pink-700',
      'Cloud': 'bg-cyan-100 text-cyan-700',
      'DevOps': 'bg-indigo-100 text-indigo-700',
      'Mobile': 'bg-teal-100 text-teal-700',
      'Security': 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Career Roles</h1>
          <p className="text-slate-600">Choose your target role and start your learning journey</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/assessment/${role.id}`)}
                data-testid={`role-card-${role.id}`}
              >
                <h3 className="text-xl font-bold mb-3" style={{fontFamily: 'Outfit'}}>{role.title}</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{role.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-slate-700">{role.average_salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-slate-700">{role.growth_rate}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Required Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {role.required_skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {role.required_skills.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        +{role.required_skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                  data-testid={`start-assessment-${role.id}`}
                >
                  Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CareerRoles;