import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadCard } from '../../../utils/downloadCard';
import { User } from '../../../types/user';

export const useIdCardActions = (user: User) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);
      await downloadCard('waladom-id-card', `waladom-id-${user.cardId}.png`);
    } catch (err) {
      setError(t('idCard.downloadError'));
      console.error('Failed to download card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setError(null);
      if (navigator.share) {
        await navigator.share({
          title: 'Waladom ID Card',
          text: `${user.name}'s Waladom ID Card`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      setError(t('idCard.shareError'));
      console.error('Error sharing:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    isDownloading,
    error,
    handleDownload,
    handleShare,
    handlePrint
  };
};