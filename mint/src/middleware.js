import {  NextResponse } from 'next/server'

export const config = {
  matcher: '/'
}

export function middleware(req) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'bitwell' && pwd === 'dudewtf') {
      return NextResponse.next()
    }
  }

  return NextResponse.json("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
