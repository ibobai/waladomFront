import React from 'react';
import { Mail, Phone, User, MapPin, Briefcase, Calendar, Building, Eye, EyeOff } from 'lucide-react';

interface RegistrationInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  passwordStrength: number;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  checkPasswordStrength: (password: string) => void;
  getStrengthColor: () => string;
}

const RegistrationInfo: React.FC<RegistrationInfoProps> = ({
  formData,
  handleChange,
  passwordStrength,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  checkPasswordStrength,
  getStrengthColor
}) => {
  const tribes = [
    { value: 'misiria', label: 'Misiria' },
    { value: 'khouzam', label: 'Khouzam' },
    { value: 'rizaigat', label: 'Rizaigat' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tribe
          </label>
          <select
            name="tribe"
            value={formData.tribe}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          >
            <option value="">Select tribe</option>
            {tribes.map(tribe => (
              <option key={tribe.value} value={tribe.value}>
                {tribe.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City of Birth
          </label>
          <input
            type="text"
            name="cityOfBirth"
            value={formData.cityOfBirth}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Village of Birth
          </label>
          <input
            type="text"
            name="villageOfBirth"
            value={formData.villageOfBirth}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                checkPasswordStrength(e.target.value);
              }}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must contain uppercase, lowercase, number, and special character
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationInfo;