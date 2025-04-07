import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import DesktopLayout from "./components/Layout/DesktopLayout";
import AppRoutes from "./routes";
// import SignInPage from "./pages/Auth/SignInPage";
import AuthPage from "./pages/Auth/AuthPage";
import Creation from "./pages/Creation";
import useApiServices from "./hooks/useApiServices";
import SearchProvider from "./components/Search/SearchContext";
import GlobalSearchPopover from "./components/Search/GlobalSearchPopover";
import { UserContext } from "./context/UserContext";

export default function App() {
  // Initialize API services with authentication
  const { isInitialized, services, isAuthenticated } = useApiServices();
  const { userInfo, setUserInfo } = useContext(UserContext)
  // State to track if user needs onboarding
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Check if user is new (needs onboarding) when API is initialized and user is authenticated
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;

    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        const user = await services.auth.getCurrentUser()
        // const isNewUser = await services.auth.checkIsNewUser();
        if (user){
          setUserInfo(user)
          setIsNew(user.onboarding);
        } 

      } catch (error) {
        console.error("Failed to check user status:", error);
        // Default to showing onboarding if we can't determine status
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <SearchProvider>

    <>
      <SignedOut>
        <AuthPage />
      </SignedOut>
      <SignedIn>
        {((userInfo && isNew)||(isAuthenticated && !userInfo)) &&
        <Creation />
        }
        {(userInfo && isNew === false) &&
          <DesktopLayout>
            <AppRoutes />
          </DesktopLayout>
          }
      </SignedIn>
    </>
    <GlobalSearchPopover />
    </SearchProvider>
  );
}