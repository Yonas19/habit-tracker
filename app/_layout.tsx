import { Stack, useSegments } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/lib/auth-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const { user } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      setTimeout(() => router.replace("/auth"), 0);
    }else if (user && inAuthGroup) {
      setTimeout(() => router.replace("/"), 0);
    }
  },[user,segments]);

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
