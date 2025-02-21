import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Upload, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import UserAvatar from '../components/common/UserAvatar';
import { cn } from '../utils/cn';
import { useToast } from '../hooks/useToast';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { useVerificationCode } from '../hooks/useVerificationCode';
import PasswordValidationModal from '../components/Profile/PasswordValidationModal';
import VerificationCodeModal from '../components/Profile/VerificationCodeModal';
import NewPasswordModal from '../components/Profile/NewPasswordModal';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordValidationModal, setShowPasswordValidationModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [verificationField, setVerificationField] = useState<'email' | 'phone' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const toast = useToast();
  const { validatePassword } = usePasswordValidation();
  const { sendVerificationCode, verifyCode, timeLeft, setTimeLeft } = useVerificationCode();

  console.log(user);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    currentCountry: user?.currentCountry || '',
    currentCity: user?.currentCity || '',
    currentVillage: user?.currentVillage || '',
    photo: null as File | null
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('profile.errors.photoTooLarge'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleContactChange = (field: 'email' | 'phone', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setVerificationField(field);
    setShowPasswordValidationModal(true);
  };

  const handlePasswordValidation = async (password: string) => {
    if (!user) return;
    
    const isValid = await validatePassword(password, user.cardId);
    if (isValid) {
      setShowPasswordValidationModal(false);
      if (verificationField) {
        const sent = await sendVerificationCode(formData.email);
        if (sent) {
          setTimeLeft(300); // 5 minutes
          setShowVerificationModal(true);
        }
      } else {
        setShowNewPasswordModal(true);
      }
    }
  };

  const handleVerificationCode = async (code: string) => {
    if (!verificationField) return;
    
    const isVerified = await verifyCode(formData[verificationField], code);
    if (isVerified) {
      setShowVerificationModal(false);
      // Update the contact info
      try {
        await updateUser(user!.cardId, { [verificationField]: formData[verificationField] });
        toast.success(t(`profile.success.${verificationField}Change`));
      } catch (err) {
        toast.error(t(`profile.errors.${verificationField}Change`));
      }
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = async (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.validation.passwordMismatch'));
      return;
    }

    const strength = checkPasswordStrength(newPassword);
    if (strength < 4) {
      toast.error(t('profile.validation.weakPassword'));
      return;
    }

    try {
      await updateUser(user!.cardId, { password: newPassword });
      setShowNewPasswordModal(false);
      toast.success(t('profile.success.passwordChange'));
    } catch (err) {
      toast.error(t('profile.errors.passwordChange'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updateData = {
        currentCountry: formData.currentCountry,
        currentCity: formData.currentCity,
        currentVillage: formData.currentVillage
      };

      if (formData.photo) {
        const photoUrl = await uploadPhoto(formData.photo);
        Object.assign(updateData, { photoUrl });
      }

      await updateUser(user!.cardId, updateData);
      setIsEditing(false);
      toast.success(t('profile.success.update'));
    } catch (err) {
      toast.error(t('profile.errors.update'));
    } finally {
      setLoading(false);
    }
  };

  // Mock function - replace with real upload logic
  const uploadPhoto = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || t('common.notProvided')}</dd>
    </div>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="px-6 py-5 border-b bg-gradient-to-r from-waladom-green/5 to-transparent flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{t('profile.title')}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {user?.cardId}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isEditing
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  )}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      {t('profile.buttons.cancel')}
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t('profile.buttons.edit')}
                    </>
                  )}
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Profile Photo */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <UserAvatar
                      size="large"
                      imageUrl={photoPreview || user?.photoUrl}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-waladom-green text-white p-2 rounded-full shadow-lg hover:bg-waladom-green-dark transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t('profile.memberSince', { date: new Date(user?.joinedDate || '').toLocaleDateString() })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    {/* Contact Information - Modifiable */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">{t('profile.sections.contact')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.email')}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={formData.email}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                              disabled
                            />
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleContactChange('email', formData.email)}
                                className="px-4 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark"
                              >
                                {t('profile.buttons.change')}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.phone')}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              value={formData.phone}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                              disabled
                            />
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleContactChange('phone', formData.phone)}
                                className="px-4 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark"
                              >
                                {t('profile.buttons.change')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Location - Modifiable */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">{t('profile.sections.location')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.country')}
                          </label>
                          <input
                            type="text"
                            value={formData.currentCountry}
                            onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                            disabled={!isEditing}
                            className={cn(
                              "w-full px-4 py-2 border border-gray-300 rounded-lg",
                              !isEditing && "bg-gray-50"
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.city')}
                          </label>
                          <input
                            type="text"
                            value={formData.currentCity}
                            onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                            disabled={!isEditing}
                            className={cn(
                              "w-full px-4 py-2 border border-gray-300 rounded-lg",
                              !isEditing && "bg-gray-50"
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('profile.fields.village')}
                          </label>
                          <input
                            type="text"
                            value={formData.currentVillage}
                            onChange={(e) => setFormData({ ...formData, currentVillage: e.target.value })}
                            disabled={!isEditing}
                            className={cn(
                              "w-full px-4 py-2 border border-gray-300 rounded-lg",
                              !isEditing && "bg-gray-50"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Change */}
                    {isEditing && (
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-lg font-medium">{t('profile.sections.password')}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              setVerificationField(null);
                              setShowPasswordValidationModal(true);
                            }}
                            className="text-waladom-green hover:text-waladom-green-dark flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            {t('profile.buttons.changePassword')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Personal Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">{t('profile.sections.personal')}</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label={t('profile.fields.firstName')} value={user?.firstName} />
                        <InfoRow label={t('profile.fields.lastName')} value={user?.lastName} />
                        <InfoRow label={t('profile.fields.gender')} value={user?.gender} />
                        <InfoRow label={t('profile.fields.dateOfBirth')} value={user?.dateOfBirth} />
                        <InfoRow label={t('profile.fields.occupation')} value={user?.job} />
                        <InfoRow label={t('profile.fields.tribe')} value={user?.tribe} />
                      </dl>
                    </div>

                    {/* Birth Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">{t('profile.sections.birth')}</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label={t('profile.fields.birthCountry')} value={user?.country} />
                        <InfoRow label={t('profile.fields.birthCity')} value={user?.placeOfBirth} />
                        <InfoRow label={t('profile.fields.birthVillage')} value={user?.villageOfBirth} />
                      </dl>
                    </div>

                    {/* Mother's Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">{t('profile.sections.mother')}</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label={t('profile.fields.mothersFirstName')} value={user?.motherFirstName} />
                        <InfoRow label={t('profile.fields.mothersLastName')} value={user?.motherLastName} />
                      </dl>
                    </div>
                  </dl>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-6 border-t mt-6">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {t('profile.buttons.save')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <PasswordValidationModal
          isOpen={showPasswordValidationModal}
          onClose={() => setShowPasswordValidationModal(false)}
          onConfirm={handlePasswordValidation}
          loading={loading}
          error={error}
        />

        <VerificationCodeModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onConfirm={handleVerificationCode}
          onResend={() => sendVerificationCode(formData.email)}
          loading={loading}
          error={error}
          timeLeft={timeLeft}
          method={verificationField || 'email'}
        />

        <NewPasswordModal
          isOpen={showNewPasswordModal}
          onClose={() => setShowNewPasswordModal(false)}
          onConfirm={handlePasswordChange}
          loading={loading}
          error={error}
        />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;