import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Evidence {
  evidenceType: string;
  fileUrl: string;
  description: string;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [evidenceDescriptions, setEvidenceDescriptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    country: '',
    city: '',
    actor: '',
    actorName: '',
    actorDesc: '',
    actorAccount: '',
    victim: '',
    googleMapLink: ''
  });

  const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setEvidenceDescriptions(prev => [...prev, ...selectedFiles.map(() => '')]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setEvidenceDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setEvidenceDescriptions(prev => {
      const newDesc = [...prev];
      newDesc[index] = description;
      return newDesc;
    });
  };

  const uploadFiles = async (): Promise<Record<string, string>> => {
    if (!files.length) return {};

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`report${index + 1}`, file);
    });

    const response = await fetch('https://www.waladom.club/api/upload/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
      },
      mode: 'cors',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const photoUrls = await uploadFiles();

      const evidenceList: Evidence[] = Object.entries(photoUrls).map(([key, url], index) => ({
        evidenceType: files[index].type.startsWith('image/') ? 'image' : 'document',
        fileUrl: url,
        description: evidenceDescriptions[index]
      }));

      const response = await fetch('https://www.waladom.club/api/report/create', {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.cardId,
          ...formData,
          status: 'not verified',
          verified: false,
          evidenceList
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('reports.createNew')}</h3>
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
              <textarea
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
          </div>

          {/* Evidence Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reports.evidence')}
            </label>
            
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1 p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={evidenceDescriptions[index]}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder={t('reports.evidenceDescription')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-waladom-green focus:border-waladom-green"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-waladom-green">
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">{t('reports.uploadEvidence')}</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </label>
              </div>
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
                  {t('common.submitting')}
                </>
              ) : (
                t('common.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;