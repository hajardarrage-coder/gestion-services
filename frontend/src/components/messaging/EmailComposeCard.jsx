import { useState } from 'react';
import { secureClient } from '../../api/secureClient';
import { Mail, Paperclip, Send, ShieldCheck, AlertCircle } from 'lucide-react';

const RECIPIENTS = [
  { value: 'president', label: 'Président', hint: 'Remontez une information stratégique.' },
  { value: 'service', label: 'Service concerné', hint: 'Support opérationnel ou questions métiers.' },
];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || '';
      const base64 = String(result).split(',').pop();
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const EmailComposeCard = () => {
  const [recipient, setRecipient] = useState('president');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    const oversize = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversize) {
      setError(`"${oversize.name}" dépasse 2MB.`);
      event.target.value = '';
      return;
    }
    setError('');
    const mapped = [];
    for (const file of files) {
      const content = await toBase64(file);
      mapped.push({
        filename: file.name,
        mimetype: file.type,
        content,
      });
    }
    setAttachments(mapped);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await secureClient.post('/send-email', {
        recipient,
        subject,
        body,
        attachments,
      });
      setSuccess('Message envoyé avec succès.');
      setSubject('');
      setBody('');
      setAttachments([]);
    } catch (err) {
      setError(err?.friendlyMessage || err?.response?.data?.message || "Impossible d'envoyer le message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-minimal p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Communication</p>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Mail size={18} />
            Envoyer un email
          </h3>
        </div>
        <ShieldCheck className="text-emerald-500" size={18} />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-lg px-3 py-2 mb-3">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-2 mb-3">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Destinataire</label>
            <div className="flex gap-2">
              {RECIPIENTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRecipient(item.value)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-left transition ${
                    recipient === item.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-[11px] text-slate-500">{item.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value.slice(0, 140))}
              placeholder="Objet du message"
              className="input-minimal"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 4000))}
            className="input-minimal min-h-[140px]"
            placeholder="Décrivez votre besoin..."
            required
          />
          <p className="text-[11px] text-slate-400">Pas de tracking. Les envois sont limités pour éviter le spam.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
            <Paperclip size={14} />
            <span>Ajouter des pièces jointes (max 3 × 2MB)</span>
            <input type="file" multiple className="hidden" onChange={handleFiles} />
          </label>
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file) => (
                <span
                  key={file.filename}
                  className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold"
                >
                  {file.filename}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-minimal inline-flex items-center gap-2"
        >
          <Send size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setSubject('');
            setBody('');
            setAttachments([]);
            setError('');
            setSuccess('');
          }}
          className="btn-ghost"
        >
          Effacer
        </button>
      </form>
    </div>
  );
};

export default EmailComposeCard;
