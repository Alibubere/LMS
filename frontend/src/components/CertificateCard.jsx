import React, { useRef } from 'react';
import { Card, Tag, Button } from 'antd';
import {
  TrophyOutlined,
  PrinterOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { formatDate } from '../utils/formatters';

export const CertificateCard = ({ certificate }) => {
  const printRef = useRef(null);

  if (!certificate) return null;

  const {
    certificateCode,
    userName,
    courseTitle,
    issueDate,
    grade,
  } = certificate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Certificate Canvas */}
      <div
        ref={printRef}
        className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-300 shadow-xl max-w-3xl mx-auto text-center overflow-hidden print:m-0 print:border-4"
      >
        {/* Background watermark icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <TrophyOutlined style={{ fontSize: '320px' }} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <SafetyCertificateOutlined className="text-3xl" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Official Certificate of Completion
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-gray-900">
              Learning Management System
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Verified Credential
            </p>
          </div>

          <div className="py-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">This acknowledges that</p>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 mt-1 border-b-2 border-amber-200 inline-block px-8 pb-1">
              {userName || 'Enrolled Learner'}
            </h3>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-500">has successfully completed the curriculum requirements for</p>
            <h4 className="text-xl sm:text-2xl font-bold text-blue-900">
              {courseTitle}
            </h4>
          </div>

          <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div className="text-left">
              <span className="block text-gray-400">Issue Date</span>
              <strong className="text-gray-800">{formatDate(issueDate)}</strong>
            </div>

            {grade && (
              <div className="text-center">
                <span className="block text-gray-400">Grade / Performance</span>
                <Tag color="gold" className="font-bold text-sm">
                  {grade}
                </Tag>
              </div>
            )}

            <div className="text-right">
              <span className="block text-gray-400">Credential ID</span>
              <code className="font-mono text-gray-700 bg-amber-100/60 px-2 py-0.5 rounded text-[11px]">
                {certificateCode}
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center print:hidden">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          size="large"
          onClick={handlePrint}
          className="bg-amber-600 hover:bg-amber-700 font-semibold"
        >
          Print or Save PDF
        </Button>
      </div>
    </div>
  );
};

export default CertificateCard;
