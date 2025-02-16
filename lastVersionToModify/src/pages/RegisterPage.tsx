import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Step1 from '../components/Registration/Step1';
import Step2 from '../components/Registration/Step2';
import Step3 from '../components/Registration/Step3';
import RegistrationSummaryPage from './RegistrationSummaryPage';

interface PhotoFiles {
  reqIdProofFront: File | null;
  reqIdProofBack: File | null;
  reqProfile: File | null;
}

interface PhotoPreviews {
  reqIdProofFront: string;
  reqIdProofBack: string;
  reqProfile: string;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  idCardPhoto: string;
  gender: string;
  dateOfBirth: string;
  countryOfBirth: string;
  cityOfBirth: string;
  villageOfBirth: string;
  currentCountry: string;
  currentCity: string;
  currentVillage: string;
  occupation: string;
  tribe: string;
  motherFirstName: string;
  motherLastName: string;
  photos?: PhotoFiles;
  photoPreview?: PhotoPreviews;
  acceptedTerms?: boolean;
  subscribeNewsletter?: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idCardPhoto: '',
    gender: '',
    dateOfBirth: '',
    countryOfBirth: '',
    cityOfBirth: '',
    villageOfBirth: '',
    currentCountry: '',
    currentCity: '',
    currentVillage: '',
    occupation: '',
    tribe: '',
    motherFirstName: '',
    motherLastName: ''
  });

  const validateNumberInput = (value: string) => {
    return /^[0-9]*$/.test(value); // Only allows numbers
  };
  const numberOnlyFields = ["phone"]; // Add any fields that should accept only numbers

  const textOnlyFields = ["firstName", "lastName", "tribe", "mothersFirstName", "mothersLastName"]; // Add relevant text-only fields
  const validateTextInput = (value: string) => {
    if (value === "") return true; // Allow clearing the input
    return /^[a-zA-Z\u0600-\u06FF\u00C0-\u024F\s-]+$/.test(value);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (textOnlyFields.includes(name) && !validateTextInput(value)) return; // Skip invalid input
    if (numberOnlyFields.includes(name) && !validateNumberInput(value)) {
      return;
    } 
    if ((name === "phone" || name == "invitationCode") && value.length > 13) {
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = (type: 'email' | 'phone', value: string) => {
    setContactType(type);
    setContact(value);
    if (type === 'email') {
      setFormData(prev => ({ ...prev, email: value }));
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
    }
    setCurrentStep(2);
  };

  const handleNext = (registrationData?: RegistrationData) => {
    if (currentStep === 3 && registrationData) {
      setFormData(registrationData);
      setShowSummary(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirmRegistration = () => {
    // Navigate to success page
    navigate('/registration-success', { replace: true });
  };

  const handleEditRegistration = () => {
    setShowSummary(false);
  };

  if (showSummary) {
    return (
      <RegistrationSummaryPage
        formData={formData}
        onConfirm={handleConfirmRegistration}
        onEdit={handleEditRegistration}
      />
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step !== 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= currentStep ? 'bg-waladom-green text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step !== 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        step < currentStep ? 'bg-waladom-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {currentStep === 1 && (
              <Step1 handleNext={handleStep1Submit} />
            )}
            {currentStep === 2 && (
              <Step2 
                contactType={contactType}
                contact={contact}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                handleFormChange={handleFormChange}
                handleNext={handleNext}
                handleBack={handleBack}
                contactType={contactType}
                contact={contact}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;