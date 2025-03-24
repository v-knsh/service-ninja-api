
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Clock, DollarSign, CreditCard, CheckCircle } from 'lucide-react';

interface Repair {
  _id: string;
  status: string;
  description: string;
  estimatedCost: number;
  createdAt: string;
  serviceId: {
    _id: string;
    name: string;
    price: number;
  };
  userId: {
    _id: string;
    email: string;
  };
}

const RepairDetail = () => {
  const { repairId } = useParams<{ repairId: string }>();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { 
    data: repair,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['repair', repairId],
    queryFn: async () => {
      const response = await fetch(`https://be.naars.knileshh.com/api/repairs/${repairId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch repair details');
      }
      
      return response.json() as Promise<Repair>;
    },
    enabled: !!token && !!repairId,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleProcessPayment = async () => {
    if (!repair || !paymentMethod) {
      toast({
        title: "Missing information",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const response = await fetch('https://be.naars.knileshh.com/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          repairId: repair._id,
          amount: repair.estimatedCost,
          paymentMethod: paymentMethod,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process payment');
      }
      
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully",
      });
      
      // Refetch the repair to update its status
      refetch();
      
    } catch (error) {
      toast({
        title: "Payment error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-4">
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Repair Details</h1>
        </div>
        
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Failed to load repair details</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        ) : repair ? (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Repair #{repair._id.slice(-6)}</CardTitle>
                  <Badge className={getStatusColor(repair.status)}>
                    {repair.status}
                  </Badge>
                </div>
                <CardDescription>
                  Requested on {formatDate(repair.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Service</h3>
                  <p>{repair.serviceId.name}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{repair.description}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Estimated Cost</span>
                  <span className="text-lg font-semibold">${repair.estimatedCost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            {repair.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Process payment for your completed repair
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="paymentMethod" className="text-sm font-medium">
                      Payment Method
                    </label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      disabled={isProcessing}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span>Total Amount</span>
                      <span className="font-bold">${repair.estimatedCost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleProcessPayment} 
                    disabled={isProcessing} 
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ${repair.estimatedCost.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {repair.status !== 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Payment is available once repairs are completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    This repair is currently in {repair.status.toLowerCase()} status. 
                    Payment processing will be available once it's completed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairDetail;
