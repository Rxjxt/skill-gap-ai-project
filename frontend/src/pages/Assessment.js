import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Layout from '@/components/Layout';
import { API, AuthContext } from '@/App';
import { toast } from 'sonner';

const Assessment = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { token } = React.useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [skillRatings, setSkillRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRole();
  }, [roleId]);

  const fetchRole = async () => {
    try {
      const response = await fetch(`${API}/roles/${roleId}`);
      if (response.ok) {
        const data = await response.json();
        setRole(data);
        // Initialize ratings
        const initialRatings = {};
        data.required_skills.forEach(skill => {
          initialRatings[skill.name] = 1;
        });
        setSkillRatings(initialRatings);
      }
    } catch (error) {
      toast.error('Failed to load role details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const skills = Object.entries(skillRatings).map(([skill_name, current_level]) => ({
        skill_name,
        current_level
      }));

      const response = await fetch(`${API}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          career_role_id: roleId,
          skills
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Assessment submitted successfully!');
        navigate(`/gap-analysis/${data.id}`);
      } else {
        toast.error('Failed to submit assessment');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: 'Beginner',
      2: 'Basic',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return labels[value];
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Skill Assessment</h1>
          <p className="text-slate-600 mb-4">Rate your current proficiency for {role?.title}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>How to rate:</strong> Be honest about your skill level. This helps us provide accurate gap analysis.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {role?.required_skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{skill.name}</h3>
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {skill.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary" style={{fontFamily: 'Outfit'}}>
                    {skillRatings[skill.name]}
                  </div>
                  <div className="text-xs text-slate-500">
                    {getRatingLabel(skillRatings[skill.name])}
                  </div>
                </div>
              </div>

              <Slider
                value={[skillRatings[skill.name]]}
                onValueChange={(value) => setSkillRatings({ ...skillRatings, [skill.name]: value[0] })}
                min={1}
                max={5}
                step={1}
                className="mt-4"
                data-testid={`skill-slider-${skill.name}`}
              />
              
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 font-medium"
            data-testid="submit-assessment-btn"
          >
            {submitting ? 'Analyzing...' : 'Analyze My Skills'} <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;