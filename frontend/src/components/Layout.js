import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, LayoutDashboard, Briefcase, ClipboardCheck, TrendingUp, BookOpen, Award, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/App';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = React.useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/roles', icon: Briefcase, label: 'Career Roles' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/progress', icon: Award, label: 'Progress' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary" style={{fontFamily: 'Outfit'}}>SkillGapAI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              data-testid="logout-btn"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 h-[calc(100vh-5rem)] bg-white border-r border-slate-200 p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;