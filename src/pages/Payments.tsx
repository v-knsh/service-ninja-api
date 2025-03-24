
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Secure payment methods for your repair services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="text-amber-800">Payment Required After Diagnosis</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Our technicians will diagnose your device first and provide you with a detailed quote. 
                  Payment is required after you approve the repair and it has been completed.
                </AlertDescription>
              </Alert>
              
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
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">How to Pay</h3>
                <ol className="space-y-3 list-decimal list-inside pl-2">
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Submit a repair request</span> - Describe your device issue
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Wait for diagnosis</span> - Our technicians will assess your device
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Approve the repair quote</span> - Confirm the final price
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Wait for repair completion</span> - We'll notify you when your device is fixed
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Make payment</span> - Process payment through your dashboard
                  </li>
                  <li className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Collect your device</span> - Pick up your repaired device
                  </li>
                </ol>
              </div>
              
              <Alert>
                <Info className="h-5 w-5" />
                <AlertTitle>Process payment on your dashboard</AlertTitle>
                <AlertDescription>
                  When your repair is complete, you'll see a "Process Payment" button in your dashboard for the specific repair.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6">
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Secure Payments</CardTitle>
              <CardDescription>
                Your payment information is secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Encrypted Transactions</h4>
                  <p className="text-sm text-muted-foreground">
                    All payment information is encrypted using industry-standard protocols
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">No Stored Card Details</h4>
                  <p className="text-sm text-muted-foreground">
                    We don't store your full credit card information on our servers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Transparent Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    No hidden fees or charges - you'll always know what you're paying for
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment FAQ</CardTitle>
              <CardDescription>
                Common questions about payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">When do I need to pay?</h4>
                <p className="text-sm text-muted-foreground">
                  Payment is due after your repair has been completed and before you collect your device.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Can I get a refund?</h4>
                <p className="text-sm text-muted-foreground">
                  Refunds are available if we are unable to repair your device. Contact our support team for assistance.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Is there a deposit required?</h4>
                <p className="text-sm text-muted-foreground">
                  No deposit is required for standard repairs. For specialty parts, a deposit may be requested.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payments;
