import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import DesktopLayout from "./components/Layout/DesktopLayout";
import AppRoutes from "./routes";

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <DesktopLayout>
        {/* <UserButton /> */}
          <AppRoutes />
        </DesktopLayout>

      </SignedIn>
    </header>
  );
}