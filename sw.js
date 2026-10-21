/* NL Trả Góp Công Nghiệp — Service Worker
 * - Mở được ứng dụng khi mất sóng (lưu sẵn trang, biểu tượng, phông chữ, thư viện đọc hoá đơn).
 * - Có mạng: luôn lấy index.html mới nhất; mạng yếu quá 4 giây thì mở bản đã lưu và tải bản mới ngầm.
 * - Dữ liệu (hồ sơ, cài đặt, PDF đã gửi) nằm trong bộ nhớ trình duyệt, service worker không đụng tới.
 * Phát hành bản mới chỉ cần thay index.html và tăng nd-version trong đó. Chỉ đổi CACHE khi sửa chính file này.
 */
const CACHE = 'nl-congnghiep-v1';
const SCOPE = self.registration.scope;
const INDEX = SCOPE;
const CORE = ['manifest.webmanifest', 'icon-192.png', 'icon-512-any.png', 'icon-512-maskable.png', 'apple-touch-icon.png'].map(f => new URL(f, SCOPE).href);
const CDN = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const CDN_SAN = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];
const NAV_TIMEOUT = 4000;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    try { const r = await fetch(INDEX, { cache: 'reload' }); if (r.ok && r.status === 200) await c.put(INDEX, r); } catch (_) {}
    await Promise.all(CORE.map(u => fetch(u, { cache: 'reload' }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    await Promise.all(CDN_SAN.map(u => fetch(u, { mode: 'no-cors' }).then(r => c.put(u, r)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE && (n.startsWith('nl-congnghiep-') || n.startsWith('nd-'))).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

const wait = ms => new Promise(r => setTimeout(r, ms));

async function navigate(req) {
  const c = await caches.open(CACHE);
  const net = fetch(req, { cache: 'no-cache' }).then(async r => {
    if (r.ok && r.status === 200) await c.put(INDEX, r.clone());
    return r;
  });
  const cached = await c.match(INDEX);
  if (!cached) {
    try { return await net; }
    catch (_) { return new Response('<meta charset="utf-8"><h3 style="font-family:sans-serif">Không có mạng và máy chưa lưu sẵn ứng dụng. Hãy mở lại khi có mạng.</h3>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
  }
  const first = await Promise.race([net.then(r => r, () => null), wait(NAV_TIMEOUT).then(() => 'cham')]);
  if (first && first !== 'cham' && first.ok) return first;
  return cached;
}

async function staleWhileRevalidate(req) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req);
  const net = fetch(req).then(r => { if (r && (r.status === 200 || r.type === 'opaque')) c.put(req, r.clone()).catch(() => {}); return r; }).catch(() => hit);
  return hit || net;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;   // kiểm tra phiên bản (đọc 4 KB đầu) đi thẳng ra mạng
  const url = new URL(req.url);
  if (req.mode === 'navigate' && url.href.startsWith(SCOPE)) { e.respondWith(navigate(req)); return; }
  if (url.href.startsWith(SCOPE) && /\.(png|webmanifest)$/.test(url.pathname)) { e.respondWith(staleWhileRevalidate(req)); return; }
  if (CDN.includes(url.hostname)) { e.respondWith(staleWhileRevalidate(req)); return; }
});
