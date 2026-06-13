import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { categories } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import {
  deleteContentItem,
  listAdminContent,
  saveContentItem,
  saveSettings,
} from '../services/contentService';
import { useSiteContent } from '../context/SiteContentContext';

const emptyItem = {
  title: '',
  titleTr: '',
  description: '',
  descriptionTr: '',
  category: 'mobile',
  tag: 'Mobile Game',
  tagTr: 'Mobil Oyun',
  status: 'coming-soon',
  image: '',
  gameUrl: '',
  sortOrder: 0,
  isVisible: true,
};

const tableByTab = {
  games: 'site_games',
  projects: 'site_projects',
};

const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));

const fieldClass = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400';
const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400';

const AdminLogin = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsBusy(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsBusy(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    onLoggedIn(data.session);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6">
          <p className="text-sm text-cyan-300">Noctavian Studio</p>
          <h1 className="mt-1 text-2xl font-bold">Admin Panel</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={fieldClass}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              className={fieldClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            type="submit"
            disabled={isBusy}
          >
            <Save size={18} />
            {isBusy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
};

const ContentForm = ({ activeTab, item, onCancel, onSaved }) => {
  const [form, setForm] = useState(item || emptyItem);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(item || emptyItem);
  }, [item]);

  const setValue = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'category') {
        const category = categoryById[value] || categoryById.mobile;
        next.tag = category.label;
        next.tagTr = category.labelTr;
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await saveContentItem(tableByTab[activeTab], form);
      onSaved();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{form.id ? 'Edit item' : 'New item'}</h2>
        <button type="button" onClick={onCancel} className="text-sm text-slate-400 hover:text-white">
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Title EN</label>
          <input className={fieldClass} value={form.title} onChange={(event) => setValue('title', event.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Title TR</label>
          <input className={fieldClass} value={form.titleTr} onChange={(event) => setValue('titleTr', event.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={fieldClass} value={form.category} onChange={(event) => setValue('category', event.target.value)}>
            {categories.filter((category) => category.id !== 'all').map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={fieldClass} value={form.status} onChange={(event) => setValue('status', event.target.value)}>
            <option value="active">Active</option>
            <option value="coming-soon">Coming soon</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Image URL</label>
          <input className={fieldClass} value={form.image} onChange={(event) => setValue('image', event.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Game URL</label>
          <input className={fieldClass} value={form.gameUrl || ''} onChange={(event) => setValue('gameUrl', event.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input className={fieldClass} type="number" value={form.sortOrder} onChange={(event) => setValue('sortOrder', event.target.value)} />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(form.isVisible)}
            onChange={(event) => setValue('isVisible', event.target.checked)}
          />
          Visible on site
        </label>
      </div>

      <div>
        <label className={labelClass}>Description EN</label>
        <textarea className={fieldClass} rows={4} value={form.description} onChange={(event) => setValue('description', event.target.value)} required />
      </div>
      <div>
        <label className={labelClass}>Description TR</label>
        <textarea className={fieldClass} rows={4} value={form.descriptionTr} onChange={(event) => setValue('descriptionTr', event.target.value)} required />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <button
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
        disabled={isSaving}
      >
        <Save size={18} />
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

const SettingsForm = ({ settings, onSaved }) => {
  const [form, setForm] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setSocial = (key, value) => setForm((current) => ({
    ...current,
    social: { ...current.social, [key]: value },
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    await saveSettings(form);
    setIsSaving(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold">Contact settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input className={fieldClass} value={form.email || ''} onChange={(event) => setValue('email', event.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={fieldClass} value={form.phone || ''} onChange={(event) => setValue('phone', event.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input className={fieldClass} value={form.social?.instagram || ''} onChange={(event) => setSocial('instagram', event.target.value)} />
        </div>
        <div>
          <label className={labelClass}>X / Twitter</label>
          <input className={fieldClass} value={form.social?.twitter || ''} onChange={(event) => setSocial('twitter', event.target.value)} />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input className={fieldClass} value={form.social?.linkedin || ''} onChange={(event) => setSocial('linkedin', event.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Address EN</label>
        <input className={fieldClass} value={form.address || ''} onChange={(event) => setValue('address', event.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Address TR</label>
        <input className={fieldClass} value={form.addressTr || ''} onChange={(event) => setValue('addressTr', event.target.value)} />
      </div>
      <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
        <Save size={18} />
        {isSaving ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
};

const AdminPage = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');
  const [content, setContent] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const { refreshContent } = useSiteContent();

  const activeItems = useMemo(() => {
    if (!content) return [];
    return activeTab === 'games' ? content.games : content.collaborativeProjects;
  }, [activeTab, content]);

  const loadAdminData = useCallback(async () => {
    setError('');
    const adminContent = await listAdminContent();
    setContent(adminContent);
    setEditingItem(null);
    await refreshContent();
  }, [refreshContent]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    loadAdminData().catch((loadError) => setError(loadError.message));
  }, [loadAdminData, session]);

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Delete ${item.title}?`);
    if (!confirmed) return;

    await deleteContentItem(tableByTab[activeTab], item.id);
    await loadAdminData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setContent(null);
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
          <h1 className="text-2xl font-bold">Supabase is not configured</h1>
          <p className="mt-3 text-amber-100">
            Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in Vercel to enable the admin panel.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <main className="min-h-screen bg-slate-950 p-8 text-white">Loading admin...</main>;
  }

  if (!session) {
    return <AdminLogin onLoggedIn={setSession} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-cyan-300">Noctavian Studio</p>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadAdminData} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ['games', 'Games'],
            ['projects', 'Collaborative Projects'],
            ['settings', 'Contact Settings'],
            ['messages', 'Messages'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setEditingItem(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!content ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">Loading content...</div>
        ) : (
          <>
            {(activeTab === 'games' || activeTab === 'projects') && (
              <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                <section className="rounded-xl border border-slate-800 bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-800 p-4">
                    <h2 className="text-lg font-semibold">{activeTab === 'games' ? 'Games' : 'Collaborative Projects'}</h2>
                    <button
                      onClick={() => setEditingItem({ ...emptyItem, sortOrder: activeItems.length + 1 })}
                      className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                      <Plus size={16} />
                      New
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800">
                    {activeItems.map((item) => (
                      <div key={item.id} className="grid gap-4 p-4 md:grid-cols-[88px_1fr_auto] md:items-center">
                        <img src={item.image} alt={item.title} className="h-20 w-20 rounded-lg object-cover" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.category}</span>
                            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.status}</span>
                            {item.isVisible ? <Eye size={16} className="text-emerald-300" /> : <EyeOff size={16} className="text-slate-500" />}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingItem(item)} className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(item)} className="rounded-lg border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {editingItem && (
                  <ContentForm
                    activeTab={activeTab}
                    item={editingItem}
                    onCancel={() => setEditingItem(null)}
                    onSaved={loadAdminData}
                  />
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsForm settings={content.settings} onSaved={loadAdminData} />
            )}

            {activeTab === 'messages' && (
              <section className="rounded-xl border border-slate-800 bg-slate-900">
                <div className="border-b border-slate-800 p-4">
                  <h2 className="text-lg font-semibold">Latest messages</h2>
                </div>
                <div className="divide-y divide-slate-800">
                  {content.messages.length === 0 && <div className="p-4 text-sm text-slate-400">No messages yet.</div>}
                  {content.messages.map((message) => (
                    <article key={message.id} className="p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">{message.name}</h3>
                        <a className="inline-flex items-center gap-1 text-sm text-cyan-300" href={`mailto:${message.email}`}>
                          <Mail size={14} />
                          {message.email}
                        </a>
                        <span className="text-xs text-slate-500">{new Date(message.created_at).toLocaleString()}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-slate-300">{message.message}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
