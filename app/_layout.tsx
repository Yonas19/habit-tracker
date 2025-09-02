import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/lib/auth-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = false;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth"); // Redirect after mount
    }
  });

  // **Always render children immediately** so RootLayout mounts properly
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
