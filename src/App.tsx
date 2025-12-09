import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { UserTestGuide } from "./components/UserTestGuide";
import { LoginPage } from "./components/LoginPage";
import { Panel1 } from "./components/Panel1";
import { Panel2 } from "./components/Panel2";
import { Panel3 } from "./components/Panel3";
import { ScrollToTop } from "./components/ScrollToTop";
import { ArrowLeft, ClipboardList, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { useInactivityTimer } from "./hooks/useInactivityTimer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { ComplianceProvider } from "./contexts/ComplianceContext";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [showTestGuide, setShowTestGuide] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowApp(false);
    setShowLogin(false);
    setCurrentStep(1);
    setShowInactivityWarning(false);
    toast.success("Du er nå logget ut");
  };

  const handleInactivityLogout = async () => {
    await handleLogout();
    toast.error("Du ble logget ut på grunn av inaktivitet", {
      description: "For sikkerhetsmessige årsaker logger vi deg ut etter 15 minutter uten aktivitet."
    });
  };

  // Setup inactivity timer (only when authenticated)
  const { resetTimer } = useInactivityTimer({
    onInactive: handleInactivityLogout,
    inactivityTime: 15 * 60 * 1000, // 15 minutes
    warningTime: 1 * 60 * 1000, // Show warning 1 minute before
    onWarning: () => {
      if (isAuthenticated && showApp) {
        setShowInactivityWarning(true);
      }
    },
  });

  const handleStayLoggedIn = () => {
    setShowInactivityWarning(false);
    resetTimer();
    toast.success("Session forlenget");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Laster...</p>
        </div>
      </div>
    );
  }

  // Show test guide if activated
  if (showTestGuide) {
    return (
      <UserTestGuide onClose={() => setShowTestGuide(false)} />
    );
  }

  // Show login page if user clicked "Get Started" but not authenticated
  if (showLogin && !isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={() => {
          setShowLogin(false);
          setShowApp(true);
          toast.success(`Velkommen, ${currentUser?.email}!`);
        }}
        onBack={() => {
          setShowLogin(false);
          setShowApp(false);
        }}
      />
    );
  }

  // Show landing page if app hasn't started
  if (!showApp) {
    return (
      <LandingPage 
        onGetStarted={() => {
          if (isAuthenticated) {
            setShowApp(true);
          } else {
            setShowLogin(true);
          }
        }}
        onLoginClick={() => {
          setShowLogin(true);
        }}
      />
    );
  }

  const handleBackToLanding = () => {
    setShowApp(false);
    setCurrentStep(1);
  };

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" richColors />
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-7">
            <div className="flex items-center justify-between">
              {/* Logo/Home button - clickable */}
              <button 
                onClick={handleBackToLanding}
                className="group flex flex-col hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-purple-600">
                      Compliance-kompass
                    </h1>
                    <p className="text-slate-600 mt-0.5 text-sm">Echomedic</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-14 group-hover:text-purple-600 transition-colors">
                  ← Klikk for å gå til forsiden
                </p>
              </button>
              
              {/* Right side buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTestGuide(true)}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Brukertestguide
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBackToLanding}
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Tilbake til forsiden
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logg ut
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-start justify-center gap-24 max-w-2xl mx-auto">
              {[
                { num: 1, title: "Start" },
                { num: 2, title: "Analyse" },
                { num: 3, title: "Handling" },
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.num)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.num
                          ? "bg-purple-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {step.num}
                    </button>
                    <span
                      className={`mt-2 text-sm ${
                        currentStep >= step.num
                          ? "text-purple-600"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`h-0.5 w-20 -mt-6 mx-4 ${
                        currentStep > step.num
                          ? "bg-purple-600"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-14">
          {currentStep === 1 && (
            <Panel1 onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <Panel2
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <Panel3 onBack={() => setCurrentStep(2)} />
          )}
        </main>

        {/* Inactivity Warning Dialog */}
        <AlertDialog open={showInactivityWarning} onOpenChange={setShowInactivityWarning}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <AlertDialogTitle className="text-xl">Advarsel om inaktivitet</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-base">
                Du har vært inaktiv i 14 minutter. Du vil bli logget ut om <span className="font-bold text-red-600">1 minutt</span> hvis du ikke gjør noe.
                <br /><br />
                Dette er en sikkerhetsfunksjon for å beskytte dine data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleLogout} className="bg-slate-100 hover:bg-slate-200">
                Logg ut nå
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleStayLoggedIn}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Fortsett arbeidet
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </ComplianceProvider>
  );
}