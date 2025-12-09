import { useState } from "react";
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

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

    // Simulate API call (in real app, this would be Supabase auth)
    setTimeout(() => {
      // Mock authentication - store user in localStorage
      const user = {
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem("complianceUser", JSON.stringify(user));
      
      setIsLoading(false);
      onLoginSuccess();
    }, 1000);
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
