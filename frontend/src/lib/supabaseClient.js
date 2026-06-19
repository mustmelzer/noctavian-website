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

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalizedPayload));
  } catch (_error) {
    return null;
  }
};

const isExpired = (session) => {
  if (!session?.access_token) return true;
  const payload = decodeJwtPayload(session.access_token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now() + 30000;
};

const refreshStoredSession = async () => {
  const session = getStoredSession();
  if (!session?.refresh_token) {
    setStoredSession(null);
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    setStoredSession(null);
    throw new Error(body?.message || body?.error_description || response.statusText);
  }

  const nextSession = {
    access_token: body.access_token,
    refresh_token: body.refresh_token || session.refresh_token,
    user: body.user || session.user,
  };
  setStoredSession(nextSession);
  return nextSession;
};

const getValidSession = async () => {
  const session = getStoredSession();
  if (!session) return null;
  if (!isExpired(session)) return session;
  return refreshStoredSession();
};

const buildHeaders = (session, { auth = false, prefer, contentType = 'application/json' } = {}) => {
  const headers = {
    apikey: supabaseAnonKey,
  };
  if (contentType) headers['Content-Type'] = contentType;
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

  const session = options.auth ? await getValidSession() : null;

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(session, options),
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
  const session = await getValidSession();

  const response = await fetch(`${supabaseUrl}${path}`, {
    method: 'POST',
    headers: buildHeaders(session, {
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
      try {
        return { data: { session: await getValidSession() }, error: null };
      } catch (error) {
        return { data: { session: null }, error };
      }
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
