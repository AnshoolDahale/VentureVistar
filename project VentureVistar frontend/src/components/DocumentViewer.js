import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

const ViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ViewerModal = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ViewerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
`;

const ViewerTitle = styled.h3`
  margin: 0;
  color: #0077b6;
  font-size: 1.2rem;
`;

const ViewerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#0077b6' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  transition: background 0.3s;
  
  &:hover {
    background: ${props => props.primary ? '#005a8b' : '#5a6268'};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ViewerContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ImageViewer = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 8px;
`;

const DocumentInfo = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const DocumentIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #0077b6;
`;

const DocumentViewer = ({ document, isOpen, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && document) {
      if (document.base64Data) {
        try {
          // Extract the base64 data (remove data:type/subtype;base64, prefix)
          const base64Data = document.base64Data.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: document.fileType || 'application/octet-stream' });
          
          // Create a URL for the blob
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setError(null);
        } catch (err) {
          console.error('Error creating blob URL:', err);
          setError('Error loading document');
        }
      } else {
        setError(null);
      }
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
    };
  }, [isOpen, document]);

  const handleDownload = () => {
    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = document.fileName || document.title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (document.url && document.url.startsWith('http')) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenExternal = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else if (document.url && document.url.startsWith('http')) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <DocumentInfo>
          <DocumentIcon>❌</DocumentIcon>
          <p>Error loading document</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
        </DocumentInfo>
      );
    }

    if (!document) return null;

    // If it's an image
    if (document.fileType && document.fileType.includes('image')) {
      return (
        <ImageViewer 
          src={blobUrl || document.url} 
          alt={document.title}
          onError={() => setError('Error loading image')}
        />
      );
    }

    // If it's a PDF
    if (document.fileType && document.fileType.includes('pdf')) {
      return (
        <PDFViewer 
          src={blobUrl || document.url}
          title={document.title}
          onError={() => setError('Error loading PDF')}
        />
      );
    }

    // For other file types, show info and download option
    return (
      <DocumentInfo>
        <DocumentIcon>
          {document.type === 'pitch_deck' ? '📊' :
           document.type === 'term_sheet' ? '📋' :
           document.type === 'nda' ? '🔒' :
           document.type === 'cap_table' ? '📈' :
           document.type === 'financial_statements' ? '💰' :
           document.type === 'business_plan' ? '📋' : '📄'}
        </DocumentIcon>
        <h3>{document.title}</h3>
        <p>{document.type?.replace('_', ' ')?.toUpperCase()}</p>
        {document.fileName && <p><strong>File:</strong> {document.fileName}</p>}
        {document.fileSize && <p><strong>Size:</strong> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>}
        <p style={{ marginTop: '1.5rem', color: '#666' }}>
          This file type cannot be previewed in the browser. Click download to open it with your default application.
        </p>
      </DocumentInfo>
    );
  };

  if (!isOpen) return null;

  return (
    <ViewerOverlay onClick={onClose}>
      <ViewerModal onClick={(e) => e.stopPropagation()}>
        <ViewerHeader>
          <ViewerTitle>{document?.title || 'Document Viewer'}</ViewerTitle>
          <ViewerActions>
            <ActionButton onClick={handleDownload} primary>
              <FaDownload /> Download
            </ActionButton>
            <ActionButton onClick={handleOpenExternal}>
              <FaExternalLinkAlt /> Open in New Tab
            </ActionButton>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </ViewerActions>
        </ViewerHeader>
        <ViewerContent>
          {renderContent()}
        </ViewerContent>
      </ViewerModal>
    </ViewerOverlay>
  );
};

export default DocumentViewer;