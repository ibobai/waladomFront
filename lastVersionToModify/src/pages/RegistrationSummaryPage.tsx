import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { Loader2 } from "lucide-react";
import { useToast } from "../hooks/useToast";

interface PhotoPreviews {
  reqIdProofFront: string;
  reqIdProofBack: string;
  reqProfile: string;
}

interface PhotoFiles {
  reqIdProofFront: File | null;
  reqIdProofBack: File | null;
  reqProfile: File | null;
}

interface RegistrationSummaryPageProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    isActive: boolean;
    status: string;
    tribe: string;
    currentCountry: string;
    currentCity: string;
    currentVillage: string;
    birthDate: string;
    birthCountry: string;
    birthCity: string;
    birthVillage: string;
    maritalStatus: string;
    numberOfKids: number;
    occupation: string;
    sex: string;
    mothersFirstName: string;
    mothersLastName: string;
    connectionMethod: "email" | "phone";
    nationalities: string[];
    comments?: string;
    invitedBy?: string;
    role: string;
    photoPreview?: PhotoPreviews;
    photos?: PhotoFiles;
    acceptedTerms: boolean;
    subscribeNewsletter: boolean;
    approverComment: string;
    recommendedBy: string;
  };
  onConfirm: () => void;
  onEdit: () => void;
}

const RegistrationSummaryPage: React.FC<RegistrationSummaryPageProps> = ({
  formData,
  onConfirm,
  onEdit,
}) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Helper function to trim values
  const trimValue = (value: string) => value?.trim() || "";

    const sectionColors = [
    "bg-blue-50 border-blue-400", 
    "bg-green-50 border-green-300", 
    "bg-yellow-50 border-yellow-300", 
    "bg-red-50 border-purple-300", 
    "bg-green-100 border-pink-300"
  ];

 // const sectionColors = [
   // "bg-green-100 border-green-200",  // Very light green
   // "bg-green-300 border-green-400",  // Medium light green
 //   "bg-green-400 border-green-500",  // Deeper green
 //   "bg-green-500 border-green-600",  // Vibrant green (Max Green you mentioned)
  //  "bg-green-600 border-green-700",  // Darker green
//    "bg-green-700 border-green-800"   // Very dark green
 // ];

  // Format connection method translation
  const getConnectionMethodTranslation = (method: string) => {
    return t(`registration.connectionMethod.${method.toLowerCase()}`);
  };

  
  const sections = [
    {
      title: t("registration.personalInfo"),
      fields: [
        {
          label: t("registration.firstName"),
          value: trimValue(formData.firstName),
        },
        {
          label: t("registration.lastName"),
          value: trimValue(formData.lastName),
        },
        {
          label: t("registration.sex"),
          value: formData.sex === "m" ? t("registration.male") : formData.sex === "f" ? t("registration.female") : formData.sex
        },               
        {
          label: t("registration.maritalStatus"),
          value: t(`registration.${formData.maritalStatus.toLowerCase()}`) // Convert the status to lowercase before passing it
        },        
        {
          label: t("registration.numberOfKids"),
          value: formData.numberOfKids.toString(),
        },
      ],
    },
    {
      title: t("registration.contactInfo"),
      fields: [
        { label: t("registration.email"), value: trimValue(formData.email) },
        { label: t("registration.phone"), value: trimValue(formData.phone) },
        {
          label: t("registration.connectionMethod2"),
          value: getConnectionMethodTranslation(formData.connectionMethod),
        },
      ],
    },
    {
      title: t("registration.birthInfo"),
      fields: [
        {
          label: t("registration.birthDate"),
          value: trimValue(formData.birthDate),
        },
        {
          label: t("registration.birthCountry"),
          value: trimValue(formData.birthCountry),
        },
        {
          label: t("registration.birthCity"),
          value: trimValue(formData.birthCity),
        },
        {
          label: t("registration.birthVillage"),
          value: trimValue(formData.birthVillage),
        },
      ],
    },
    {
      title: t("registration.currentLocation"),
      fields: [
        {
          label: t("registration.currentCountry"),
          value: trimValue(formData.currentCountry),
        },
        {
          label: t("registration.currentCity"),
          value: trimValue(formData.currentCity),
        },
        {
          label: t("registration.currentVillage"),
          value: trimValue(formData.currentVillage),
        },
      ],
    },
    {
      title: t("registration.additionalInfo"),
      fields: [
        {
          label: t("registration.maritalStatus"),
          value: t(`registration.occupations.${formData.occupation.toLowerCase()}`) // Convert the status to lowercase before passing it
         
        },
        { label: t("registration.tribe"), value: trimValue(formData.tribe) },
        {
          label: t("registration.nationalities"),
          value: formData.nationalities.join(", "),
        },
        {
          label: t("registration.invitationCode"),
          value: trimValue(formData.recommendedBy),
        },
        {
          label: t("registration.comments"),
          value: trimValue(formData.comments),
        },
      ],
    },
    {
      title: t("registration.motherInfo"),
      fields: [
        {
          label: t("registration.mothersFirstName"),
          value: trimValue(formData.mothersFirstName),
        },
        {
          label: t("registration.mothersLastName"),
          value: trimValue(formData.mothersLastName),
        },
      ],
    },
  ];

  const uploadPhotos = async () => {
    if (!formData.photos) {
      throw new Error("No photos to upload");
    }

    const uploadFormData = new FormData();

    if (formData.photos.reqIdProofFront) {
      uploadFormData.append("reqIdProofFront", formData.photos.reqIdProofFront);
    }
    if (formData.photos.reqIdProofBack) {
      uploadFormData.append("reqIdProofBack", formData.photos.reqIdProofBack);
    }
    if (formData.photos.reqProfile) {
      uploadFormData.append("reqProfile", formData.photos.reqProfile);
    }

    const response = await fetch("https://www.waladom.club/api/upload/files", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload photos");
    }

    return await response.json();
  };

  const translateApiError = (message: string) => {
    // Map common API error messages to translation keys
    const errorMap: Record<string, string> = {
      "User already exists": "apiErrors.userExists",
      "Invalid email": "apiErrors.invalidEmail",
      "Invalid phone number": "apiErrors.invalidPhone",
      "Invalid password": "apiErrors.invalidPassword",
      "Server error": "apiErrors.serverError",
      "Failed to upload photos": "apiErrors.photoUploadFailed",
      "Registration failed": "apiErrors.registrationFailed",
    };

    // Check if we have a translation for this error
    const translationKey = errorMap[message];
    if (translationKey) {
      return t(translationKey);
    }

    // If no translation found, return the original message
    return message;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();

      // Prepare registration data with trimmed values
      const registrationData = {
        firstName: trimValue(formData.firstName),
        lastName: trimValue(formData.lastName),
        email: trimValue(formData.email),
        password: trimValue(formData.password),
        phone: trimValue(formData.phone),
        isActive: false,
        status: "inactive",
        tribe: trimValue(formData.tribe),
        currentCountry: trimValue(formData.currentCountry),
        currentCity: trimValue(formData.currentCity),
        currentVillage: trimValue(formData.currentVillage),
        birthDate: trimValue(formData.birthDate),
        birthCountry: trimValue(formData.birthCountry),
        birthCity: trimValue(formData.birthCity),
        birthVillage: trimValue(formData.birthVillage),
        maritalStatus: trimValue(formData.maritalStatus),
        numberOfKids: formData.numberOfKids,
        occupation: trimValue(formData.occupation),
        sex: trimValue(formData.sex),
        mothersFirstName: trimValue(formData.mothersFirstName),
        mothersLastName: trimValue(formData.mothersLastName),
        approverComment: formData.approverComment,
        recommendedBy: formData.recommendedBy,
        connectionMethod: formData.connectionMethod,
        nationalities: formData.nationalities,
        comments: trimValue(formData.comments),
        role: "ROLE_USER",
        idProofPhotoFront: photoUrls.reqIdProofFront,
        idProofPhotoBack: photoUrls.reqIdProofBack,
        waladomCardPhoto: photoUrls.reqProfile,
      };

      const response = await fetch(
        "https://www.waladom.club/api/user/register/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const translatedError = translateApiError(data.message);
        toast.error(translatedError);
        setError(translatedError);
        return;
      }

      onConfirm();
    } catch (error) {
      console.error("Registration error:", error);
      const translatedError = t("apiErrors.registrationFailed");
      toast.error(translatedError);
      if (error instanceof Error) {
        setError(translateApiError(error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {t("registration.summary")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("registration.reviewInfo")}
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="px-4 py-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              {/* Photos Preview Section */}
              {formData.photoPreview && (
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {t("registration.uploadedPhotos")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {t("registration.idProofFront")}
                      </p>
                      <img
                        src={formData.photoPreview.reqIdProofFront}
                        alt={t("registration.idProofFront")}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {t("registration.idProofBack")}
                      </p>
                      <img
                        src={formData.photoPreview.reqIdProofBack}
                        alt={t("registration.idProofBack")}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {t("registration.profilePhoto")}
                      </p>
                      <img
                        src={formData.photoPreview.reqProfile}
                        alt={t("registration.profilePhoto")}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
          
              {/* Information Sections */}
              {sections.map((section, index) => {
                const colorClass = sectionColors[index % sectionColors.length]; // Cycle through colors

                return (
                  <div
                    key={index}
                    className={`mb-8 p-4 rounded-lg border ${colorClass}`}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-400">
                      {section.title}
                    </h4>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                          <dt className="text-sm font-semibold text-gray-600">
                            {field.label}
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md shadow-sm">
                            {field.value || t("common.notProvided")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
              <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={onEdit}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t("common.edit")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-waladom-green text-white rounded-lg hover:bg-waladom-green-dark disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("common.submitting")}
                    </>
                  ) : (
                    t("common.confirmAndSubmit")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegistrationSummaryPage;
