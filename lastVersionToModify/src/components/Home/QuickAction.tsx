import React from 'react';
import { Link } from 'react-router-dom';

interface QuickActionProps {
  title: string;
  description: string;
  link: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, link }) => (
  <Link
    to={link}
    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default QuickAction;