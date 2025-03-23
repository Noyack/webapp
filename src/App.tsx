import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import DesktopLayout from "./components/Layout/DesktopLayout";
import AppRoutes from "./routes";
import SignInPage from "./pages/SignInPage";
import Creation from "./pages/Creation";
import useApiServices from "./hooks/useApiServices";

export default function App() {
  // Initialize API services with authentication
  const { isInitialized, services, isAuthenticated } = useApiServices();
  
  // State to track if user needs onboarding
  const [isNew] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is new (needs onboarding) when API is initialized and user is authenticated
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;

    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        // const isNewUser = await services.auth.checkIsNewUser();
        // setIsNew(isNewUser);
      } catch (error) {
        console.error("Failed to check user status:", error);
        // Default to showing onboarding if we can't determine status
        // setIsNew(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [isInitialized, isAuthenticated, services.auth]);

  // Show loading while initializing APIs or checking user status
  if (isAuthenticated && (!isInitialized || isLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <header>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        {isNew ? (
          <Creation />
        ) : (
          <DesktopLayout>
            <AppRoutes />
          </DesktopLayout>
        )}
      </SignedIn>
    </header>
  );
}