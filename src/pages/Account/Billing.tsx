import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Download, 
  Star,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  TrendingUp,
  Shield,
  Crown
} from 'lucide-react';

// Types based on your business model
interface UserStatus {
  isInvestor: boolean;
  isCommunitySubscriber: boolean;
  investmentAmount?: number;
  investmentDate?: string;
  subscriptionId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'subscription' | 'investment';
  status: 'paid' | 'pending' | 'failed';
  date: string;
  description: string;
  downloadUrl?: string;
}

const Billing = () => {
  const { user } = useUser();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call to get user status
    setTimeout(() => {
      // Example: Community subscriber (change to test investor status)
      setUserStatus({
        isInvestor: false,
        isCommunitySubscriber: true,
        subscriptionId: 'sub_123',
        currentPeriodEnd: '2025-02-01',
        cancelAtPeriodEnd: false
      });

      // Example investor status (uncomment to test):
      // setUserStatus({
      //   isInvestor: true,
      //   isCommunitySubscriber: false,
      //   investmentAmount: 1500,
      //   investmentDate: '2024-12-15'
      // });

      setPaymentMethods([
        {
          id: '1',
          type: 'card',
          brand: 'visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2026,
          isDefault: true
        }
      ]);

      setTransactions([
        {
          id: '1',
          amount: 29.99,
          type: 'subscription',
          status: 'paid',
          date: '2025-01-01',
          description: 'Community Plan - January 2025',
          downloadUrl: '#'
        },
        {
          id: '2',
          amount: 29.99,
          type: 'subscription',
          status: 'paid',
          date: '2024-12-01',
          description: 'Community Plan - December 2024',
          downloadUrl: '#'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [user]);

  const handleStartInvestment = () => {
    // Redirect to Stripe checkout for investment
    console.log('Redirecting to investment Stripe checkout');
    // window.location.href = 'your-stripe-checkout-url-for-investment';
  };

  const handleStartCommunitySubscription = () => {
    // Redirect to Stripe checkout for subscription
    console.log('Redirecting to Community subscription Stripe checkout');
    // window.location.href = 'your-stripe-checkout-url-for-subscription';
  };

  const handleCancelSubscription = () => {
    console.log('Cancelling Community subscription');
    // Implement subscription cancellation
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isInvestor = userStatus?.isInvestor;
  const isCommunitySubscriber = userStatus?.isCommunitySubscriber;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
      </div>

      {/* Current Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
        
        {isInvestor ? (
          // Investor Status
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Active Investor</h4>
                <p className="text-sm text-gray-500">Community access included</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">Investment Details</span>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-700">
                  Investment Amount: <span className="font-medium">${userStatus.investmentAmount?.toLocaleString()}</span>
                </p>
                <p className="text-sm text-green-700">
                  Investment Date: <span className="font-medium">{userStatus.investmentDate ? new Date(userStatus.investmentDate).toLocaleDateString() : 'N/A'}</span>
                </p>
                <p className="text-sm text-green-700">
                  Community Access: <span className="font-medium">Lifetime (included)</span>
                </p>
              </div>
            </div>
          </div>
        ) : isCommunitySubscriber ? (
          // Community Subscriber Status
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Community Subscriber</h4>
                  <p className="text-sm text-gray-500">$29.99/month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next billing date</p>
                <p className="font-medium">{userStatus.currentPeriodEnd ? new Date(userStatus.currentPeriodEnd).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            {userStatus.cancelAtPeriodEnd && (
              <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Your subscription will cancel at the end of the current period.</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          // No active plan
          <div className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Choose Your Access</h4>
            <p className="text-gray-500 mb-6">Get started with Community access</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={handleStartCommunitySubscription}
                className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Monthly Plan</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">$29.99/month</p>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </button>
              
              <button
                onClick={handleStartInvestment}
                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-900">Investment Plan</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">$1,000+ one-time</p>
                <p className="text-sm text-gray-500">Community included forever</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade to Investment (only show for Community subscribers) */}
      {isCommunitySubscriber && !isInvestor && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Investment</h3>
              <p className="text-gray-600 mb-4">
                Make a one-time investment of $1,000 or more and get Community access included forever. 
                Your monthly billing will automatically stop.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Stop monthly payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Lifetime Community access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Investment returns</span>
                </div>
              </div>
              <button
                onClick={handleStartInvestment}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Start Investment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button
            onClick={() => setShowAddPayment(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payment Method</span>
          </button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {method.brand} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryMonth}/{method.expiryYear}
                    {method.isDefault && <span className="ml-2 text-blue-600">• Default</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!method.isDefault && paymentMethods.length > 1 && (
                  <button
                    onClick={() => handleSetDefaultPayment(method.id)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleRemovePaymentMethod(method.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No payment methods added yet</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.status === 'paid' ? 'bg-green-500' : 
                  transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex items-center space-x-2">
                  {transaction.type === 'investment' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} • 
                    <span className="capitalize ml-1">{transaction.status}</span> •
                    <span className="capitalize ml-1">{transaction.type}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">${transaction.amount.toLocaleString()}</span>
                {transaction.status === 'paid' && transaction.downloadUrl && (
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No transaction history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;