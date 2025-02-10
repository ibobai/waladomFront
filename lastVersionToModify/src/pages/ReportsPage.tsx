import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  AlertCircle,
  Loader2,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import CreateReportModal from "../components/Reports/CreateReportModal";
import EditReportModal from "../components/Reports/EditReportModal";

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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});


  const canModifyReports =
    user?.role === "Y" ||
    user?.role === "Z" ||
    user?.role === "X" ||
    user?.role === "A";

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

  const handleDeleteReport = async (reportId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!window.confirm(t("reports.deleteConfirmation"))) return;

    try {
      const response = await fetch(
        `https://www.waladom.club/api/report/delete/${reportId}`,
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

      setReports(reports.filter((report) => report.id !== reportId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report");
    }
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


const toggleExpand = (id: string) => {
  setExpandedRows((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("reports.title")}
              </h2>
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
                  {reports.map((report) => (
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
                            {[t("reports.expand")]}
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
                            {[t("reports.expand")]}
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
                              onClick={() => handleDeleteReport(report.id)}
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
      )}
    </MainLayout>
  );
};

export default ReportsPage;
