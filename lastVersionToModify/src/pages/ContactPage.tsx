import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { cn } from '../utils/cn';

type SubjectType = 'violation' | 'information' | 'help' | 'query' | 'urgent';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: '' as SubjectType,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subjects: { value: SubjectType; label: string }[] = [
    { value: 'violation', label: t('contact.subjects.violation') },
    { value: 'information', label: t('contact.subjects.information') },
    { value: 'help', label: t('contact.subjects.help') },
    { value: 'query', label: t('contact.subjects.query') },
    { value: 'urgent', label: t('contact.subjects.urgent') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('https://www.waladom.club/api/verification/email/contact/waladom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(t('contact.errors.sendFailed'));
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: '' as SubjectType,
        message: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contact.errors.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              {t('contact.title')}
            </h1>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <Mail className="w-8 h-8 text-waladom-green mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                  <p className="text-gray-600">contact@waladom.org</p>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 text-waladom-green mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-waladom-green mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                  <p className="text-gray-600">123 Community St, NY 10001</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('contact.success')}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.firstName')}
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.lastName')}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.subject')}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as SubjectType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    required
                  >
                    <option value="">{t('contact.selectSubject')}</option>
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.message')}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full px-6 py-3 bg-waladom-green text-white rounded-md hover:bg-waladom-green-dark transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    t('contact.send')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;