import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  games as fallbackGames,
  collaborativeProjects as fallbackProjects,
  contactInfo as fallbackContactInfo,
} from '../data/mockData';

const fromContentRow = (row) => ({
  id: row.id,
  title: row.title,
  titleTr: row.title_tr,
  description: row.description,
  descriptionTr: row.description_tr,
  category: row.category,
  tag: row.tag,
  tagTr: row.tag_tr,
  status: row.status,
  image: row.image,
  gameUrl: row.game_url,
  sortOrder: row.sort_order,
  isVisible: row.is_visible,
});

const toContentRow = (item) => ({
  title: item.title || '',
  title_tr: item.titleTr || item.title_tr || '',
  description: item.description || '',
  description_tr: item.descriptionTr || item.description_tr || '',
  category: item.category || 'mobile',
  tag: item.tag || 'Mobile Game',
  tag_tr: item.tagTr || item.tag_tr || 'Mobil Oyun',
  status: item.status || 'coming-soon',
  image: item.image || '',
  game_url: item.gameUrl || item.game_url || null,
  sort_order: Number(item.sortOrder ?? item.sort_order ?? 0),
  is_visible: item.isVisible ?? item.is_visible ?? true,
});

const defaultSettings = {
  email: fallbackContactInfo.email,
  phone: fallbackContactInfo.phone,
  address: fallbackContactInfo.address,
  addressTr: fallbackContactInfo.addressTr,
  instagram: fallbackContactInfo.social.instagram,
  twitter: fallbackContactInfo.social.twitter,
  linkedin: fallbackContactInfo.social.linkedin,
};

const fromSettingsRows = (rows) => {
  const settings = { ...defaultSettings };
  rows.forEach((row) => {
    settings[row.key] = row.value;
  });
  return {
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    addressTr: settings.addressTr,
    social: {
      instagram: settings.instagram,
      twitter: settings.twitter,
      linkedin: settings.linkedin,
    },
  };
};

export const loadSiteContent = async () => {
  if (!isSupabaseConfigured) {
    return {
      games: fallbackGames,
      collaborativeProjects: fallbackProjects,
      contactInfo: fallbackContactInfo,
      source: 'fallback',
    };
  }

  try {
    const [gamesData, projectsData, settingsData] = await Promise.all([
      supabase.rest.request('/rest/v1/site_games?select=*&is_visible=is.true&order=sort_order.asc,created_at.asc'),
      supabase.rest.request('/rest/v1/site_projects?select=*&is_visible=is.true&order=sort_order.asc,created_at.asc'),
      supabase.rest.request('/rest/v1/site_settings?select=key,value'),
    ]);

    return {
      games: gamesData.map(fromContentRow),
      collaborativeProjects: projectsData.map(fromContentRow),
      contactInfo: fromSettingsRows(settingsData),
      source: 'supabase',
    };
  } catch (error) {
    console.warn('Supabase content load failed.', { error });

    if (isSupabaseConfigured) {
      return {
        games: [],
        collaborativeProjects: [],
        contactInfo: fallbackContactInfo,
        source: 'supabase-error',
      };
    }

    return {
      games: fallbackGames,
      collaborativeProjects: fallbackProjects,
      contactInfo: fallbackContactInfo,
      source: 'fallback',
    };
  }
};

export const listAdminContent = async () => {
  const [gamesData, projectsData, settingsData, messagesData] = await Promise.all([
    supabase.rest.request('/rest/v1/site_games?select=*&order=sort_order.asc', { auth: true }),
    supabase.rest.request('/rest/v1/site_projects?select=*&order=sort_order.asc', { auth: true }),
    supabase.rest.request('/rest/v1/site_settings?select=key,value&order=key.asc', { auth: true }),
    supabase.rest.request('/rest/v1/contact_messages?select=*&order=created_at.desc&limit=50', { auth: true }),
  ]);

  return {
    games: gamesData.map(fromContentRow),
    collaborativeProjects: projectsData.map(fromContentRow),
    settings: fromSettingsRows(settingsData),
    messages: messagesData,
  };
};

export const saveContentItem = async (table, item) => {
  const payload = toContentRow(item);
  if (item.id) {
    await supabase.rest.request(`/rest/v1/${table}?id=eq.${item.id}`, {
      method: 'PATCH',
      auth: true,
      prefer: 'return=minimal',
      body: JSON.stringify(payload),
    });
    return item.id;
  }

  const data = await supabase.rest.request(`/rest/v1/${table}`, {
    method: 'POST',
    auth: true,
    prefer: 'return=representation',
    body: JSON.stringify(payload),
  });
  return data[0].id;
};

export const deleteContentItem = async (table, id) => {
  await supabase.rest.request(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    auth: true,
    prefer: 'return=minimal',
  });
};

export const saveSettings = async (settings) => {
  const rows = [
    ['email', settings.email],
    ['phone', settings.phone],
    ['address', settings.address],
    ['addressTr', settings.addressTr],
    ['instagram', settings.social?.instagram || settings.instagram],
    ['twitter', settings.social?.twitter || settings.twitter],
    ['linkedin', settings.social?.linkedin || settings.linkedin],
  ].map(([key, value]) => ({ key, value: value || '' }));

  await supabase.rest.request('/rest/v1/site_settings?on_conflict=key', {
    method: 'POST',
    auth: true,
    prefer: 'resolution=merge-duplicates,return=minimal',
    body: JSON.stringify(rows),
  });
};

export const submitContactMessage = async (message) => {
  if (!isSupabaseConfigured) return;
  await supabase.rest.request('/rest/v1/contact_messages', {
    method: 'POST',
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      message: message.message,
    }),
  });
};

export const uploadContentImage = async (file, folder = 'games') => {
  if (!file) return null;

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const extension = safeName.includes('.') ? safeName.split('.').pop() : 'jpg';
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  await supabase.storage.upload(`/storage/v1/object/site-images/${path}`, file);
  return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/site-images/${path}`;
};
