import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Plus, Search, Filter, X } from "lucide-react";
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
  connectionMethod: string;
  validated: boolean | null;
  role: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  active: boolean;
}

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
  const [filters, setFilters] = useState({
    search: "",
    tribe: "",
    role: "",
    country: "",
    nationality: "",
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

      console.log("entered the method");

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

    return (
      matchesSearch &&
      matchesTribe &&
      matchesRole &&
      matchesCountry &&
      matchesNationality
    );
  });

  const uniqueValues = {
    tribes: Array.from(new Set(users.map((u) => u.tribe))),
    roles: Array.from(new Set(users.map((u) => u.role.id))),
    countries: Array.from(new Set(users.map((u) => u.currentCountry))),
    nationalities: Array.from(new Set(users.flatMap((u) => u.nationalities))),
  };

  //Role changer

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("userManagement.title")}
        </h2>
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
                {role}
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
              })
            }
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t("userManagement.filters.clearFilters")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "id",
                "name",
                "email",
                "phone",
                "status",
                "tribe",
                "location",
                "birth",
                "personal",
                "mother",
                "role",
                "actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t(`userManagement.table.${header}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {user.active
                      ? t("userManagement.status.active")
                      : t("userManagement.status.inactive")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.tribe}</div>
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
                  <div className="text-sm text-gray-900">{user.birthDate}</div>
                  <div className="text-sm text-gray-500">
                    {user.birthCountry}, {user.birthCity}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.occupation}</div>
                  <div className="text-sm text-gray-500">
                    {user.maritalStatus}, {user.numberOfKids} children
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {user.mothersFirstName} {user.mothersLastName}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      `bg-${user.role.color}-100 text-${user.role.color}-800`
                    )}
                  >
                    {user.role.name}
                    
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            onSave={(userData) => handleUpdateUser(selectedUser.id, userData)}
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
    </div>
  );
};

export default UsersList;
