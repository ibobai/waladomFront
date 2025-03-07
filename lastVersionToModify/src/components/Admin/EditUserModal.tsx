import React, { useState, useEffect } from "react";
import { X, AlertCircle, Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

interface EditUserModalProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
    approverComment: string;
    recommendedBy: string;
    occupation: string;
    sex: string;
    mothersFirstName: string;
    mothersLastName: string;
    nationalities: string[];
    role: {
      id: string;
      name: string;
      color: string;
    };
    idProofPhotos?: {
      id: string;
      photoUrl: string;
      type: string;
    }[];
    waladomCardPhoto?: {
      id: string;
      photoUrl: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

interface PhotoFiles {
  idProofFront: File | null;
  idProofBack: File | null;
  waladomProfile: File | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [signedPhotos, setSignedPhotos] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<PhotoFiles>({
    idProofFront: null,
    idProofBack: null,
    waladomProfile: null,
  });
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>(
    {}
  );
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    password: "",
    confirmPassword: "",
    country: user.birthCountry,
    currentCountry: user.currentCountry,
    currentCity: user.currentCity,
    currentVillage: user.currentVillage,
    dateOfBirth: user.birthDate,
    placeOfBirth: user.birthCity,
    tribe: user.tribe,
    motherFirstName: user.mothersFirstName,
    motherLastName: user.mothersLastName,
    nationalities: user.nationalities,
    job: user.occupation,
    maritalStatus: user.maritalStatus,
    numberOfKids: user.numberOfKids,
    approverComment: user.approverComment,
    recommendedBy: user.recommendedBy,
    sex: user.sex,
    birthCountry: user.birthCountry,
    birthCity: user.birthCity,
    birthVillage: user.birthVillage,
    occupation: user.occupation,
  });

  useEffect(() => {
    const signPhotos = async () => {
      if (!user.idProofPhotos?.length && !user.waladomCardPhoto) return;

      try {
        const photoUrls = [
          ...(user.idProofPhotos?.map((p) => p.photoUrl) || []),
          user.waladomCardPhoto?.photoUrl,
        ].filter(Boolean);

        const response = await fetch(
          "https://www.waladom.club/api/upload/signephotos",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(photoUrls),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to sign photos");
        }

        const data = await response.json();
        setSignedPhotos(data);
      } catch (error) {
        console.error("Error signing photos:", error);
      }
    };

    if (isOpen) {
      signPhotos();
    }
  }, [user, isOpen]);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof PhotoFiles
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t("userManagement.errors.photoTooLarge"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(t("userManagement.errors.invalidPhotoType"));
      return;
    }

    setPhotos((prev) => ({ ...prev, [type]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreviews((prev) => ({
        ...prev,
        [type]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadPhotos = async () => {
    const formData = new FormData();

    if (photos.idProofFront) {
      formData.append("idProofFront", photos.idProofFront);
    }
    if (photos.idProofBack) {
      formData.append("idProofBack", photos.idProofBack);
    }
    if (photos.waladomProfile) {
      formData.append("waladomProfile", photos.waladomProfile);
    }

    const response = await fetch("https://www.waladom.club/api/upload/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(t("userManagement.errors.photoUploadFailed"));
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (changePassword) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t("registration.passwordMismatch"));
        }

        if (checkPasswordStrength(formData.password) < 4) {
          throw new Error(t("registration.passwordTooWeak"));
        }
      }

      let photoUrls = {};
      if (Object.values(photos).some((photo) => photo !== null)) {
        photoUrls = await uploadPhotos();
      }

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        ...(changePassword && { password: formData.password }),
        tribe: formData.tribe,
        currentCountry: formData.currentCountry,
        currentCity: formData.currentCity,
        currentVillage: formData.currentVillage,
        birthDate: formData.dateOfBirth,
        birthCountry: formData.birthCountry,
        birthCity: formData.birthCity,
        birthVillage: formData.birthVillage,
        maritalStatus: formData.maritalStatus,
        numberOfKids: formData.numberOfKids,
        occupation: formData.occupation,
        approverComment: formData.approverComment,
        recommendedBy: formData.recommendedBy,
        sex: formData.sex,
        mothersFirstName: formData.motherFirstName,
        mothersLastName: formData.motherLastName,
        nationalities: formData.nationalities,
        ...(photos.idProofFront && {
          idProofPhotoFront: photoUrls.idProofFront,
        }),
        ...(photos.idProofBack && { idProofPhotoBack: photoUrls.idProofBack }),
        ...(photos.waladomProfile && {
          waladomCardPhoto: photoUrls.waladomProfile,
        }),
      };

      const response = await fetch(
        `https://www.waladom.club/api/user/update/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(t("userManagement.errors.updateFailed"));
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.updateFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {t("userManagement.editUser")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Photos Section */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">
              {t("userManagement.photos")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ID Proof Front */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("userManagement.idProofFront")}
                </label>
                {photoPreviews.idProofFront ||
                (user.idProofPhotos?.[0] &&
                  signedPhotos[user.idProofPhotos[0].photoUrl]) ? (
                  <div className="relative">
                    <img
                      src={
                        photoPreviews.idProofFront ||
                        (user.idProofPhotos?.[0] &&
                          signedPhotos[user.idProofPhotos[0].photoUrl])
                      }
                      alt="ID Front"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotos((prev) => ({ ...prev, idProofFront: null }));
                        setPhotoPreviews((prev) => ({
                          ...prev,
                          idProofFront: "",
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {t("userManagement.uploadPhoto")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, "idProofFront")}
                    />
                  </label>
                )}
              </div>

              {/* ID Proof Back */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("userManagement.idProofBack")}
                </label>
                {photoPreviews.idProofBack ||
                (user.idProofPhotos?.[1] &&
                  signedPhotos[user.idProofPhotos[1].photoUrl]) ? (
                  <div className="relative">
                    <img
                      src={
                        photoPreviews.idProofBack ||
                        (user.idProofPhotos?.[1] &&
                          signedPhotos[user.idProofPhotos[1].photoUrl])
                      }
                      alt="ID Back"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotos((prev) => ({ ...prev, idProofBack: null }));
                        setPhotoPreviews((prev) => ({
                          ...prev,
                          idProofBack: "",
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {t("userManagement.uploadPhoto")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, "idProofBack")}
                    />
                  </label>
                )}
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("userManagement.profilePhoto")}
                </label>
                {photoPreviews.waladomProfile ||
                (user.waladomCardPhoto &&
                  signedPhotos[user.waladomCardPhoto.photoUrl]) ? (
                  <div className="relative">
                    <img
                      src={
                        photoPreviews.waladomProfile ||
                        (user.waladomCardPhoto &&
                          signedPhotos[user.waladomCardPhoto.photoUrl])
                      }
                      alt="Profile"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotos((prev) => ({
                          ...prev,
                          waladomProfile: null,
                        }));
                        setPhotoPreviews((prev) => ({
                          ...prev,
                          waladomProfile: "",
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {t("userManagement.uploadPhoto")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, "waladomProfile")}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">
                {t("userManagement.password")}
              </h4>
              <button
                type="button"
                onClick={() => setChangePassword(!changePassword)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  changePassword
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-waladom-green text-white hover:bg-waladom-green-dark"
                )}
              >
                {changePassword
                  ? t("common.cancel")
                  : t("userManagement.changePassword")}
              </button>
            </div>

            {changePassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("userManagement.newPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        checkPasswordStrength(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                      required={changePassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("userManagement.passwordRequirements")}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("userManagement.confirmPassword")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                      required={changePassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.firstName")}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.lastName")}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.email")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.phone")}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Tribe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.tribe")}
              </label>
              <input
                type="text"
                value={formData.tribe}
                onChange={(e) =>
                  setFormData({ ...formData, tribe: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.birthDate")}
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Birth Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.birthCountry")}
              </label>
              <input
                type="text"
                value={formData.birthCountry}
                onChange={(e) =>
                  setFormData({ ...formData, birthCountry: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Birth City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.birthCity")}
              </label>
              <input
                type="text"
                value={formData.birthCity}
                onChange={(e) =>
                  setFormData({ ...formData, birthCity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Birth Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.birthVillage")}
              </label>
              <input
                type="text"
                value={formData.birthVillage}
                onChange={(e) =>
                  setFormData({ ...formData, birthVillage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Current Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.currentCountry")}
              </label>
              <input
                type="text"
                value={formData.currentCountry}
                onChange={(e) =>
                  setFormData({ ...formData, currentCountry: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Current City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.currentCity")}
              </label>
              <input
                type="text"
                value={formData.currentCity}
                onChange={(e) =>
                  setFormData({ ...formData, currentCity: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.maritalStatus")}
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({ ...formData, maritalStatus: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="single">
                  {t("userManagement.status.single")}
                </option>
                <option value="married">
                  {t("userManagement.status.married")}
                </option>
                <option value="divorced">
                  {t("userManagement.status.divorced")}
                </option>
                <option value="widow">
                  {t("userManagement.status.widow")}
                </option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.occupation")}
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Approver Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.approverComment")}
              </label>
              <textarea
                value={formData.approverComment}
                onChange={(e) =>
                  setFormData({ ...formData, approverComment: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>

            {/* Recommended By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.recommendedBy")}
              </label>
              <input
                type="text"
                value={formData.recommendedBy}
                onChange={(e) =>
                  setFormData({ ...formData, recommendedBy: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.sex")}
              </label>
              <select
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="M">{t("userManagement.male")}</option>
                <option value="F">{t("userManagement.female")}</option>
              </select>
            </div>

            {/* Mother's First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.mothersFirstName")}
              </label>
              <input
                type="text"
                value={formData.motherFirstName}
                onChange={(e) =>
                  setFormData({ ...formData, motherFirstName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Mother's Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.mothersLastName")}
              </label>
              <input
                type="text"
                value={formData.motherLastName}
                onChange={(e) =>
                  setFormData({ ...formData, motherLastName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Nationalities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("userManagement.nationalities")}
              </label>
              <input
                type="text"
                value={formData.nationalities.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nationalities: e.target.value.split(", "),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-waladom-green text-white rounded-lg flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
