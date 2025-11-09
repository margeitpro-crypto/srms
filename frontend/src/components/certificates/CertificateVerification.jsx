import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import certificateService from '../../services/certificate.service';

const CertificateVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await certificateService.verifyCertificate(verificationCode.trim());
      setVerificationResult(result);
    } catch (err) {
      setError('Failed to verify certificate: ' + (err.response?.data?.message || err.message));
      console.error('Error verifying certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="text-gray-600 mt-1">Verify the authenticity of a certificate using its verification code</p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Enter the verification code found on the certificate to verify its authenticity
              </p>
              <div className="mt-2">
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {verificationResult && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Result</h2>
            
            {verificationResult.isValid ? (
              <div className="space-y-6">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Certificate is Valid</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>This certificate is authentic and was issued by our institution.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Certificate No</label>
                    <p className="mt-1 text-sm text-gray-900">{verificationResult.certificate.certificateNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{verificationResult.certificate.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                    <p className="mt-1 text-sm text-gray-900">{verificationResult.certificate.student.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(verificationResult.certificate.issueDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        verificationResult.certificate.status === 'ISSUED' || verificationResult.certificate.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        verificationResult.certificate.status === 'READY' ? 'bg-blue-100 text-blue-800' :
                        verificationResult.certificate.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        verificationResult.certificate.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {verificationResult.certificate.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Certificate Not Found</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{verificationResult.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">How to Verify a Certificate</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Locate the verification code on the certificate (usually at the bottom)</li>
            <li>Enter the verification code in the field above</li>
            <li>Click "Verify Certificate" to check authenticity</li>
            <li>If valid, you will see the certificate details</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default CertificateVerification;