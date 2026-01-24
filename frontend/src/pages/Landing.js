import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary" style={{fontFamily: 'Outfit'}}>SkillGapAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" data-testid="nav-login-btn">Login</Button>
            </Link>
            <Link to="/register">
              <Button data-testid="nav-register-btn" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div 
            className="md:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6" style={{fontFamily: 'Outfit'}}>
              Close Your Skill Gaps,<br />
              <span className="text-primary">Accelerate Your Career</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
              Get AI-powered analysis of your skills against your dream job. Receive personalized learning roadmaps and track your progress toward career readiness.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button data-testid="hero-get-started-btn" size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 font-medium">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1741699428553-41c8e5bd894d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMHN0dWR5aW5nJTIwbGFwdG9wJTIwbGlicmFyeXxlbnwwfHx8fDE3NjkyODAwNjZ8MA&ixlib=rb-4.1.0&q=85" 
              alt="Student studying" 
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 text-slate-900" style={{fontFamily: 'Outfit'}}>
            How SkillGapAI Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Outfit'}}>Choose Your Goal</h3>
              <p className="text-slate-600 leading-relaxed">
                Select your target career role from our comprehensive database of in-demand positions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Outfit'}}>Get AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI analyzes your current skills and identifies exactly what you need to learn.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{fontFamily: 'Outfit'}}>Follow Your Roadmap</h3>
              <p className="text-slate-600 leading-relaxed">
                Get a personalized learning path with curated resources and track your progress.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-green-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>95%</div>
              <div className="text-slate-200">Career Clarity Improvement</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>6+</div>
              <div className="text-slate-200">Career Paths Available</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2" style={{fontFamily: 'Outfit'}}>AI</div>
              <div className="text-slate-200">Powered Recommendations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{fontFamily: 'Outfit'}}>
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join students worldwide who are taking control of their career development.
          </p>
          <Link to="/register">
            <Button data-testid="cta-get-started-btn" size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 h-12 font-medium">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-white" style={{fontFamily: 'Outfit'}}>SkillGapAI</span>
          </div>
          <p className="text-sm">© 2025 SkillGapAI. Empowering your career journey.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;