import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Users, Briefcase, ShoppingBag, Mountain, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const userTypes = [
    {
      id: 'employee',
      title: 'Employees',
      description: 'Share your experience working with our products',
      icon: Briefcase,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      id: 'stakeholder',
      title: 'Stakeholders',
      description: 'Provide insights on our product strategy',
      icon: Users,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    },
    {
      id: 'customer',
      title: 'Customers',
      description: 'Tell us about your product experience',
      icon: ShoppingBag,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-blue-900/85 z-0" />
      
      {/* Floating Mountain Icon */}
      <motion.div
        className="absolute top-8 right-8 opacity-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mountain className="w-64 h-64 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Product Insights
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
            Your voice shapes our future. Share your perspective.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link to={createPageUrl(`Survey?type=${type.id}`)}>
                  <div className="group relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 hover:bg-white transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer border border-white/20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`${type.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-8 h-8 ${type.iconColor}`} />
                      </div>
                      
                      <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        {type.title}
                      </h2>
                      
                      <p className="text-slate-600 leading-relaxed">
                        {type.description}
                      </p>
                      
                      <div className="mt-6 flex items-center text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        Start Survey
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to={createPageUrl('Analytics')}>
            <Button 
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-xl rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              View Analytics Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}