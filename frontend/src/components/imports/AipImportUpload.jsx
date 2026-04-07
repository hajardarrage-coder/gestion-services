import React, { useState } from 'react';
import axios from 'axios';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const AipImportUpload = ({ type = 'etudiants', onSuccess }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoint = type === 'personnels' ? '/import-personnels' : '/import-etudiants';
  const label = type === 'personnels' ? 'Importer personnels' : 'Importer etudiants';

  const resetStatus = () => setStatus(null);

  const validateFile = (targetFile) => {
    if (!targetFile) {
      return 'Veuillez selectionner un fichier.';
    }
    const extension = targetFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(extension)) {
      return 'Format invalide. Utilisez un fichier CSV ou Excel.';
    }
    if (targetFile.size > MAX_FILE_SIZE) {
      return 'Fichier trop volumineux. Limite: 20 Mo.';
    }
    return null;
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    resetStatus();
  };

  const handleUpload = async () => {
    const validationError = validateFile(file);
    if (validationError) {
      setStatus({ type: 'error', text: validationError });
      return;
    }

    setLoading(true);
    resetStatus();

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const summaryParts = [];
      if (typeof res.data?.inserted === 'number') {
        summaryParts.push(`Insere: ${res.data.inserted}`);
      }
      if (typeof res.data?.duplicates === 'number') {
        summaryParts.push(`Doublons: ${res.data.duplicates}`);
      }
      if (typeof res.data?.skipped === 'number') {
        summaryParts.push(`Ignores: ${res.data.skipped}`);
      }
      const summary = summaryParts.length ? ` (${summaryParts.join(' | ')})` : '';
      setStatus({ type: 'success', text: `${res.data?.message || 'Import reussi.'}${summary}` });
      setFile(null);
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de l\'import.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-minimal space-y-4">
      <div className="text-sm font-bold text-slate-800">{label}</div>
      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileChange}
        className="input-minimal"
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleUpload}
        className="btn-minimal"
        disabled={loading}
      >
        {loading ? 'Importation...' : 'Uploader'}
      </button>
      {status && (
        <div
          className={`text-xs font-bold px-4 py-2 rounded-lg ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-red-50 text-red-600 border border-red-100'
          }`}
        >
          {status.text}
        </div>
      )}
    </div>
  );
};

export default AipImportUpload;
