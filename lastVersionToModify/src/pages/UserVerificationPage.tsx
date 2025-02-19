import React, { useState } from "react";
import { Search, AlertCircle, User, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { User as UserType } from "../types/user";
import MainLayout from "../layouts/MainLayout";
import { cn } from "../utils/cn";

interface UserDetailsModalProps {
  user: UserType;
  photos: {
    idProofFront?: string;
    idProofBack?: string;
    waladomCard?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  photos,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Photos Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {photos.idProofFront && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t("verification.userDetails.idProofFront")}
                </h4>
                <img
                  src={photos.idProofFront}
                  alt="ID Front"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {photos.idProofBack && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t("verification.userDetails.idProofBack")}
                </h4>
                <img
                  src={photos.idProofBack}
                  alt="ID Back"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {photos.waladomCard && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t("verification.userDetails.profilePhoto")}
                </h4>
                <img
                  src={photos.waladomCard}
                  alt="Waladom Card"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Personal Information</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("verification.userDetails.firstName")}
                  </dt>
                  <dd>
                    {user.firstName} {user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {" "}
                    {t("verification.userDetails.email")}
                  </dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("verification.userDetails.phone")}
                  </dt>
                  <dd>{user.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {" "}
                    {t("verification.userDetails.gender")}
                  </dt>
                  <dd>{user.sex}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                  {t("verification.userDetails.birthDate")}
                  </dt>
                  <dd>{user.birthDate}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium mb-4">Additional Information</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("verification.userDetails.currentLocation")}

                  </dt>
                  <dd>
                    {user.currentCity}, {user.currentCountry}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                  {t("verification.userDetails.birthInfo")}
                  </dt>
                  <dd>{user.birthCountry}, {user.birthCity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                  {t("verification.userDetails.motherName")}
                  </dt>
                  <dd>
                    {user.mothersFirstName} {user.mothersLastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("verification.userDetails.nationalities")}
                  </dt>
                  <dd>{user.nationalities.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserVerificationPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    id: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [searchResult, setSearchResult] = useState<UserType | null>(null);
  const [signedPhotos, setSignedPhotos] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  const signPhotos = async (photoUrls: string[]) => {
    try {
      const response = await fetch(
        "https://www.waladom.club/api/upload/signephotos",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            user: photoUrls,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sign photos");
      }

      const data = await response.json();
      return data.user || {};
    } catch (error) {
      return {};
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://www.waladom.club/api/user/search", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error("search.errors.noUserFound");
      }

      const data = await response.json();
      const user = Array.isArray(data) ? data[0] : data;

      if (user) {
        setSearchResult(user);

        // Collect photo URLs to sign
        const photoUrls = [
          user.idProofPhotos?.[0]?.photoUrl,
          user.idProofPhotos?.[1]?.photoUrl,
          user.waladomCardPhoto?.photoUrl,
        ].filter(Boolean);

        if (photoUrls.length > 0) {
          const signed = await signPhotos(photoUrls);
          setSignedPhotos(signed);
        }

        setShowModal(true);
      } else {
        setError(t("search.errors.noUserFound"));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? t("search.errors.failedSearch")
          : t("search.errors.genericError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("verification.title")}
            </h2>
          </div>

          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("verification.cardId")}
                </label>
                <input
                  type="text"
                  value={searchParams.id}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                  placeholder={t("verification.cardIdPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("verification.email")}
                </label>
                <input
                  type="email"
                  value={searchParams.email}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                  placeholder={t("verification.emailPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("verification.phone")}
                </label>
                <input
                  type="tel"
                  value={searchParams.phone}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
                  placeholder={t("verification.phonePlaceholder")}
                />
              </div>
        
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                Object.values(searchParams).every(
                  (value) => value.trim() === ""
                )
              }
              className={cn(
                "w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg",
                "text-white bg-waladom-green hover:bg-waladom-green-dark",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("verification.searching")}
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {t("verification.verifyButton")}
                </>
              )}
            </button>
          </form>
        </div>

        {searchResult && (
          <UserDetailsModal
            user={searchResult}
            photos={{
              idProofFront:
                signedPhotos[searchResult.idProofPhotos?.[0]?.photoUrl],
              idProofBack:
                signedPhotos[searchResult.idProofPhotos?.[1]?.photoUrl],
              waladomCard:
                signedPhotos[searchResult.waladomCardPhoto?.photoUrl],
            }}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserVerificationPage;
