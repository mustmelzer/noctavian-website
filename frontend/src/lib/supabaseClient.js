const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const sessionKey = 'noctavian-admin-session';

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(sessionKey));
  } catch (_error) {
    return null;
  }
};

const setStoredSession = (session) => {
  if (!session) {
    localStorage.removeItem(sessionKey);
    return;
  }
  localStorage.setItem(sessionKey, JSON.stringify(session));
};

const buildHeaders = ({ auth = false, prefer, contentType = 'application/json' } = {}) => {
  const headers = {
    apikey: supabaseAnonKey,
  };
  if (contentType) headers['Content-Type'] = contentType;
  const session = getStoredSession();
  headers.Authorization = auth && session?.access_token
    ? `Bearer ${session.access_token}`
    : `Bearer ${supabaseAnonKey}`;
  if (prefer) headers.Prefer = prefer;
  return headers;
};

const request = async (path, options = {}) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.message || body?.error_description || body?.hint || response.statusText);
  }

  return body;
};

const upload = async (path, file) => {
  const response = await fetch(`${supabaseUrl}${path}`, {
    method: 'POST',
    headers: buildHeaders({
      auth: true,
      contentType: file.type || 'application/octet-stream',
    }),
    body: file,
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.message || body?.error || response.statusText);
  }

  return body;
};

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }) {
      try {
        const data = await request('/auth/v1/token?grant_type=password', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        const session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user,
        };
        setStoredSession(session);
        return { data: { session }, error: null };
      } catch (error) {
        return { data: { session: null }, error };
      }
    },
    async getSession() {
      return { data: { session: getStoredSession() }, error: null };
    },
    async signOut() {
      setStoredSession(null);
      return { error: null };
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } };
    },
  },
  rest: {
    request,
  },
  storage: {
    upload,
  },
};
