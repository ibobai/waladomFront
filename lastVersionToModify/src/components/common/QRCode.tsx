import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 128 }) => {
  // Using a real QR code generation service
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
      alt="QR Code"
      className="rounded-lg"
      width={size}
      height={size}
    />
  );
};

export default QRCode;