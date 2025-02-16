import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash } from "lucide-react";

import { Search, X, AlertCircle, Loader2, Check } from "lucide-react";
import { cn } from "../../utils/cn";

interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "inactive"
    | "blocked";
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
  nationalities: string[];
  comments?: string;
  createdAt: string;
  connectionMethod: string;
  approverComment: string;
  recommendedBy: string;
  validated: boolean | null;
  idProofPhotos: { photoUrl: string }[];
  waladomCardPhoto: { photoUrl: string };
}

interface DetailsModalProps {
  request: RegistrationRequest;
  signedPhotos: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type: "approve" | "reject" | "delete";
  children?: React.ReactNode; // Add children prop
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  request,
  signedPhotos,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDelete,
}) => {
  const { t } = useTranslation();

  console.log(request);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {t("registrationRequests.details.title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {request.idProofPhotos.map((photo, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  {index === 0
                    ? t("registrationRequests.details.photos.idFront")
                    : t("registrationRequests.details.photos.idBack")}
                </h4>
                <img
                  src={signedPhotos[photo.photoUrl] || photo.photoUrl}
                  alt={`ID ${index === 0 ? "Front" : "Back"}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t("registrationRequests.details.photos.profile")}
              </h4>
              <img
                src={
                  signedPhotos[request.waladomCardPhoto.photoUrl] ||
                  request.waladomCardPhoto.photoUrl
                }
                alt="Profile"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* User Information */}
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">
                {t("registrationRequests.details.personalInfo")}
              </h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.name")}
                  </dt>
                  <dd>
                    {request.firstName} {request.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.birthDate")}
                  </dt>
                  <dd>{request.birthDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.email")}
                  </dt>
                  <dd>{request.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.phone")}
                  </dt>
                  <dd>{request.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.sex")}
                  </dt>
                  <dd>{request.sex}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.occupation")}
                  </dt>
                  <dd>{request.occupation}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.tribe")}
                  </dt>
                  <dd>{request.tribe}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.comments")}
                  </dt>
                  <dd>{request.comments}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.maritalStatusAndKids")}
                  </dt>
                  <dd>
                    {request.maritalStatus}, {request.numberOfKids}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.connectionMethod")}
                  </dt>
                  <dd>{request.connectionMethod}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.approverComment")}
                  </dt>
                  <dd>{request.approverComment}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.recommendedBy")}
                  </dt>
                  <dd>{request.recommendedBy}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-medium mb-4">
                {t("registrationRequests.details.locationInfo")}
              </h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.currentLocation")}
                  </dt>
                  <dd>
                    {request.currentVillage}, {request.currentCity},{" "}
                    {request.currentCountry}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.birthInfo")}
                  </dt>
                  <dd>
                    {request.birthVillage}, {request.birthCity},{" "}
                    {request.birthCountry}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.motherName")}
                  </dt>
                  <dd>
                    {request.mothersFirstName} {request.mothersLastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.nationalities")}
                  </dt>
                  <dd>{request.nationalities.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {t("registrationRequests.details.status")}
                  </dt>
                  <dd>{request.status}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onReject}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              {t("registrationRequests.actions.reject")}
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {t("registrationRequests.actions.delete")}
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {t("registrationRequests.actions.approve")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  type,
}) => {
  if (!isOpen) return null;

  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {t("registrationRequests.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 text-white rounded-lg",
              type === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const RegistrationRequests: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tribe: "",
    date: "",
  });
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "approve" | "reject" | "delete"
  >("approve");
  const [signedPhotos, setSignedPhotos] = useState<Record<string, string>>({});

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "https://www.waladom.club/api/user/register/get/all",
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(t("registrationRequests.messages.fetchError"));
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("registrationRequests.messages.fetchError")
      );
    } finally {
      setLoading(false);
    }
  };

  const signPhotos = async (photoUrls: string[]) => {
    try {
      const response = await fetch(
        "https://www.waladom.club/api/upload/signephoto",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(photoUrls),
        }
      );

      if (!response.ok) {
        throw new Error(t("registrationRequests.messages.photoError"));
      }

      const data = await response.json();
      setSignedPhotos(data);
    } catch (error) {
      console.error("Error signing photos:", error);
    }
  };

  const handleRowClick = async (request: RegistrationRequest) => {
    setSelectedRequest(request);

    // Collect all photo URLs
    const photoUrls = [
      ...request.idProofPhotos.map((p) => p.photoUrl),
      request.waladomCardPhoto.photoUrl,
    ];

    // Sign photos
    await signPhotos(photoUrls);
    setShowDetailsModal(true);
  };

  const [approverComment, setApproverComment] = useState("");

  const handleApprove = async () => {
    if (!selectedRequest) return;

    const jsonString = JSON.stringify({
      validated: true,
      status: "active",
      isActive: true,
      approverComment,
    });

    try {
      const response = await fetch(
        `https://www.waladom.club/api/user/register/update/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: jsonString,
        }
      );

      if (!response.ok) {
        throw new Error(t("registrationRequests.messages.approveError"));
      }

      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "approved" } : req
        )
      );
      setShowDetailsModal(false);
      setShowConfirmationModal(false);
      setApproverComment(""); // Reset comment
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("registrationRequests.messages.approveError")
      );
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    const jsonString = JSON.stringify({
      status: "rejected",
      isActive: false,
      approverComment,
    });

    try {
      const response = await fetch(
        `https://www.waladom.club/api/user/register/update/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: jsonString,
        }
      );

      if (!response.ok) {
        throw new Error(t("registrationRequests.messages.rejectError"));
      }

      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "rejected" } : req
        )
      );
      setShowDetailsModal(false);
      setShowConfirmationModal(false);
      setApproverComment(""); // Reset comment
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("registrationRequests.messages.rejectError")
      );
    }
  };

  const handelDelete = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(
        `https://www.waladom.club/api/user/register/delete/${selectedRequest.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({ approverComment }),
        }
      );

      if (!response.ok) {
        throw new Error(t("registrationRequests.messages.deleteError"));
      }

      setRequests(requests.filter((req) => req.id !== selectedRequest.id));
      setShowDetailsModal(false);
      setShowConfirmationModal(false);
      setApproverComment(""); // Reset comment
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("registrationRequests.messages.deleteError")
      );
    }
  };

  const filteredRequests = requests.filter((request) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      request.firstName.toLowerCase().includes(searchLower) ||
      request.lastName.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      request.phone.includes(searchLower) ||
      request.id.toLowerCase().includes(searchLower);

    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesTribe =
      !filters.tribe ||
      request.tribe.toLowerCase().includes(filters.tribe.toLowerCase());
    const matchesDate =
      !filters.date || request.createdAt.includes(filters.date);

    return matchesSearch && matchesStatus && matchesTribe && matchesDate;
  });

  //pagination
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-waladom-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {t("registrationRequests.title")}
        </h3>
        <p className="text-gray-600">
          {t("registrationRequests.totaltext", {
            total: filteredRequests.length,
          })}
        </p>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder={t("registrationRequests.filters.search")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
            >
              <option value="">
                {t("registrationRequests.filters.status")}
              </option>
              <option value="pending">
                {t("registrationRequests.status.pending")}
              </option>
              <option value="approved">
                {t("registrationRequests.status.approved")}
              </option>
              <option value="rejected">
                {t("registrationRequests.status.rejected")}
              </option>
              <option value="blocked">
                {t("registrationRequests.status.blocked")}
              </option>
              <option value="active">
                {t("registrationRequests.status.active")}
              </option>
              <option value="inactive">
                {t("registrationRequests.status.inactive")}
              </option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={filters.tribe}
              onChange={(e) =>
                setFilters({ ...filters, tribe: e.target.value })
              }
              placeholder={t("registrationRequests.filters.tribe")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-waladom-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.id")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.phone")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.tribe")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.location")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.occupation")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("registrationRequests.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRequests.map((request) => (
              <tr
                key={request.id}
                onClick={() => handleRowClick(request)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">{request.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.firstName} {request.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      {
                        "bg-yellow-100 text-yellow-800":
                          request.status === "pending",
                        "bg-green-100 text-green-800":
                          request.status === "approved",
                        "bg-red-100 text-red-800":
                          request.status === "rejected",
                        "bg-green-100 text-black-800":
                          request.status === "active",
                        "bg-orange-100 text-white-800":
                          request.status === "blocked",
                        "bg-purple-100 text-white-800":
                          request.status === "inactive",
                      }
                    )}
                  >
                    {t(`registrationRequests.status.${request.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{request.tribe}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.currentCity}, {request.currentCountry}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request.occupation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setConfirmationAction("approve");
                        setShowConfirmationModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setConfirmationAction("reject");
                        setShowConfirmationModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setConfirmationAction("delete");
                        setShowConfirmationModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          {t("registrationRequests.previous")}
        </button>
        <span className="text-sm text-gray-600">
          {t("registrationRequests.pageOf", { currentPage, totalPages })}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          {t("registrationRequests.next")}
        </button>
      </div>
      {/* Details Modal */}
      {selectedRequest && (
        <DetailsModal
          request={selectedRequest}
          signedPhotos={signedPhotos}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onApprove={() => {
            setShowDetailsModal(false);
            setConfirmationAction("approve");
            setShowConfirmationModal(true);
          }}
          onReject={() => {
            setShowDetailsModal(false);
            setConfirmationAction("reject");
            setShowConfirmationModal(true);
          }}
          onDelete={() => {
            setShowDetailsModal(false);
            setConfirmationAction("delete");
            setShowConfirmationModal(true);
          }}
        />
      )}

      {/* Confirmation Modal */}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setApproverComment(""); // Reset on close
        }}
        onConfirm={
          confirmationAction === "approve"
            ? handleApprove
            : confirmationAction === "reject"
            ? handleReject
            : handelDelete
        }
        title={t(
          confirmationAction === "approve"
            ? "registrationRequests.approveTitle"
            : confirmationAction === "reject"
            ? "registrationRequests.rejectTitle"
            : "registrationRequests.deleteTitle"
        )}
        message={t(
          confirmationAction === "approve"
            ? "registrationRequests.approveMessage"
            : confirmationAction === "reject"
            ? "registrationRequests.rejectMessage"
            : "registrationRequests.deleteMessage"
        )}
        confirmText={t(
          confirmationAction === "approve"
            ? "registrationRequests.approveButton"
            : confirmationAction === "reject"
            ? "registrationRequests.rejectButton"
            : "registrationRequests.deleteButton"
        )}
        type={confirmationAction}
      >
        <textarea
          className="w-full border rounded-lg p-2 mt-4"
          placeholder={t("registrationRequests.enterComment")}
          value={approverComment}
          onChange={(e) => setApproverComment(e.target.value)}
        />
      </ConfirmationModal>
    </div>
  );
};

export default RegistrationRequests;
