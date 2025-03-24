
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'https://be.naars.knileshh.com/api';

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Types
export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  image?: string;
  isActive: boolean;
}

export interface RepairRequest {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  service: Service;
  description: string;
  status: 'pending' | 'diagnosed' | 'in_progress' | 'completed' | 'delivered';
  estimatedCost: number;
  finalCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  repair: string | RepairRequest;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  repair: string | RepairRequest;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  service: string | Service;
  rating: number;
  comment: string;
  createdAt: string;
}

// API functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    return await response.json();
  },
  
  register: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  },
  
  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch services');
    }
    
    return await response.json();
  },
  
  getServiceById: async (id: string): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch service');
    }
    
    return await response.json();
  },
  
  // Repair Requests
  getRepairRequests: async (): Promise<RepairRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/repairs`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch repair requests');
    }
    
    return await response.json();
  },
  
  getRepairRequestById: async (id: string): Promise<RepairRequest> => {
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch repair request');
    }
    
    return await response.json();
  },
  
  createRepairRequest: async (data: {
    service: string;
    description: string;
    estimatedCost: number;
  }): Promise<RepairRequest> => {
    const response = await fetch(`${API_BASE_URL}/repairs`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create repair request');
    }
    
    return await response.json();
  },
  
  updateRepairRequest: async (id: string, data: {
    status?: 'pending' | 'diagnosed' | 'in_progress' | 'completed' | 'delivered';
    finalCost?: number;
  }): Promise<RepairRequest> => {
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update repair request');
    }
    
    return await response.json();
  },
  
  // Payments
  getPayments: async (): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch payments');
    }
    
    return await response.json();
  },
  
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch payment');
    }
    
    return await response.json();
  },
  
  createPayment: async (data: {
    repair: string;
    amount: number;
    method: 'credit_card' | 'debit_card' | 'paypal' | 'cash';
  }): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }
    
    return await response.json();
  },
  
  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch appointments');
    }
    
    return await response.json();
  },
  
  createAppointment: async (data: {
    repair: string;
    scheduledDate: string;
    notes?: string;
  }): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }
    
    return await response.json();
  },
  
  // Reviews
  getReviews: async (): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reviews');
    }
    
    return await response.json();
  },
  
  createReview: async (data: {
    service: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create review');
    }
    
    return await response.json();
  },
};
