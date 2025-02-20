import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';
import { Heart, Book, Home, Utensils, CreditCard, Building2, Wallet, Server } from 'lucide-react';

const DonatePage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const causes = [
    {
      icon: <Heart className="w-12 h-12 text-waladom-green" />,
      title: t('donate.causes.humanRights.title'),
      description: t('donate.causes.humanRights.description'),
      goal: 50000,
      raised: 0
    },
    {
      icon: <Book className="w-12 h-12 text-waladom-green" />,
      title: t('donate.causes.education.title'),
      description: t('donate.causes.education.description'),
      goal: 100000,
      raised: 0
    },
    {
      icon: <Home className="w-12 h-12 text-waladom-green" />,
      title: t('donate.causes.humanitarian.title'),
      description: t('donate.causes.humanitarian.description'),
      goal: 25000,
      raised: 0
    },
    {
      icon: <Server className="w-12 h-12 text-waladom-green" />,
      title: t('donate.causes.technology.title'),
      description: t('donate.causes.technology.description'),
      goal: 10000,
      raised: 0
    }
  ];

  const totalTreasury = causes.reduce((acc, cause) => acc + cause.raised, 0);

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="w-6 h-6" />,
      details: {
        bankak: {
          account: '0000000',
          owner: 'Waladom org'
        },
        fawri: {
          account: '0000000',
          owner: 'Waladom org'
        }
      }
    }
  ];

  const handleDonate = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || !paymentMethod) return;

    // Handle donation based on payment method
    switch (paymentMethod) {
      case 'paypal':
        // Implement PayPal integration
        console.log('Processing PayPal donation:', amount);
        break;
      case 'card':
        // Implement card payment integration
        console.log('Processing card payment:', amount);
        break;
      case 'bank':
        // Show bank transfer instructions
        console.log('Showing bank transfer details:', amount);
        break;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-waladom-green mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('donate.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('donate.description')}
            </p>
          </div>

          {/* Treasury Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-center mb-4">{t('donate.treasury.title')}</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-waladom-green">
                ${totalTreasury.toLocaleString()}
              </div>
              <p className="text-gray-600 mt-2">{t('donate.treasury.total')}</p>
            </div>
          </div>

          {/* Causes Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {causes.map((cause, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-center mb-4">{cause.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-4">{cause.title}</h3>
                <p className="text-gray-600 mb-6">{cause.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{t('donate.treasury.raised')}: ${cause.raised.toLocaleString()}</span>
                    <span>{t('donate.treasury.goal')}: ${cause.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-waladom-green rounded-full h-2"
                      style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Donation Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8">{t('donate.cta.title')}</h3>

            {/* Amount Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('donate.cta.selectAmount')}
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedAmount === amount
                        ? 'border-waladom-green bg-waladom-green text-white'
                        : 'border-gray-300 hover:border-waladom-green'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder={t('donate.cta.customAmount')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('donate.cta.paymentMethod')}
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id}>
                    <button
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        paymentMethod === method.id
                          ? 'border-waladom-green bg-waladom-green/5'
                          : 'border-gray-300'
                      } flex items-center justify-between hover:border-waladom-green`}
                    >
                      <div className="flex items-center">
                        {method.icon}
                        <span className="ml-3">{method.name}</span>
                      </div>
                    </button>

                    {/* Bank Transfer Details */}
                    {paymentMethod === 'bank' && method.id === 'bank' && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Bankak</h4>
                          <p>Account Number: {method.details.bankak.account}</p>
                          <p>Account Owner: {method.details.bankak.owner}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Fawri</h4>
                          <p>Account Number: {method.details.fawri.account}</p>
                          <p>Account Owner: {method.details.fawri.owner}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDonate}
              disabled={!paymentMethod || (!selectedAmount && !customAmount)}
              className="w-full px-6 py-3 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('donate.cta.complete')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DonatePage;