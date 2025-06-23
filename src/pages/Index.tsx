import React, { useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section';

// Lazy load the HeroSection component
const HeroSection = lazy(() => import('@/components/HeroSection'));
const Navigation = lazy(() => import('@/components/Navigation'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <div className="animate-pulse text-bronze text-2xl">Loading...</div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-bronze text-2xl mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()}
              className="bg-bronze text-navy px-4 py-2 rounded hover:bg-opacity-90 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback((sectionId: string) => {
    try {
      if (sectionId.startsWith('/')) {
        navigate(sectionId);
        return;
      }
      
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-navy overflow-x-hidden">
          <Navigation currentSection="compass" onNavigate={handleNavigate} />
          <Section id="compass" className="relative">
            <HeroSection onNavigate={handleNavigate} />
          </Section>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
