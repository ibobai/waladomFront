import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Upload,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import UserDetailsModal from "./UserDetailsModal";
import EditUserModal from "./EditUserModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import AddUserModal from "./AddUserModal";
import { cn } from "../../utils/cn";

interface ApiUser {
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
  occupation: string;
  sex: string;
  mothersFirstName: string;
  mothersLastName: string;
  nationalities: string[];
  comments?: string;
  updatedAt: string;
  createdAt: string;
  isActive: boolean;
  connectionMethod: string;
  validated: boolean | null;
  role: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  active: boolean;
  idProofPhotos?: {
    id: string;
    photoUrl: string;
    type: string;
  }[];
  waladomCardPhoto?: {
    id: string;
    photoUrl: string;
  };
}

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}
const user = JSON.parse(localStorage.getItem("user") || "{}"); // Parse the stored user object

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://www.waladom.club/api/user/validate/password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            password: password,
            id: user.cardId, // ✅ Use the correct user ID
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(t("userManagement.invalidPassword"));
      }

      onConfirm(password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.passwordValidationError")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          {t("userManagement.validatePassword")}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            placeholder={t("userManagement.enterPassword")}
            required
          />

          <div className="flex justify-end gap-3">
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
              {t("common.validate")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    newRole: string;
  } | null>(null);
  const { user: currentUser } = useAuth();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    search: "",
    tribe: "",
    role: "",
    country: "",
    nationality: "",
    status: "", // NEW
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://www.waladom.club/api/user/get/all",
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(t("userManagement.errors.fetchFailed"));
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.fetchFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    userId: string,
    userData: Partial<ApiUser>
  ) => {
    try {
      const response = await fetch(
        `https://www.waladom.club/api/user/update/${userId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(t("userManagement.errors.updateFailed"));
      }

      await fetchUsers();
      setShowEditModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.updateFailed")
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `https://www.waladom.club/api/user/delete/${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(t("userManagement.errors.deleteFailed"));
      }

      await fetchUsers();
      setShowDeleteModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.deleteFailed")
      );
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const isActive = newStatus === "active"; // Set isActive based on status

      await handleUpdateUser(userId, { status: newStatus, isActive });

      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.statusUpdateFailed")
      );
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setPendingRoleChange({ userId, newRole });
    setShowRoleChangeModal(true);
  };

  const handleRoleChangeConfirm = async (password: string) => {
    if (!pendingRoleChange) return;

    try {
      await handleUpdateUser(pendingRoleChange.userId, {
        role: pendingRoleChange.newRole, // ✅ Send role as a string, NOT an object
      });

      setShowRoleChangeModal(false);
      setPendingRoleChange(null);
      fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("userManagement.errors.roleUpdateFailed")
      );
    }
  };

  const canModifyRole = (role: string) => {
    if (currentUser?.role === "A") return true;
    if (currentUser?.role === "X" && role !== "ROLE_ADMIN") return true;
    return false;
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchLower);

    const matchesTribe =
      !filters.tribe ||
      user.tribe.toLowerCase().includes(filters.tribe.toLowerCase());
    const matchesRole = !filters.role || user.role.id === filters.role;
    const matchesCountry =
      !filters.country ||
      user.currentCountry.toLowerCase().includes(filters.country.toLowerCase());
    const matchesNationality =
      !filters.nationality ||
      user.nationalities.some((n) =>
        n.toLowerCase().includes(filters.nationality.toLowerCase())
      );

    const matchesStatus = !filters.status || user.status === filters.status;

    return (
      matchesSearch &&
      matchesTribe &&
      matchesRole &&
      matchesCountry &&
      matchesNationality &&
      matchesStatus
    );
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const uniqueValues = {
    tribes: Array.from(new Set(users.map((u) => u.tribe))),
    roles: Array.from(new Set(users.map((u) => u.role.id))),
    countries: Array.from(new Set(users.map((u) => u.currentCountry))),
    nationalities: Array.from(new Set(users.flatMap((u) => u.nationalities))),
    statuses: Array.from(new Set(users.map((u) => u.status))), // NEW
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-waladom-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t("userManagement.title")}
        </h2>
        <p className="text-gray-600">
          {t("userManagement.totaltext", { total: filteredUsers.length })}
        </p>
      </div>
      <button
        onClick={() => setShowAddModal(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark"
      >
        <Plus className="w-5 h-5 mr-2" />
        {t("userManagement.actions.add")}
      </button>
    </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder={t("userManagement.filters.search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-waladom-green focus:border-waladom-green"
              />
            </div>
          </div>

          <select
            value={filters.tribe}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, tribe: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-waladom-green focus:border-waladom-green"
          >
            <option value="">{t("userManagement.filters.tribe")}</option>
            {uniqueValues.tribes.map((tribe) => (
              <option key={tribe} value={tribe}>
                {tribe}
              </option>
            ))}
          </select>

          <select
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-waladom-green focus:border-waladom-green"
          >
            <option value="">{t("userManagement.filters.role")}</option>
            {uniqueValues.roles.map((role) => (
              <option key={role} value={role}>
                {t(`userManagement.roles.${role.toLowerCase()}`)}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-waladom-green focus:border-waladom-green"
          >
            <option value="">{t("userManagement.filters.status")}</option>
            {uniqueValues.statuses.map((status) => (
              <option key={status} value={status}>
                {t(`userManagement.status.${status}`)}
              </option>
            ))}
          </select>

          <select
            value={filters.country}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, country: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-waladom-green focus:border-waladom-green"
          >
            <option value="">{t("userManagement.filters.country")}</option>
            {uniqueValues.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={filters.nationality}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, nationality: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-waladom-green focus:border-waladom-green"
          >
            <option value="">{t("userManagement.filters.nationality")}</option>
            {uniqueValues.nationalities.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setFilters({
                search: "",
                tribe: "",
                role: "",
                country: "",
                nationality: "",
                status: "", // NEW
              })
            }
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t("userManagement.filters.clearFilters")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full lg:w-[90vw] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.email")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.phone")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.tribe")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.location")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.birth")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.personal")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.mother")}
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t("userManagement.table.role")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("userManagement.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      disabled={!canModifyRole(user.role.id)}
                      className={cn(
                        "text-sm border rounded-md focus:ring-waladom-green focus:border-waladom-green px-3 py-2",
                        {
                          "border-green-500 text-green-600 bg-green-100":
                            user.status === "active",
                          "border-gray-500 text-gray-600 bg-gray-100":
                            user.status === "inactive",
                          "border-yellow-500 text-yellow-600 bg-yellow-100":
                            user.status === "banned",
                          "border-red-500 text-red-600 bg-red-100":
                            user.status === "blocked",
                        }
                      )}
                    >
                      <option value="active" className="text-green-600">
                        {t("userManagement.status.active")}
                      </option>
                      <option value="inactive" className="text-gray-600">
                        {t("userManagement.status.inactive")}
                      </option>
                      <option value="banned" className="text-yellow-600">
                        {t("userManagement.status.banned")}
                      </option>
                      <option value="blocked" className="text-red-600">
                        {t("userManagement.status.blocked")}
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.tribe}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.currentCountry}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.currentCity}, {user.currentVillage}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.birthDate}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.birthCountry}, {user.birthCity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.occupation}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.maritalStatus}, {user.numberOfKids} children
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.mothersFirstName} {user.mothersLastName}
                    </div>
                  </td>

                  {/* Roles Column - Narrower */}
                  <td className="px-3 py-4 whitespace-nowrap w-24">
                    <select
                      value={user.role.id}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      disabled={!canModifyRole(user.role.id)}
                      className={cn(
                        "text-sm border rounded-md focus:ring-waladom-green focus:border-waladom-green px-3 py-2",
                        {
                          "border-black text-white bg-gray-700":
                            user.role.id === "ROLE_ADMIN",
                          "border-green-500 text-green-600 bg-green-100":
                            user.role.id === "ROLE_CONTENT_MANAGER",
                          "border-yellow-500 text-yellow-600 bg-yellow-100":
                            user.role.id === "ROLE_MODERATOR",
                          "border-gray-500 text-gray-600 bg-gray-300":
                            user.role.id === "ROLE_MEMBERSHIP_REVIEWER",
                          "border-red-500 text-red-600 bg-red-100":
                            user.role.id === "ROLE_USER",
                        }
                      )}
                    >
                      <option value="ROLE_USER" className="text-red-600">
                        {t("userManagement.roles.user")}
                      </option>
                      <option
                        value="ROLE_MEMBERSHIP_REVIEWER"
                        className="text-gray-600"
                      >
                        {t("userManagement.roles.reviewer")}
                      </option>
                      <option
                        value="ROLE_MODERATOR"
                        className="text-yellow-600"
                      >
                        {t("userManagement.roles.moderator")}
                      </option>
                      <option
                        value="ROLE_CONTENT_MANAGER"
                        className="text-green-600"
                      >
                        {t("userManagement.roles.contentManager")}
                      </option>
                      {currentUser?.role === "A" && (
                        <option value="ROLE_ADMIN" className="text-black">
                          {t("userManagement.roles.admin")}
                        </option>
                      )}
                    </select>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="text-waladom-green hover:text-waladom-green-dark"
                      >
                        {t("userManagement.actions.view")}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {t("common.previous")}
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {t("common.next")}
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t("common.showing")}{" "}
              <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
              {t("common.to")}{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              {t("common.of")}{" "}
              <span className="font-medium">{filteredUsers.length}</span>{" "}
              {t("common.results")}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={cn(
                      "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                      currentPage === number
                        ? "z-10 bg-waladom-green border-waladom-green text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {number}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UserDetailsModal
            user={selectedUser}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedUser(null);
            }}
          />
          <EditUserModal
            user={selectedUser}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
          />
          <DeleteConfirmationModal
            user={selectedUser}
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            onConfirm={() => handleDeleteUser(selectedUser.id)}
          />
        </>
      )}

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <RoleChangeModal
        isOpen={showRoleChangeModal}
        onClose={() => {
          setShowRoleChangeModal(false);
          setPendingRoleChange(null);
        }}
        onConfirm={handleRoleChangeConfirm}
      />
    </div>
  );
};

export default UsersList;
