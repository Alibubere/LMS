import React, { useRef } from 'react';
import { Button } from 'antd';
import {
  TrophyOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { formatDate } from '../utils/formatters';
import { Badge } from './ui';

export const CertificateCard = ({ certificate }) => {
  const printRef = useRef(null);

  if (!certificate) return null;

  const { certificateCode, userName, courseTitle, issueDate, grade } = certificate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Printable certificate canvas */}
      <div ref={printRef} className="border border-ink bg-canvas p-2 print:m-0">
        <div className="relative overflow-hidden border border-hairline px-6 py-10 text-center sm:px-12 sm:py-14">
          {/* Background watermark */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-hairline"
            aria-hidden="true"
          >
            <TrophyOutlined style={{ fontSize: '280px' }} />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-center gap-2 text-ink">
              <SafetyCertificateOutlined />
              <span className="text-mono-eyebrow uppercase">
                Official Certificate of Completion
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-display-lg text-ink">Learning Management System</h2>
              <p className="text-mono-eyebrow uppercase text-body">Verified credential</p>
            </div>

            <div className="space-y-3">
              <p className="text-mono-eyebrow uppercase text-body">This acknowledges that</p>
              <h3 className="mx-auto inline-block border-b border-ink px-6 pb-2 text-display-xl text-ink">
                {userName || 'Enrolled Learner'}
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-caption text-body">
                has successfully completed the curriculum requirements for
              </p>
              <h4 className="text-display-md text-ink">{courseTitle}</h4>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-hairline pt-6 text-center sm:flex-row sm:text-left">
              <div className="sm:text-left">
                <span className="block text-mono-eyebrow uppercase text-body">Issue date</span>
                <strong className="text-body-md-strong text-ink">{formatDate(issueDate)}</strong>
              </div>

              {grade && (
                <div className="text-center">
                  <span className="mb-2 block text-mono-eyebrow uppercase text-body">
                    Grade / Performance
                  </span>
                  <Badge variant="neutral">{grade}</Badge>
                </div>
              )}

              <div className="sm:text-right">
                <span className="block text-mono-eyebrow uppercase text-body">Credential ID</span>
                <code className="bg-canvas px-2 py-1 font-mono text-mono-label text-ink ring-1 ring-hairline">
                  {certificateCode}
                </code>
              </div>
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
        >
          Print or Save PDF
        </Button>
      </div>
    </div>
  );
};

export default CertificateCard;
