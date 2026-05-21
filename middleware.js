// SilverGuard Admin 보호 — Vercel Edge Middleware (HTTP Basic Auth)
// 자격증명은 코드에 두지 않고 Vercel 환경변수(ADMIN_USER / ADMIN_PASS)에서 읽음.
export const config = {
  matcher: ['/admin', '/admin/', '/admin.html', '/admin/:path*'],
};

export default function middleware(request) {
  const auth = request.headers.get('authorization') || '';
  const user = process.env.ADMIN_USER || '';
  const pass = process.env.ADMIN_PASS || '';

  if (user && pass) {
    const expected = 'Basic ' + btoa(user + ':' + pass);
    if (auth === expected) {
      return; // 인증 통과 → 정상 진행
    }
  }
  return new Response('인증이 필요합니다. (Authentication required)', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SilverGuard Admin", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
