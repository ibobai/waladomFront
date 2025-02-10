import React from 'react';
import { Download, Share2, Printer, Loader2, AlertCircle } from 'lucide-react';
import IdCardLayout from './IdCardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useIdCardActions } from './hooks/useIdCardActions';
import { cn } from '../../utils/cn';

const IdCardContainer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const {
    isDownloading,
    error,
    handleDownload,
    handleShare,
    handlePrint
  } = useIdCardActions(user);

  return (
    <div className="space-y-6">
      <IdCardLayout user={user} />
      
      {error && (
        <div className="flex items-center justify-center text-red-600 bg-red-50 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex justify-center space-x-4">
        <ActionButton
          onClick={handleDownload}
          disabled={isDownloading}
          icon={isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          label={isDownloading ? t('idCard.downloading') : t('idCard.download')}
          primary
        />
        
        <ActionButton
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
          label={t('idCard.print')}
        />
        
        <ActionButton
          onClick={handleShare}
          icon={<Share2 className="w-4 h-4" />}
          label={t('idCard.share')}
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  primary?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, disabled, primary }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
      primary ? "bg-waladom-green text-white hover:bg-waladom-green-dark" : "border border-waladom-green text-waladom-green hover:bg-waladom-green hover:text-white",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default IdCardContainer;