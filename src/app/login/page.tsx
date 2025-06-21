import { redirect } from 'next/navigation';

export default function LoginPage() {
  redirect('/dashboard');
  // This component will not render as the redirect happens on the server.
  return null;
}
