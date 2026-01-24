import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Clock, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { API } from '@/App';
import { toast } from 'sonner';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, search, selectedDifficulty, selectedType]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API}/resources`);
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (search) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type) => {
    return <BookOpen className="w-5 h-5" />;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-orange-100 text-orange-700',
      'Advanced': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-slate-100 text-slate-700';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>Learning Resources</h1>
          <p className="text-slate-600">Curated resources to support your learning journey</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="search-resources-input"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              data-testid="filter-difficulty-select"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
              data-testid="filter-type-select"
            >
              <option value="All">All Types</option>
              <option value="Course">Course</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Video">Video</option>
              <option value="Article">Article</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                data-testid={`resource-card-${resource.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getTypeIcon(resource.type)}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2" style={{fontFamily: 'Outfit'}}>{resource.title}</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{resource.description}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{resource.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{resource.type}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    data-testid={`view-resource-${resource.id}`}
                  >
                    View Resource <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No resources found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Resources;