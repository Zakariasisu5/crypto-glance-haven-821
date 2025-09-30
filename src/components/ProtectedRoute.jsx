import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
