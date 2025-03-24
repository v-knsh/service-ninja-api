
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle } from 'lucide-react';

const Payments = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage payments for your repair services
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Secure payment methods for your repair services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-md flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-amber-500" />
              <div>
                <h3 className="font-medium mb-1">Payment Required After Diagnosis</h3>
                <p className="text-sm text-muted-foreground">
                  Our technicians will diagnose your device first and provide you with a detailed quote. 
                  Payment is required after you approve the repair.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-primary" />
                  <span>Credit/Debit Cards</span>
                </div>
                <div className="border p-4 rounded-md flex items-center">
                  <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none">
                    <path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bank Transfer</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                To make a payment for a completed repair, view your repair details from the dashboard.
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;
