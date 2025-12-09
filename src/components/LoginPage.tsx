import { useState } from "react";
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export function LoginPage({ onLoginSuccess, onBack }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const url = import.meta.env?.VITE_SUPABASE_URL;
    const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    return url && key && !url.includes('placeholder') && url !== '';
  };

  const supabaseConfigured = isSupabaseConfigured();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };

    let isValid = true;

    // Validate name (only for registration)
    if (!isLogin && !formData.name.trim()) {
      errors.name = "Navn er påkrevd";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "E-post er påkrevd";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Ugyldig e-postadresse";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Passord er påkrevd";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      errors.password = "Passord må være minst 8 tegn";
      isValid = false;
    }

    // Validate confirm password (only for registration)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Bekreft passord";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passordene matcher ikke";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Check if Supabase is properly configured
      if (!supabaseConfigured) {
        setError("Supabase er ikke konfigurert. Vennligst sett opp VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i .env filen.");
        setIsLoading(false);
        toast.error("Konfigurasjonsfeil", {
          description: "Supabase environment variabler mangler. Se konsollen for mer informasjon.",
        });
        return;
      }

      if (isLogin) {
        // Login with Supabase
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) {
          // Handle specific errors
          if (loginError.message.includes("Invalid login credentials")) {
            setError("Feil passord.");
          } else if (loginError.message.includes("Email not confirmed")) {
            setError("E-post er ikke bekreftet. Sjekk innboksen din.");
          } else if (loginError.message.includes("User not found")) {
            setError("Bruker finnes ikke.");
          } else {
            setError(loginError.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          toast.success("Innlogging vellykket!", {
            description: `Velkommen tilbake, ${data.user.email}`,
          });
          onLoginSuccess();
        }
      } else {
        // Register with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (signUpError) {
          // Handle specific errors
          if (signUpError.message.includes("User already registered")) {
            setError("Denne e-posten er allerede registrert.");
          } else if (signUpError.message.includes("Password should be at least")) {
            setError("Passord må være minst 8 tegn.");
          } else {
            setError(signUpError.message);
          }
          setIsLoading(false);
          return;
        }

        if (data.user) {
          toast.success("Konto opprettet!", {
            description: "Du kan nå logge inn med din nye konto.",
            duration: 5000,
          });
          
          // Switch to login mode after successful registration
          setIsLogin(true);
          setFormData({
            name: "",
            email: formData.email, // Keep email for easy login
            password: "",
            confirmPassword: "",
          });
        }
      }
    } catch (err) {
      setError("En uventet feil oppstod. Prøv igjen senere.");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFieldErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-purple-600 mb-2">
            Compliance-kompass
          </h1>
          <p className="text-slate-600">Echomedic</p>
        </div>

        {/* Supabase Configuration Warning */}
        {!supabaseConfigured && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-300">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              <p className="mb-2">
                <strong>Supabase er ikke konfigurert</strong>
              </p>
              <p className="text-sm">
                For å aktivere innlogging, vennligst sett opp Supabase credentials i <code className="bg-yellow-100 px-1 rounded">/lib/supabase.ts</code>
              </p>
              <p className="text-xs mt-2">
                Se instruksjoner i konsollen (F12)
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 mb-1">
                {isLogin ? "Logg inn for å fortsette" : "Opprett en konto"}
              </p>
              <p className="text-xs text-blue-800">
                {isLogin 
                  ? "Få tilgang til dine lagrede rammeverk, dokumenter og handlingsplaner."
                  : "Din informasjon lagres sikkert slik at du kan fortsette arbeidet når som helst."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-slate-800 mb-1">
              {isLogin ? "Logg inn" : "Opprett konto"}
            </h2>
            <p className="text-sm text-slate-600">
              {isLogin 
                ? "Velkommen tilbake! Logg inn for å fortsette kartleggingen." 
                : "Registrer deg for å starte compliance-kartleggingen."
              }
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-slate-700">
                  Fullt navn
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${fieldErrors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Ola Nordmann"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <Label htmlFor="email" className="text-slate-700">
                E-post
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="din@epost.no"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <Label htmlFor="password" className="text-slate-700">
                Passord
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Minst 8 tegn"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password field (only for registration) */}
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  Bekreft passord
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Gjenta passordet"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? "Logger inn..." : "Oppretter konto..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Logg inn" : "Opprett konto"}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Toggle between login/register */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
              disabled={isLoading}
            >
              {isLogin 
                ? "Har du ikke en konto? Registrer deg her" 
                : "Har du allerede en konto? Logg inn her"
              }
            </button>
          </div>

          {/* Back button */}
          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-sm text-slate-500 hover:text-slate-700"
              disabled={isLoading}
            >
              ← Tilbake til forsiden
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Ved å fortsette godtar du våre vilkår for bruk og personvernregler.
          </p>
        </div>
      </div>
    </div>
  );
}