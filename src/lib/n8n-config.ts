// zero-env client-safe config with auto local/prod
const IS_LOCAL =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);

type N8NConfig = {
  endpoint: (path: string) => string;
};

// sempre chama a URL de produção direto (local e prod)
export const N8N = {
  endpoint: (path: string) =>
    `https://ravyz.app.n8n.cloud/webhook${path}`,
};

