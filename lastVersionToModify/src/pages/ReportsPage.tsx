import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  AlertCircle,
  Loader2,
  Edit2,
  Trash2,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import CreateReportModal from "../components/Reports/CreateReportModal";
import EditReportModal from "../components/Reports/EditReportModal";
import DeleteConfirmationDialog from "../components/Reports/DeleteConfirmationDialog";
import ViolationsInfo from "../components/Reports/ViolationsInfo";

interface Evidence {
  id: string;
  evidenceType: string;
  fileUrl: string;
  description: string;
  uploadedAt: string;
  reportId: string | null;
}

interface Report {
  id: string;
  userId: string;
  type: string;
  description: string;
  country: string;
  city: string;
  actor: string;
  actorName: string;
  actorDesc: string;
  actorAccount: string;
  victim: string;
  googleMapLink: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  verifierComment: string;
  verified: boolean;
  reportEvidences: Evidence[];
}

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    id: "",
    dateFrom: "",
    dateTo: "",
    type: "",
    actor: "",
    victim: "",
  });

  const canModifyReports =
    user?.role === "A" ||
    user?.role === "X" ||
    user?.role === "Y" ||
    user?.role === "Z";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, Accept, Authorization",
    };
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        "https://www.waladom.club/api/report/get/all",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvidence = (reportId: string) => {
    navigate(`/reports/${reportId}/evidence`);
  };

  const handleEditReport = async (report: Report) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleDeleteClick = (report: Report) => {
    setSelectedReport(report);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch(
        `https://www.waladom.club/api/report/delete/${selectedReport.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          mode: "cors",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setReports(reports.filter((report) => report.id !== selectedReport.id));
      setShowDeleteDialog(false);
      setSelectedReport(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReports = reports.filter((report) => {
    const matchesId =
      !filters.id || report.id.toLowerCase().includes(filters.id.toLowerCase());
    const matchesType =
      !filters.type ||
      report.type.toLowerCase().includes(filters.type.toLowerCase());
    const matchesActor =
      !filters.actor ||
      report.actor.toLowerCase().includes(filters.actor.toLowerCase());
    const matchesVictim =
      !filters.victim ||
      report.victim.toLowerCase().includes(filters.victim.toLowerCase());

    const reportDate = new Date(report.createdAt);
    const matchesDateFrom =
      !filters.dateFrom || reportDate >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || reportDate <= new Date(filters.dateTo);

    return (
      matchesId &&
      matchesType &&
      matchesActor &&
      matchesVictim &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-waladom-green animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ViolationsInfo />

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("reports.title")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("reports.totalCount") } : {filteredReports.length}
                </p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-waladom-green hover:bg-waladom-green-dark"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t("reports.createNew")}
                </button>
              )}
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.reportId")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.id}
                      onChange={(e) =>
                        setFilters({ ...filters, id: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                      placeholder={t("reports.filters.searchById")}
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.startDate")}
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.endDate")}
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.violationType")}
                  </label>
                  <input
                    type="text"
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    placeholder={t("reports.filters.searchByType")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.perpetrator")}
                  </label>
                  <input
                    type="text"
                    value={filters.actor}
                    onChange={(e) =>
                      setFilters({ ...filters, actor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    placeholder={t("reports.filters.searchByPerpetrator")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reports.filters.victim")}
                  </label>
                  <input
                    type="text"
                    value={filters.victim}
                    onChange={(e) =>
                      setFilters({ ...filters, victim: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    placeholder={t("reports.filters.searchByVictim")}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    setFilters({
                      id: "",
                      dateFrom: "",
                      dateTo: "",
                      type: "",
                      actor: "",
                      victim: "",
                    })
                  }
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("reports.filters.clearAll")}
                </button>
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
                      {t("reports.id")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.type")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.description")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.actor")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.actorName")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.actorDesc")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.victim")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.location")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.status")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.date")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("reports.evidence")}
                    </th>
                    {canModifyReports && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("reports.actions")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.type}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-900 cursor-pointer"
                        onClick={() => toggleExpand(report.id)}
                      >
                        <div
                          className={`max-w-md ${
                            expandedRows[report.id]
                              ? "whitespace-normal"
                              : "truncate overflow-hidden whitespace-nowrap"
                          }`}
                        >
                          {report.description}
                        </div>
                        {!expandedRows[report.id] && (
                          <span className="text-waladom-green text-xs ml-2">
                            {t("reports.expand")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.actor}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.actorName}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-900 cursor-pointer"
                        onClick={() => toggleExpand(report.id + "-desc")}
                      >
                        <div
                          className={`max-w-md ${
                            expandedRows[report.id + "-desc"]
                              ? "whitespace-normal"
                              : "truncate overflow-hidden whitespace-nowrap"
                          }`}
                        >
                          {report.actorDesc}
                        </div>
                        {!expandedRows[report.id + "-desc"] && (
                          <span className="text-waladom-green text-xs ml-2">
                            {t("reports.expand")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.victim}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.city}, {report.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                            report.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {report.verified
                            ? t("reports.verified")
                            : report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleViewEvidence(report.id)}
                          className="text-waladom-green hover:text-waladom-green-dark flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          {report.reportEvidences.length}
                        </button>
                      </td>
                      {canModifyReports && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEditReport(report)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(report)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    {t("common.to")}{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredReports.length)}
                    </span>{" "}
                    {t("common.of")}{" "}
                    <span className="font-medium">
                      {filteredReports.length}
                    </span>{" "}
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
          </div>
        </div>
      </div>

      <CreateReportModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchReports();
        }}
      />

      {selectedReport && (
        <>
          <EditReportModal
            report={selectedReport}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedReport(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedReport(null);
              fetchReports();
            }}
          />

          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setSelectedReport(null);
            }}
            onConfirm={handleConfirmDelete}
            reportId={selectedReport.id}
          />
        </>
      )}
    </MainLayout>
  );
};

export default ReportsPage;
