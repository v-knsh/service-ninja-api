
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Payment, RepairRequest } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Loader2, Search, CreditCard, DollarSign, Calendar } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const PaymentCard = ({ payment }: { payment: Payment }) => {
  const repairId = typeof payment.repair === 'string' 
    ? payment.repair 
    : payment.repair._id;
  
  const repairInfo = typeof payment.repair === 'object' 
    ? payment.repair 
    : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Payment #{payment._id.substring(0, 8)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(payment.createdAt)}
            </p>
          </div>
          <Badge 
            variant={payment.status === 'completed' ? 'default' : 'outline'}
          >
            {payment.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Amount</span>
            </div>
            <span className="font-semibold">
              {formatCurrency(payment.amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Method</span>
            </div>
            <span className="capitalize">
              {payment.method.replace('_', ' ')}
            </span>
          </div>
          
          {payment.transactionId && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium">Transaction ID</span>
              </div>
              <span className="text-sm font-mono">
                {payment.transactionId}
              </span>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Repair: </span>
            {repairInfo ? (
              <span>{repairInfo.service.name}</span>
            ) : (
              <span>#{repairId.substring(0, 8)}</span>
            )}
          </div>
          
          <Button asChild size="sm" variant="outline">
            <Link to={`/repairs/${repairId}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Payments = () => {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all user payments
  const { 
    data: payments, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['payments'],
    queryFn: () => apiService.getPayments(),
    enabled: !!token,
  });
  
  // Filter payments based on search query
  const filteredPayments = payments?.filter(payment => {
    const paymentId = payment._id;
    const repairInfo = typeof payment.repair === 'object' 
      ? payment.repair 
      : null;
    
    const searchString = [
      paymentId,
      payment.method,
      payment.status,
      repairInfo?.service.name || '',
      repairInfo?.description || '',
    ].join(' ').toLowerCase();
    
    return searchString.includes(searchQuery.toLowerCase());
  });
  
  // Group payments by status
  const completedPayments = filteredPayments?.filter(
    payment => payment.status === 'completed'
  );
  
  const pendingPayments = filteredPayments?.filter(
    payment => payment.status === 'pending'
  );
  
  const refundedPayments = filteredPayments?.filter(
    payment => payment.status === 'refunded'
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Payment History</h1>
              <p className="text-muted-foreground">
                View and manage your payment history
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="refunded">Refunded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>
                      Failed to load payment history. Please try again.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : filteredPayments && filteredPayments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPayments.map((payment) => (
                    <PaymentCard key={payment._id} payment={payment} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>No payments found</CardTitle>
                    <CardDescription>
                      {searchQuery
                        ? "No payments match your search criteria"
                        : "You haven't made any payments yet"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button asChild>
                      <Link to="/repairs">View Repair Requests</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completedPayments && completedPayments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedPayments.map((payment) => (
                    <PaymentCard key={payment._id} payment={payment} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>No completed payments</CardTitle>
                    <CardDescription>
                      You don't have any completed payments yet
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingPayments && pendingPayments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingPayments.map((payment) => (
                    <PaymentCard key={payment._id} payment={payment} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>No pending payments</CardTitle>
                    <CardDescription>
                      You don't have any pending payments
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="refunded" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : refundedPayments && refundedPayments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {refundedPayments.map((payment) => (
                    <PaymentCard key={payment._id} payment={payment} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>No refunded payments</CardTitle>
                    <CardDescription>
                      You don't have any refunded payments
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payments;
