import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RepairRequest, apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, CheckCircle, Clock, Tool, Package } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Payment form schema
const paymentSchema = z.object({
  method: z.enum(['credit_card', 'debit_card', 'paypal', 'cash'], {
    required_error: "Please select a payment method.",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const statusIcons = {
  pending: Clock,
  diagnosed: AlertCircle,
  in_progress: Tool,
  completed: CheckCircle,
  delivered: Package,
};

const statusColors = {
  pending: "bg-yellow-500",
  diagnosed: "bg-blue-500",
  in_progress: "bg-purple-500",
  completed: "bg-green-500",
  delivered: "bg-gray-500",
};

const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const RepairDetail = () => {
  const { repairId } = useParams<{ repairId: string }>();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'credit_card',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  // Fetch repair details
  const { 
    data: repair, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['repair', repairId],
    queryFn: () => apiService.getRepairRequestById(repairId || ''),
    enabled: !!token && !!repairId,
  });

  // Fetch payments for this repair
  const { 
    data: payments, 
    isLoading: isLoadingPayments 
  } = useQuery({
    queryKey: ['payments', repairId],
    queryFn: async () => {
      const allPayments = await apiService.getPayments();
      return allPayments.filter(payment => 
        typeof payment.repair === 'string' 
        ? payment.repair === repairId 
        : payment.repair._id === repairId
      );
    },
    enabled: !!token && !!repairId,
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: (data: {
      repair: string;
      amount: number;
      method: 'credit_card' | 'debit_card' | 'paypal' | 'cash';
    }) => apiService.createPayment(data),
    onSuccess: () => {
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully",
      });
      setShowPaymentForm(false);
      queryClient.invalidateQueries({ queryKey: ['payments', repairId] });
      queryClient.invalidateQueries({ queryKey: ['repair', repairId] });
    },
    onError: (error) => {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle payment submission
  const onSubmitPayment = (values: PaymentFormValues) => {
    if (!repair) return;
    
    const paymentData = {
      repair: repair._id,
      amount: repair.finalCost || repair.estimatedCost,
      method: values.method,
    };
    
    paymentMutation.mutate(paymentData);
  };

  // Check if repair is already paid
  const isPaid = payments && payments.some(payment => payment.status === 'completed');

  // Handle if no repair found
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto p-6 flex items-center justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                Failed to load repair details. Please try again.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/repairs')}>Back to Repairs</Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : repair ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Repair Details Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Repair #{repair._id.substring(0, 8)}</CardTitle>
                    <CardDescription>
                      {repair.service.name} - {formatDate(repair.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={`${statusColors[repair.status]} text-white`}
                  >
                    {repair.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-base">{repair.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Estimated Cost
                    </h3>
                    <p className="text-xl font-semibold">${repair.estimatedCost.toFixed(2)}</p>
                  </div>
                  
                  {repair.finalCost && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Final Cost
                      </h3>
                      <p className="text-xl font-semibold">${repair.finalCost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Service Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-base">{repair.service.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Time</p>
                      <p className="text-base">{repair.service.estimatedTime}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-base">{repair.service.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/repairs')}
                >
                  Back to Repairs
                </Button>
                
                {repair.status === 'completed' && !isPaid && (
                  <Button 
                    onClick={() => setShowPaymentForm(true)}
                    disabled={showPaymentForm}
                  >
                    Pay Now
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Payment Section */}
            <div className="space-y-6">
              {/* Existing Payments */}
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>
                    View all payments for this repair
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isLoadingPayments ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : payments && payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div 
                          key={payment._id} 
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Amount
                            </span>
                            <span className="font-semibold">
                              ${payment.amount.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Method
                            </span>
                            <span className="capitalize">
                              {payment.method.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Status
                            </span>
                            <Badge 
                              variant={payment.status === 'completed' ? 'default' : 'outline'}
                            >
                              {payment.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Date
                            </span>
                            <span className="text-sm">
                              {formatDate(payment.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No payments found for this repair
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Payment Form */}
              {showPaymentForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Payment</CardTitle>
                    <CardDescription>
                      Complete your payment for this repair
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitPayment)} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">Payment Details</h3>
                            <p className="text-sm text-muted-foreground">
                              Amount: ${(repair.finalCost || repair.estimatedCost).toFixed(2)}
                            </p>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Payment Method</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-2"
                                  >
                                    {paymentMethods.map((method) => (
                                      <FormItem
                                        key={method.value}
                                        className="flex items-center space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Radio value={method.value} id={method.value} />
                                        </FormControl>
                                        <FormLabel htmlFor={method.value} className="font-normal cursor-pointer">
                                          {method.label}
                                        </FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('method') !== 'cash' && form.watch('method') !== 'paypal' && (
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="1234 5678 9012 3456" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="cardExpiry"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input placeholder="MM/YY" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="cardCvc"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVC</FormLabel>
                                      <FormControl>
                                        <Input placeholder="123" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPaymentForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={paymentMutation.isPending}
                          >
                            {paymentMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              'Complete Payment'
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Repair not found</CardTitle>
              <CardDescription>
                The repair you're looking for doesn't exist or you may not have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/repairs')}>
                Back to Repairs
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default RepairDetail;
