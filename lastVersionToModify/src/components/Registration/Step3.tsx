import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { countries } from "./CountriesCodes";
import { Link, useNavigate } from "react-router-dom";

interface Step3Props {
  formData: any;
  handleFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleNext: () => void;
  handleBack: () => void;
  contactType: "email" | "phone";
  contact: string;
}

const Step3: React.FC<Step3Props> = ({
  formData,
  handleFormChange,
  handleNext,
  handleBack,
  contactType,
  contact,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<PhotoFiles>({
    reqIdProofFront: null,
    reqIdProofBack: null,
    reqProfile: null,
  });

  const [photoPreview, setPhotoPreview] = useState<Record<string, string>>({
    reqIdProofFront: "",
    reqIdProofBack: "",
    reqProfile: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    return { num1, num2, answer: num1 + num2 };
  });

  //For nationalities
  const [selectedNationalities, setSelectedNationalities] = useState<
    typeof countries
  >([]);

  const handleAddNationality = (country: (typeof countries)[0]) => {
    if (!selectedNationalities.find((n) => n.code === country.code)) {
      const updatedNationalities = [...selectedNationalities, country];
      setSelectedNationalities(updatedNationalities);

      // Ensure formData.nationalities is correctly updated
      formData.nationalities = updatedNationalities.map((n) => n.name);
    }
  };

  const handleRemoveNationality = (code: string) => {
    const updatedNationalities = selectedNationalities.filter(
      (n) => n.code !== code
    );
    setSelectedNationalities(updatedNationalities);

    // Ensure formData.nationalities is correctly updated
    formData.nationalities = updatedNationalities.map((n) => n.name);
  };
  //end for nationalities

  //for password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // Check if the password is at least 8 characters long
    if (password.length >= 8) strength++;

    // Apply further checks if the length condition is met
    if (password.length >= 8) {
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
    }

    setPasswordStrength(strength);
    setIsPasswordStrong(strength >= 4); // Require at least 4 out of 5 rules

    return strength;
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (password === "" || confirmPassword === "") {
      setPasswordMatch(null); // Reset match status if empty
    } else {
      setPasswordMatch(password === confirmPassword && password.length > 0);
    }
  };
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof PhotoFiles
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t("registration.photoSizeError"));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(t("registration.photoTypeError"));
        return;
      }

      setPhotoFiles((prev) => ({ ...prev, [type]: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //for country code
  const [selectedCountryCode, setSelectedCountryCode] = useState("+249"); // Default to Sudan

  const occupations = [
    { value: "Soldier", label: t("registration.occupations.soldier") },
    { value: "Doctor", label: t("registration.occupations.doctor") },
    { value: "Engineer", label: t("registration.occupations.engineer") },
    { value: "Farmer", label: t("registration.occupations.farmer") },
    { value: "Other", label: t("registration.occupations.other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required photos
    if (
      !photoFiles.reqIdProofFront ||
      !photoFiles.reqIdProofBack ||
      !photoFiles.reqProfile
    ) {
      setError(t("registration.missingPhotos"));
      return;
    }

    // Validate password strength
    if (!isPasswordStrong) {
      setError(t("registration.weakPassword"));
      return;
    }

    if (!acceptedTerms) {
      setError(t("registration.acceptTermsRequired"));
      return;
    }

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setError(t("registration.captchaError"));
      return;
    }

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setError(t("registration.invalidCaptcha"));
      return;
    }

    // Format phone number
    const cleanPhone = formData.phone.startsWith("0")
      ? formData.phone.substring(1)
      : formData.phone;
    const formattedPhone = selectedCountryCode + cleanPhone;

    //is loading
    setIsLoading(true);

    // Prepare data for summary page
    const registrationData = {
      ...formData,
      phone: formattedPhone,
      photos: photoFiles,
      photoPreview,
      acceptedTerms,
      subscribeNewsletter,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: contactType === "email" ? contact : formData.email,
      password: formData.password,
      isActive: false,
      status: "inactive",
      tribe: formData.tribe,
      currentCountry: formData.currentCountry,
      currentCity: formData.currentCity,
      currentVillage: formData.currentVillage,
      birthDate: formData.birthDate,
      birthCountry: formData.birthCountry,
      birthCity: formData.birthCity,
      birthVillage: formData.birthVillage,
      maritalStatus: formData.maritalStatus,
      numberOfKids: parseInt(formData.numberOfKids, 10) || 0,
      occupation:
        formData.occupation === "Other"
          ? formData.otherOccupation
          : formData.occupation,
      sex: formData.sex,
      mothersFirstName: formData.mothersFirstName,
      mothersLastName: formData.mothersLastName,
      connectionMethod: contactType,
      nationalities: formData.nationalities,
      comments: formData.comments,
      recommendedBy: formData.invitationCode,
      role: "ROLE_USER",
    };

    // Navigate to summary page instead of direct API call
    handleNext(registrationData);
  };

  // Section Title Component
  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <h3 className="text-xl font-semibold text-waladom-green">{title}</h3>
    </div>
  );

  //Button desactivation tooltip
  const getSubmitButtonTooltip = () => {
    if (
      !photoFiles.reqIdProofFront ||
      !photoFiles.reqIdProofBack ||
      !photoFiles.reqProfile
    ) {
      return t("registration.missingPhotos");
    }
    if (!isPasswordStrong) {
      return t("registration.weakPassword");
    }
    if (!acceptedTerms) {
      return t("registration.acceptTermsRequired");
    }
    return "";
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🇸🇩");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //for countries
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const [dropdownOpen4, setDropdownOpen4] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[1200px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8"
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Personal Information */}
      <div>
        <SectionTitle title={t("registration.personalInfo")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.firstName")}
            </label>
            <span className="text-xs text-gray-500 ml-1"></span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.lastName")}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <SectionTitle title={t("registration.contactInfo")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.email")}
              {contactType === "phone" && (
                <span className="text-xs text-gray-500 ml-1">
                  {t("registration.optionalPhone")}
                </span>
              )}
            </label>
            <input
              type="email"
              name="email"
              value={contactType === "email" ? contact : formData.email}
              onChange={handleFormChange}
              className={cn(
                "w-full px-4 py-3 border border-gray-300 rounded-lg",
                contactType === "email"
                  ? "bg-gray-100"
                  : "focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              )}
              disabled={contactType === "email"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.phone")}
              {contactType === "email" && (
                <span className="text-xs text-gray-500 ml-1">
                  {t("registration.optionalEmail")}
                </span>
              )}
            </label>

            <div className="relative flex gap-3">
              {/* Custom Dropdown */}
              <div className="w-32">
                <div
                  className="relative"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-waladom-green">
                    <span className="text-sm">
                      {selectedCountryFlag} {selectedCountryCode}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-all ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {dropdownOpen && (
                    <ul
                      className="absolute left-0 right-0 z-10 mt-2 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {countries.map((country) => (
                        <li
                          key={country.code}
                          className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSelectedCountryCode(country.phoneCode);
                            setSelectedCountryFlag(country.flag);
                            setDropdownOpen(false);
                          }}
                        >
                          {country.flag} {country.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                name="phone"
                value={contactType === "phone" ? contact : formData.phone}
                onChange={handleFormChange}
                className={cn(
                  "flex-1 px-4 py-3 border border-gray-300 rounded-lg",
                  contactType === "phone"
                    ? "bg-gray-100"
                    : "focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                )}
                placeholder={t("registration.phoneWithoutZero")}
                disabled={contactType === "phone"}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div>
        <SectionTitle title={t("registration.password")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("registration.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleFormChange(e);
                  checkPasswordStrength(e.target.value);
                  checkPasswordMatch(e.target.value, formData.confirmPassword);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t("registration.passwordRequirements")}
              </p>
              {!isPasswordStrong && (
                <p className="text-sm text-red-600 mt-1">
                  {t("registration.passwordNotStrong")}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("registration.confirmPassword")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleFormChange(e);
                  checkPasswordMatch(formData.password, e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Match Message */}
            {passwordMatch !== null && (
              <p
                className={`text-sm mt-2 ${
                  passwordMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordMatch
                  ? t("registration.passwordMatch")
                  : t("registration.passwordMismatch")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <SectionTitle title={t("registration.personalDetails")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              {t("registration.sex")}
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleFormChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent bg-gray-100"
              required
            >
              <option value="">{t("registration.selectSex")}</option>
              <option value="m">{t("registration.male")}</option>
              <option value="f">{t("registration.female")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.maritalStatus")}
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleFormChange}
              className="bg-gray-100 w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            >
              <option value="">{t("registration.selectMaritalStatus")}</option>
              <option value="Single">{t("registration.single")}</option>
              <option value="Married">{t("registration.married")}</option>
              <option value="Divorced">{t("registration.divorced")}</option>
              <option value="Widowed">{t("registration.widowed")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.numberOfKids")}
            </label>
            <input
              type="number"
              name="numberOfKids"
              value={formData.numberOfKids ?? 0} // Ensures 0 is the default if undefined
              onChange={handleFormChange}
              min="0"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Birth Information */}
      <div>
        <SectionTitle title={t("registration.birthInfo")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.birthDate")}
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleFormChange}
              className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.birthCountry")}
            </label>

            {/* Custom Dropdown */}
            <div className="relative">
              <div
                onClick={() => setDropdownOpen1(!dropdownOpen1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green cursor-pointer bg-gray-100"
              >
                <span className="text-sm flex items-center justify-between">
                  <span>
                    {formData.birthCountry ? (
                      <>
                        {
                          countries.find(
                            (country) => country.name === formData.birthCountry
                          )?.flag
                        }
                        {formData.birthCountry}
                      </>
                    ) : (
                      t("registration.selectCountry")
                    )}
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-all ${
                      dropdownOpen1 ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              {dropdownOpen1 && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {/* Search Input */}
                  <div className="px-4 py-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green"
                      placeholder={t("registration.searchCountry")}
                    />
                  </div>

                  {/* Country List */}
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <li
                        key={country.code}
                        onClick={() => {
                          handleFormChange({
                            target: {
                              name: "birthCountry",
                              value: country.name,
                            },
                          });
                          setDropdownOpen1(false); // Close dropdown after selection
                        }}
                        className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {country.flag} {country.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.birthCity")}
            </label>
            <input
              type="text"
              name="birthCity"
              value={formData.birthCity}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.birthVillage")}
            </label>
            <input
              type="text"
              name="birthVillage"
              value={formData.birthVillage}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.nationalities")}
              <span className="text-xs text-gray-500 ml-1">
                  {t("registration.moreNatio")}
                </span>
            </label>
            <div className="relative">
              {/* Custom Dropdown for Countries */}
              <div
                onClick={() => setDropdownOpen4(!dropdownOpen4)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 cursor-pointer focus:ring-2 focus:ring-waladom-green"
              >
                <span className="text-sm flex items-center justify-between">
                  <span>
                    {selectedNationalities.length > 0
                      ? selectedNationalities.map((nationality) => (
                          <span key={nationality.code}>
                            {nationality.flag} {nationality.name}
                          </span>
                        ))
                      : t("registration.addNationality")}
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-all ${
                      dropdownOpen4 ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              {/* Dropdown List */}
              {dropdownOpen4 && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {/* Search Input */}
                  <div className="px-4 py-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green"
                      placeholder={t("registration.searchCountry")}
                    />
                  </div>

                  {/* Country List */}
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <li
                        key={country.code}
                        onClick={() => {
                          handleAddNationality(country);
                          setDropdownOpen4(false); // Close dropdown after selection
                        }}
                        className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {country.flag} {country.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Selected Nationalities */}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedNationalities.map((nationality) => (
                <span
                  key={nationality.code}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100"
                >
                  {nationality.flag} {nationality.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveNationality(nationality.code)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div>
        <SectionTitle title={t("registration.currentLocation")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.currentCountry")}
            </label>

            {/* Custom Dropdown */}
            <div className="relative">
              <div
                onClick={() => setDropdownOpen3(!dropdownOpen3)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green cursor-pointer bg-gray-100"
              >
                <span className="text-sm flex items-center justify-between">
                  <span>
                    {formData.currentCountry ? (
                      <>
                        {
                          countries.find(
                            (country) =>
                              country.name === formData.currentCountry
                          )?.flag
                        }
                        {formData.currentCountry}
                      </>
                    ) : (
                      t("registration.selectCountry")
                    )}
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-all ${
                      dropdownOpen3 ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              {dropdownOpen3 && (
                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {/* Search Input */}
                  <div className="px-4 py-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green"
                      placeholder={t("registration.searchCountry")}
                    />
                  </div>

                  {/* Country List */}
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <li
                        key={country.code}
                        onClick={() => {
                          handleFormChange({
                            target: {
                              name: "currentCountry",
                              value: country.name,
                            },
                          });
                          setDropdownOpen3(false); // Close dropdown after selection
                        }}
                        className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {country.flag} {country.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.currentCity")}
            </label>
            <input
              type="text"
              name="currentCity"
              value={formData.currentCity}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.currentVillage")}
            </label>
            <input
              type="text"
              name="currentVillage"
              value={formData.currentVillage}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <SectionTitle title={t("registration.additionalInfo")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("registration.occupation")}
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleFormChange}
                className="bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                required
              >
                <option value="">{t("registration.selectOccupation")}</option>
                {occupations.map((occ) => (
                  <option key={occ.value} value={occ.value}>
                    {occ.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.occupation === "Other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registration.specifyOccupation")}
                </label>
                <input
                  type="text"
                  name="otherOccupation"
                  value={formData.otherOccupation}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.tribe")}
            </label>
            <input
              type="text"
              name="tribe"
              value={formData.tribe}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.invitationCode")}
            </label>
            <span className="text-xs text-gray-500 ml-1">
              {t("registration.nazir")}
            </span>
            <input
              type="text"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Mother's Information */}
      <div>
        <SectionTitle title={t("registration.motherInfo")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.mothersFirstName")}
            </label>
            <input
              type="text"
              name="mothersFirstName"
              value={formData.mothersFirstName}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.mothersLastName")}
            </label>
            <input
              type="text"
              name="mothersLastName"
              value={formData.mothersLastName}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <SectionTitle title={t("registration.comments")} />
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleFormChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
          placeholder={t("registration.commentsPlaceholder")}
        />
      </div>

      {/* Photo Upload */}
      {/* Photo Upload Section */}
      <div>
        <h2 className="text-xl font-semibold text-waladom-green mb-4">
          {t("registration.photoUpload")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ID Front */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.idProofFront")}
            </label>
            <div className="relative">
              {photoPreview.reqIdProofFront ? (
                <div className="relative">
                  <img
                    src={photoPreview.reqIdProofFront}
                    alt="ID Front"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoFiles((prev) => ({
                        ...prev,
                        reqIdProofFront: null,
                      }));
                      setPhotoPreview((prev) => ({
                        ...prev,
                        reqIdProofFront: "",
                      }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-waladom-green" />
                  <span className="mt-2 text-sm text-gray-600">
                    {t("registration.selectIdFront")}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, "reqIdProofFront")}
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* ID Back */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.idProofBack")}
            </label>
            <div className="relative">
              {photoPreview.reqIdProofBack ? (
                <div className="relative">
                  <img
                    src={photoPreview.reqIdProofBack}
                    alt="ID Back"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoFiles((prev) => ({
                        ...prev,
                        reqIdProofBack: null,
                      }));
                      setPhotoPreview((prev) => ({
                        ...prev,
                        reqIdProofBack: "",
                      }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-waladom-green" />
                  <span className="mt-2 text-sm text-gray-600">
                    {t("registration.selectIdBack")}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, "reqIdProofBack")}
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("registration.profilePhoto")}
            </label>
            <div className="relative">
              {photoPreview.reqProfile ? (
                <div className="relative">
                  <img
                    src={photoPreview.reqProfile}
                    alt="Profile"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoFiles((prev) => ({ ...prev, reqProfile: null }));
                      setPhotoPreview((prev) => ({ ...prev, reqProfile: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-waladom-green" />
                  <span className="mt-2 text-sm text-gray-600">
                    {t("registration.selectProfilePhoto")}
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(e, "reqProfile")}
                    required
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Newsletter */}
      <div>
        <SectionTitle title={t("registration.termsAndConditions")} />
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-waladom-green focus:ring-waladom-green"
                required
              />
            </div>

            <div className="ml-3">
              <label htmlFor="terms" className="text-sm text-gray-600">
                <Link
                  to="/terms"
                  className="text-waladom-green hover:underline"
                  state={{ fromRegistration: true }}
                >
                  {t("registration.acceptTerms")}
                </Link>
              </label>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="newsletter"
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-waladom-green focus:ring-waladom-green"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                {t("registration.subscribeNewsletter")}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Captcha */}
      {/* Captcha */}
      <div>
        <SectionTitle title={t("registration.captcha")} />
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-6 py-4 rounded-lg text-lg font-mono">
            {captchaQuestion.num1} + {captchaQuestion.num2} = ?
          </div>
          <input
            type="text"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent text-center"
            required
          />
        </div>
        {captchaAnswer &&
          parseInt(captchaAnswer) !==
            captchaQuestion.num1 + captchaQuestion.num2 && (
            <p className="text-red-500 mt-2">
              {t("registration.captchaError")}
            </p>
          )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
        >
          {t("common.back")}
        </button>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={
              isLoading ||
              !isPasswordStrong ||
              !photoFiles.reqIdProofFront ||
              !photoFiles.reqIdProofBack ||
              !photoFiles.reqProfile ||
              !acceptedTerms
            }
            className={cn(
              "px-6 py-2 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title={getSubmitButtonTooltip()}
          >
            {isLoading ? t("common.processing") : t("common.continue")}
          </button>
          {/* Validation Messages */}
          <div className="text-sm text-red-600 space-y-1">
            {!photoFiles.reqIdProofFront ||
            !photoFiles.reqIdProofBack ||
            !photoFiles.reqProfile ? (
              <p>❌ {t("registration.missingPhotos")}</p>
            ) : null}
            {!isPasswordStrong ? (
              <p>❌ {t("registration.weakPassword")}</p>
            ) : null}
            {!acceptedTerms ? (
              <p>❌ {t("registration.acceptTermsRequired")}</p>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Step3;
