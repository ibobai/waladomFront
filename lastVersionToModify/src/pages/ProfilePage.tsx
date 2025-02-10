import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Lock, Upload, AlertCircle, Calendar, Briefcase, Users } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import UserAvatar from '../components/common/UserAvatar';
import { cn } from '../utils/cn';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationField, setVerificationField] = useState < 'email' | 'phone' | null > (null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const fileInputRef = useRef < HTMLInputElement > (null);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState < string | null > (null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    currentCountry: user?.currentCountry || '',
    currentCity: user?.currentCity || '',
    currentVillage: user?.currentVillage || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    photo: null as File | null
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
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
    setShowPasswordDialog(true);
  };


  const handlePasswordVerification = () => {
    setError('');
    // Mock password verification - in real app, verify against API
    if (formData.currentPassword === 'correct-password') {
      setShowPasswordDialog(false);
      setError('');
      if (verificationField) {
        setShowVerificationDialog(true);
        // Mock sending verification code
        console.log('Sending verification code...');
      } else {
        setShowNewPasswordDialog(true);
      }
    } else {
      setError('Incorrect password');
    }
  };

  const handleVerificationCode = () => {
    setError('');
    // Mock code verification - in real app, verify against API
    if (verificationCode === '123456') {
      // Update the contact info based on which field is being changed
      if (verificationField === 'email') {
        setFormData(prev => ({ ...prev, email: formData.newEmail }));
      } else if (verificationField === 'phone') {
        setFormData(prev => ({ ...prev, phone: formData.newPhone }));
      }
      setShowVerificationDialog(false);
      setVerificationField(null);
      setVerificationCode('');
      // Show success message
      toast.success(`${verificationField} updated successfully`);
    } else {
      setError('Invalid verification code');
    }
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Update password logic here
    setShowNewPasswordDialog(false);
    console.log('Password updated');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    } catch (err) {
      setError('Failed to update profile');
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
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'Not provided'}</dd>
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
                  <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
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
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
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
                      Member since {new Date(user?.joinedDate || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    {/* Contact Information - Modifiable */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">Contact Information</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                                Change
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
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
                                Change
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Location - Modifiable */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">Current Location</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
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
                          <h5 className="text-lg font-medium">Password</h5>
                          <button
                            type="button"
                            onClick={() => setShowPasswordDialog(true)}
                            className="text-waladom-green hover:text-waladom-green-dark flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Change Password
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Personal Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">Personal Information</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label="First Name" value={user?.firstName} />
                        <InfoRow label="Last Name" value={user?.lastName} />
                        <InfoRow label="Gender" value={user?.gender} />
                        <InfoRow label="Date of Birth" value={user?.dateOfBirth} />
                        <InfoRow label="Occupation" value={user?.job} />
                        <InfoRow label="Tribe" value={user?.tribe} />
                      </dl>
                    </div>

                    {/* Birth Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">Birth Information</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label="Country of Birth" value={user?.country} />
                        <InfoRow label="City of Birth" value={user?.placeOfBirth} />
                        <InfoRow label="Village of Birth" value={user?.villageOfBirth} />
                      </dl>
                    </div>

                    {/* Mother's Information - Read Only */}
                    <div className="py-4">
                      <h5 className="text-lg font-medium mb-4">Mother's Information</h5>
                      <dl className="divide-y divide-gray-200">
                        <InfoRow label="Mother's First Name" value={user?.motherFirstName} />
                        <InfoRow label="Mother's Last Name" value={user?.motherLastName} />
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
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Verify Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your current password to continue
              </p>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Current password"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setFormData({ ...formData, currentPassword: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordVerification}
                  className="px-4 py-2 bg-waladom-green text-white rounded-lg"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Password Dialog */}
        {showNewPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowNewPasswordDialog(false);
                    setFormData({ ...formData, newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-waladom-green text-white rounded-lg"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update the verification dialog to show error */}
        {showVerificationDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Enter Verification Code</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-4">
                We've sent a verification code to your {verificationField === 'email' ? 'email' : 'phone'}.<br />
                <span className="text-waladom-green font-medium">Use code: 123456</span>
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-center text-2xl tracking-wider"
                maxLength={6}
                placeholder="123456"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowVerificationDialog(false);
                    setVerificationCode('');
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerificationCode}
                  className="px-4 py-2 bg-waladom-green text-white rounded-lg"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
