const BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getServices() {
  const data = await fetchJSON('/api/services');
  return data.docs || [];
}

export async function getProducts() {
  const data = await fetchJSON('/api/products');
  return data.docs || [];
}

export async function getFeaturedProduct() {
  return fetchJSON('/api/products/featured');
}

export async function getBlogPosts(limit = 100) {
  const data = await fetchJSON(`/api/blog-posts?limit=${limit}`);
  return data.docs || [];
}

export async function getBlogPost(slug) {
  return fetchJSON(`/api/blog-posts/${slug}`);
}

export async function getTeamMembers() {
  const data = await fetchJSON('/api/team-members');
  return data.docs || [];
}

export async function getSiteSettings() {
  return fetchJSON('/api/globals/site-settings');
}

export async function submitContact(formData) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
}
