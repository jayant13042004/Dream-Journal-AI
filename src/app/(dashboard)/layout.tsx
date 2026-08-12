import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}
