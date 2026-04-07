import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, RefreshCcw, Send, Trash2 } from 'lucide-react';
import { secureClient } from '../../api/secureClient';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const EmailCenter = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [logs, setLogs] = useState([]);
  const [logsMeta, setLogsMeta] = useState({ current_page: 1, last_page: 1 });
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchLogs = async (page = 1) => {
    setLogsLoading(true);
    try {
      const response = await secureClient.get('/admin/emails/logs', { params: { page } });
      const data = response.data?.data ? response.data : { data: response.data };
      setLogs(data.data || []);
      setLogsMeta({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
      });
    } catch (error) {
      setFeedback({ type: 'error', text: "Impossible de charger l'historique des emails." });
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSend = async (event) => {
    event.preventDefault();
    const cleanedEmail = to.trim();
    if (!emailRegex.test(cleanedEmail)) {
      setFeedback({ type: 'error', text: 'Entrez une adresse email valide.' });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'Sujet et message sont obligatoires.' });
      return;
    }

    setSending(true);
    setFeedback({ type: '', text: '' });
    try {
      const response = await secureClient.post('/send-email', {
        to: cleanedEmail,
        subject: subject.trim(),
        message: message.trim(),
      });
      const successText = response?.data?.message || 'Email envoyé avec succès.';
      setFeedback({ type: 'success', text: successText });
      setTo('');
      setSubject('');
      setMessage('');
      fetchLogs(1);
    } catch (error) {
      const text =
        error?.response?.data?.message ||
        error?.friendlyMessage ||
        error?.response?.data?.error ||
        "Impossible d'envoyer l'email pour le moment.";
      setFeedback({ type: 'error', text });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      return;
    }

    try {
      await secureClient.delete(`/admin/emails/logs/${id}`);
      setFeedback({ type: 'success', text: 'Log email supprimé avec succès.' });
      fetchLogs(logsMeta.current_page);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: "Impossible de supprimer l'email.",
      });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer TOUT l'historique des emails ? Cette action est irréversible.")) {
      return;
    }

    try {
      await secureClient.delete('/admin/emails/logs');
      setFeedback({ type: 'success', text: 'Historique vidé avec succès.' });
      fetchLogs(1);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: "Impossible de vider l'historique.",
      });
    }
  };

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  );

  const logColumns = [
    {
      key: 'date',
      title: 'Date',
      render: (log) => (log.created_at ? dateFormatter.format(new Date(log.created_at)) : '-'),
    },
    {
      key: 'recipient',
      title: 'Destinataire',
      render: (log) => (log.recipients || []).join(', '),
    },
    {
      key: 'subject',
      title: 'Sujet',
      render: (log) => (
        <span className="font-semibold text-slate-900">
          {log.subject || 'Sans objet'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Statut',
      render: (log) => {
        const success = log.status === 'sent';
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${
                success
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border-rose-100 bg-rose-50 text-rose-700'
              }`}
            >
              {success ? 'Envoyé' : 'Échec'}
            </span>
            {!success && log.error_message && (
              <p className="text-[11px] text-rose-500">{log.error_message}</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'sender',
      title: 'Par',
      render: (log) => log.sender?.name || log.sender?.email || 'Admin',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (log) => (
        <button
          type="button"
          onClick={() => handleDelete(log.id)}
          className="rounded-xl border border-transparent bg-slate-50 p-2 text-slate-500 transition hover:border-rose-100 hover:text-rose-600 hover:bg-rose-50"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="page-shell space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Communication</p>
          <h1 className="text-3xl font-black uppercase tracking-[0.25em] text-slate-900 flex items-center gap-3">
            <Mail size={24} />
            Emails
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Composez et suivez vos emails sortants avec un historique sécurisé.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => fetchLogs(logsMeta.current_page)} disabled={logsLoading}>
            <RefreshCcw size={14} className={logsLoading ? 'animate-spin' : ''} />
            Actualiser
          </Button>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
            Page {logsMeta.current_page} / {Math.max(1, logsMeta.last_page || 1)}
          </span>
        </div>
      </header>

      {feedback.text && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            feedback.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-rose-100 bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Composer un email" subtitle="SMTP Gmail sécurisé">
          <form onSubmit={handleSend} className="space-y-4">
            <Input
              label="À"
              type="email"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="ex: etudiant@gmail.com"
              required
              helperText="Le destinataire reçoit le message depuis le compte Gmail sécurisé."
            />
            <Input
              label="Sujet"
              value={subject}
              onChange={(event) => setSubject(event.target.value.slice(0, 150))}
              placeholder="Objet du message"
              required
            />
            <Input
              as="textarea"
              label="Message"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 5000))}
              placeholder="Rédigez votre message. Le HTML simple est autorisé."
              required
              className="gap-1"
              rows={6}
              style={{ minHeight: '180px' }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setTo('');
                  setSubject('');
                  setMessage('');
                  setFeedback({ type: '', text: '' });
                }}
                disabled={sending}
              >
                Effacer
              </Button>
              <Button variant="primary" type="submit" disabled={sending}>
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Envoi...' : 'Envoyer'}
              </Button>
              <p className="text-[11px] text-slate-500">
                Envoi sécurisé via TLS (port 587) avec mot de passe applicatif Gmail.
              </p>
            </div>
          </form>
        </Card>

        <Card title="Historique des emails" subtitle="Logs SMTP">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
              Historique
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" onClick={handleClearAll} disabled={logs.length === 0 || logsLoading}>
                Tout supprimer
              </Button>
              <Button variant="ghost" onClick={() => fetchLogs(logsMeta.current_page)} disabled={logsLoading}>
                <RefreshCcw size={14} className={logsLoading ? 'animate-spin' : ''} />
                Recharger
              </Button>
            </div>
          </div>

          {logsLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-slate-500">
              <Loader2 className="mx-auto mb-3 animate-spin text-slate-500" size={24} />
              <p className="text-xs font-black uppercase tracking-[0.3em]">Chargement...</p>
            </div>
          ) : (
            <Table
              columns={logColumns}
              data={logs}
              emptyText="Aucun email envoyé pour le moment."
              pagination={{
                currentPage: logsMeta.current_page,
                totalPages: Math.max(1, logsMeta.last_page || 1),
                onPrevious: () => fetchLogs(Math.max(1, logsMeta.current_page - 1)),
                onNext: () => fetchLogs(Math.min(logsMeta.last_page, logsMeta.current_page + 1)),
                isLocked: logsLoading,
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmailCenter;
