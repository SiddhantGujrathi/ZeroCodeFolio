import { redirect } from 'next/navigation';

export default function LoginPage() {
  redirect('/c2lkZGhhbnQ=');
  // This component will not render as the redirect happens on the server.
  return null;
}
