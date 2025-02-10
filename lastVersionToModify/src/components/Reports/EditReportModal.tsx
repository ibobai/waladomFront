import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, AlertCircle } from 'lucide-react';

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

interface EditReportModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: report.type,
    description: report.description,
    country: report.country,
    city: report.city,
    actor: report.actor,
    actorName: report.actorName,
    actorDesc: report.actorDesc,
    actorAccount: report.actorAccount,
    victim: report.victim,
    googleMapLink: report.googleMapLink,
    status: report.status,
    verifierComment: report.verifierComment || '',
    verified: report.verified
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`https://www.waladom.club/api/report/update/${report.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('reports.editReport')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.type')}
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.country')}
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.city')}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.googleMapLink')}
              </label>
              <input
                type="url"
                value={formData.googleMapLink}
                onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.actor')}
              </label>
              <input
                type="text"
                value={formData.actor}
                onChange={(e) => setFormData({ ...formData, actor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.actorName')}
              </label>
              <input
                type="text"
                value={formData.actorName}
                onChange={(e) => setFormData({ ...formData, actorName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.actorDesc')}
              </label>
              <input
                type="text"
                value={formData.actorDesc}
                onChange={(e) => setFormData({ ...formData, actorDesc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.actorAccount')}
              </label>
              <input
                type="text"
                value={formData.actorAccount}
                onChange={(e) => setFormData({ ...formData, actorAccount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.victim')}
              </label>
              <input
                type="text"
                value={formData.victim}
                onChange={(e) => setFormData({ ...formData, victim: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
              >
                <option value="not verified">{t('reports.notVerified')}</option>
                <option value="under review">{t('reports.underReview')}</option>
                <option value="verified">{t('reports.verified')}</option>
                <option value="rejected">{t('reports.rejected')}</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reports.verifierComment')}
              </label>
              <textarea
                value={formData.verifierComment}
                onChange={(e) => setFormData({ ...formData, verifierComment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="h-4 w-4 text-waladom-green focus:ring-waladom-green border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">{t('reports.markAsVerified')}</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
               className="px-4 py-2 bg-waladom-green text-white rounded-md hover:bg-waladom-green-dark disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                t('common.save')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;