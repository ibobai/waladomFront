import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, Image, Loader2, AlertCircle, ExternalLink, Video, X, ChevronDown, ChevronUp } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { cn } from '../utils/cn';

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
  description: string;
  actorDesc: string;
  reportEvidences: Evidence[];
}

interface ExpandableTextProps {
  text: string;
  title: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const truncatedText = text.slice(0, 150) + (text.length > 150 ? '...' : '');

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-left w-full"
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            {isExpanded ? text : truncatedText}
          </p>
        </div>
        {text.length > 150 && (
          <div className="ml-2 text-gray-500">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        )}
      </button>
    </div>
  );
};

interface MediaViewerProps {
  evidence: Evidence;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ evidence, onClose }) => {
  const isVideo = evidence.fileUrl.toLowerCase().match(/\.(mp4|mov)$/);
  const isImage = evidence.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
  const isDocument = !isVideo && !isImage;

  if (isDocument) {
    window.open(evidence.fileUrl, '_blank');
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="max-w-7xl w-full max-h-[90vh] p-4">
        {isVideo ? (
          <video 
            controls 
            autoPlay
            className="max-w-full max-h-[80vh] mx-auto"
          >
            <source src={evidence.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={evidence.fileUrl}
            alt={evidence.description}
            className="max-w-full max-h-[80vh] mx-auto object-contain"
          />
        )}
        
        <div className="mt-4 text-white">
          <p className="text-sm opacity-80">{evidence.description}</p>
          <p className="text-xs opacity-60 mt-1">
            {new Date(evidence.uploadedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReportEvidencePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const getFileType = (url: string) => {
    if (url.toLowerCase().match(/\.(mp4|mov)$/)) return 'video';
    if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError('No report ID provided');
        setLoading(false);
        return;
      }

      try {
        // Remove auth headers for public access
        const response = await fetch(`https://www.waladom.club/api/report/evidence/get/report/${id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report evidence');
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          setReport({
            id: id,
            description: '',
            actorDesc: '',
            reportEvidences: []
          });
          return;
        }

        setReport({
          id: id,
          description: data[0]?.description || '',
          actorDesc: data[0]?.actorDesc || '',
          reportEvidences: data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report evidence');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-waladom-green animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/reports')}
              className="mb-6 inline-flex items-center text-gray-600 hover:text-waladom-green"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('reports.backToReports')}
            </button>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Report not found</h2>
            <button
              onClick={() => navigate('/reports')}
              className="inline-flex items-center text-waladom-green hover:text-waladom-green-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('reports.backToReports')}
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/reports')}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-waladom-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('reports.backToReports')}
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('reports.evidenceTitle')}
              </h2>
            </div>

            <div className="p-6">
              {/* Descriptions */}
              <div className="mb-8 space-y-4">
                <ExpandableText 
                  title={t('reports.reportDescription')} 
                  text={report.description} 
                />
                <ExpandableText 
                  title={t('reports.actorDescription')} 
                  text={report.actorDesc} 
                />
              </div>

              {/* Evidence Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {report.reportEvidences.map((evidence) => {
                  const fileType = getFileType(evidence.fileUrl);
                  const icon = getFileIcon(fileType);
                  
                  return (
                    <div
                      key={evidence.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-700">
                            {icon}
                            <span className="ml-2 text-sm font-medium capitalize">
                              {fileType}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(evidence.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Preview */}
                        <button
                          onClick={() => setSelectedEvidence(evidence)}
                          className="w-full mb-4 relative group"
                        >
                          {fileType === 'video' && (
                            <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                              <video 
                                className="w-full h-full object-cover"
                                preload="metadata"
                              >
                                <source src={`${evidence.fileUrl}#t=0.1`} type="video/mp4" />
                              </video>
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                                <Video className="w-12 h-12 text-white group-hover:text-waladom-green transition-colors" />
                              </div>
                            </div>
                          )}
                          {fileType === 'image' && (
                            <img
                              src={evidence.fileUrl}
                              alt={evidence.description}
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                          )}
                          {fileType === 'document' && (
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-12 h-12 text-gray-400 group-hover:text-waladom-green transition-colors" />
                            </div>
                          )}
                        </button>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-2">
                          {evidence.description}
                        </p>

                        {/* Actions */}
                        <div className="flex justify-end">
                          <a
                            href={evidence.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-waladom-green hover:text-waladom-green-dark"
                          >
                            {t('reports.openInNewTab')}
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(!report.reportEvidences || report.reportEvidences.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  {t('reports.noEvidence')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedEvidence && (
        <MediaViewer 
          evidence={selectedEvidence} 
          onClose={() => setSelectedEvidence(null)} 
        />
      )}
    </MainLayout>
  );
};

export default ReportEvidencePage;