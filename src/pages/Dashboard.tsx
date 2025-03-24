import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Wrench, ArrowRight } from 'lucide-react';

interface Repair {
  _id: string;
  status: string;
  description: string;
  estimatedCost: number;
  createdAt: string;
  serviceId: {
    _id: string;
    name: string;
  };
}

interface Appointment {
  _id: string;
  scheduledDateTime: string;
  status: string;
  notes: string;
  repairRequestId: {
    _id: string;
    serviceId: {
      name: string;
    };
  };
}

interface Payment {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  repairId: {
    _id: string;
    serviceId: {
      name: string;
    };
  };
}

const fetchUserRepairs = async (token: string): Promise<Repair[]> => {
  const response = await fetch('https://be.naars.knileshh.com/api/repairs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch repairs');
  }
  
  return response.json();
};

const fetchUserAppointments = async (token: string): Promise<Appointment[]> => {
  const response = await fetch('https://be.naars.knileshh.com/api/appointments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  
  return response.json();
};

const fetchUserPayments = async (token: string): Promise<Payment[]> => {
  const response = await fetch('https://be.naars.knileshh.com/api/payments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }
  
  return response.json();
};

const Dashboard = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const { 
    data: repairs, 
    isLoading: repairsLoading 
  } = useQuery({
    queryKey: ['repairs', token],
    queryFn: () => fetchUserRepairs(token || ''),
    enabled: !!token,
  });
  
  const { 
    data: appointments, 
    isLoading: appointmentsLoading 
  } = useQuery({
    queryKey: ['appointments', token],
    queryFn: () => fetchUserAppointments(token || ''),
    enabled: !!token,
  });
  
  const { 
    data: payments, 
    isLoading: paymentsLoading 
  } = useQuery({
    queryKey: ['payments', token],
    queryFn: () => fetchUserPayments(token || ''),
    enabled: !!token,
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, {user?.email}
        </p>
        
        <Tabs defaultValue="repairs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="repairs" className="flex items-center">
              <Wrench className="mr-2 h-4 w-4" />
              Repairs
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repairs">
            <Card>
              <CardHeader>
                <CardTitle>Your Repair Requests</CardTitle>
                <CardDescription>
                  Track the status of your repair requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {repairsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : repairs?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      You haven't made any repair requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {repairs?.map((repair) => (
                      <div key={repair._id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">
                            {repair.serviceId.name}
                          </h3>
                          <Badge className={getStatusColor(repair.status)}>
                            {repair.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {repair.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{formatDate(repair.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="font-medium">
                              ${repair.estimatedCost.toFixed(2)}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="p-0 h-auto font-medium text-primary hover:text-primary"
                            >
                              <Link to={`/repairs/${repair._id}`}>
                                View Details
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                        {repair.status === 'completed' && (
                          <div className="mt-3 flex justify-end">
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/repairs/${repair._id}`)}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Process Payment
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>
                  Upcoming and past repair appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : appointments?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      You don't have any appointments scheduled.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {appointments?.map((appointment) => (
                      <div key={appointment._id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">
                            {appointment.repairRequestId.serviceId.name}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {appointment.notes || "No additional notes."}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{formatDateTime(appointment.scheduledDateTime)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Your Payments</CardTitle>
                <CardDescription>
                  Payment history for repair services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : payments?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      You haven't made any payments yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {payments?.map((payment) => (
                      <div key={payment._id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">
                            {payment.repairId.serviceId.name}
                          </h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Method: {payment.paymentMethod}
                          </span>
                          <span className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{formatDate(payment.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
