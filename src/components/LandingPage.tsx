import {
  ArrowRight,
  CheckCircle2,
  FileText,
  BarChart3,
  ListChecks,
  Shield,
  Sparkles,
  Clock,
  Target,
  Mail,
  Building2,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollToTop } from "./ScrollToTop";
import { useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick?: () => void;
}

export function LandingPage({ onGetStarted, onLoginClick }: LandingPageProps) {
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setDemoDialogOpen(false);
      setFormSubmitted(false);
      setFormData({ name: "", email: "", company: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-purple-600">Compliance-kompass</h1>
                <p className="text-slate-600 text-xs">Echomedic</p>
              </div>
            </div>

            {/* Login Button */}
            {onLoginClick && (
              <Button
                onClick={onLoginClick}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Logg inn
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 border-2 border-purple-200 px-6 py-3 rounded-full mb-10 shadow-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">
                Echomedic Compliance-kompass
              </span>
            </div>

            <h1 className="text-purple-900 mb-8 leading-tight">
              Compliance-oversikt på
              <span className="block text-purple-600">
                minutter, ikke måneder
              </span>
            </h1>

            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Automatiser kartlegging av compliance-krav innenfor Normen, ISO
              27001, GDPR, ISO 13485 og ISO 42001. Få konkrete handlingsplaner
              basert på faktisk risiko.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button
                onClick={onGetStarted}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 shadow-lg shadow-purple-600/30"
              >
                Start kartlegging
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6"
              >
                Se hvordan det virker
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-purple-600 mb-1">5+</div>
                <p className="text-slate-600 text-sm">Rammeverk</p>
              </div>
              <div>
                <div className="text-purple-600 mb-1">80%</div>
                <p className="text-slate-600 text-sm">Tidsbesparelse</p>
              </div>
              <div>
                <div className="text-purple-600 mb-1">2+</div>
                <p className="text-slate-600 text-sm">Team størrelse</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200 shadow-2xl">
              {/* Mockup of the app */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm text-green-800">ISO 27001</span>
                    <Badge className="bg-green-600 text-white">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm text-yellow-800">GDPR</span>
                    <Badge className="bg-yellow-600 text-white">67%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm text-red-800">ISO 13485</span>
                    <Badge className="bg-red-600 text-white">34%</Badge>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg border border-purple-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works - Timeline style */}
      <div className="bg-slate-50 py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-6">
              Enkel prosess
            </Badge>
            <h2 className="text-purple-900 mb-5">
              Fra kaos til kontroll i 3 steg
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Vår smarte prosess gjør compliance-kartlegging rask og effektiv
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200" />

            {[
              {
                num: "01",
                icon: FileText,
                title: "Velg & Last opp",
                description:
                  "Velg relevante compliance-rammeverk og last opp eksisterende dokumentasjon. Vårt system analyserer innholdet automatisk.",
                color: "purple",
              },
              {
                num: "02",
                icon: BarChart3,
                title: "Få innsikt",
                description:
                  "Se umiddelbar visuell oversikt over compliance-status med fargekodet scoring. Identifiser gap og muligheter raskt.",
                color: "purple",
              },
              {
                num: "03",
                icon: ListChecks,
                title: "Handle smart",
                description:
                  "Motta prioritert tiltaksliste basert på risiko, kompleksitet og tidslinje. Start med det som betyr mest.",
                color: "purple",
              },
            ].map((step, idx) => (
              <Card
                key={idx}
                className="relative p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all bg-white group"
              >
                <div className="absolute -top-4 left-8 bg-purple-600 text-white px-4 py-2 rounded-full text-sm">
                  {step.num}
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8 text-purple-600" />
                </div>

                <h3 className="text-purple-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-6">
              Hvorfor velge oss?
            </Badge>
            <h2 className="text-purple-900 mb-5">
              Compliance-arbeid som faktisk fungerer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: "Spar 80% tid",
                description: "Automatiser det som kan automatiseres",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: Target,
                title: "Risiko-basert",
                description: "Prioriter basert på faktisk risiko",
                gradient: "from-purple-600 to-purple-700",
              },
              {
                icon: Shield,
                title: "5+ rammeverk",
                description: "Alt på ett sted, én oversikt",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: Sparkles,
                title: "Enkel å bruke",
                description: "Laget for små team (2+ personer)",
                gradient: "from-purple-600 to-purple-700",
              },
            ].map((benefit, idx) => (
              <Card
                key={idx}
                className="p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-purple-900 mb-2">{benefit.title}</h4>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Content */}
            <div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-6">
                Om oss
              </Badge>
              <h2 className="text-purple-900 mb-6">
                Compliance-ekspertise møter moderne teknologi
              </h2>
              <div className="space-y-5 text-slate-600 leading-relaxed">
                <p>
                  <span className="text-purple-600">Echomedic</span> er et
                  fremtidsrettet selskap som kombinerer compliance-ekspertise
                  med innovativ teknologi for å gjøre regelverkshåndtering
                  tilgjengelig for små og mellomstore virksomheter.
                </p>
                <p>
                  Vi vet at compliance ofte oppleves som en tung og tidkrevende
                  byrde, spesielt for team med begrensede ressurser. Derfor har
                  vi utviklet{" "}
                  <span className="text-purple-600">Compliance-kompass</span> –
                  en intelligent plattform som automatiserer kartlegging,
                  analyse og prioritering av compliance-krav.
                </p>
                <p>
                  Vårt mål er å gjøre compliance-arbeid forutsigbart,
                  strukturert og faktisk gjennomførbart for team på 2+ personer.
                  Vi tror på at sikkerhet, kvalitet og personvern ikke skal være
                  forbeholdt store bedrifter med store budsjetter.
                </p>
              </div>

              <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-purple-900 mb-2">Vår visjon</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Gjøre compliance-arbeid tilgjengelig, forståelig og
                      gjennomførbart for norske virksomheter – uansett størrelse
                      eller bransje.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Stats & Values */}
            <div className="space-y-6">
              <Card className="p-8 border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-purple-900">Fokusområder</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    "Normen (Norm for informasjonssikkerhet)",
                    "ISO 27001 (Informasjonssikkerhet)",
                    "GDPR (Personvern)",
                    "ISO 13485 (Medisinsk utstyr)",
                    "ISO 42001 (AI-styring)",
                  ].map((area, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 border-2 border-purple-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-purple-900">Våre verdier</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Tilgjengelighet", desc: "Enkel for alle" },
                    { label: "Presisjon", desc: "Riktig analyse" },
                    { label: "Effektivitet", desc: "Spar tid" },
                    { label: "Transparens", desc: "Tydelige resultater" },
                  ].map((value, idx) => (
                    <div
                      key={idx}
                      className="text-center p-4 bg-purple-50 rounded-lg"
                    >
                      <div className="text-purple-700 mb-1">{value.label}</div>
                      <p className="text-slate-600 text-xs">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-white mb-6">
            Klar til å ta kontroll over compliance?
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Få oversikt over compliance-status på minutter, ikke måneder. Start
            gratis i dag.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 shadow-xl"
            >
              Start kartlegging nå
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Dialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen}>
              <DialogTrigger asChild>
                <Button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-6 shadow-lg">
                  Planlegg demo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-purple-900">
                    Planlegg en demo
                  </DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Fyll ut skjemaet nedenfor så kontakter vi deg for å avtale
                    en demo av Compliance-kompass.
                  </DialogDescription>
                </DialogHeader>

                {!formSubmitted ? (
                  <form onSubmit={handleDemoSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Navn *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          placeholder="Ola Nordmann"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-post *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="ola@bedrift.no"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Bedrift *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="company"
                          placeholder="Bedrift AS"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Melding (valgfritt)</Label>
                      <Textarea
                        id="message"
                        placeholder="Fortell oss litt om deres compliance-behov..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDemoDialogOpen(false)}
                      >
                        Avbryt
                      </Button>
                      <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Send forespørsel
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-purple-900 mb-2">
                      Takk for din interesse!
                    </h3>
                    <p className="text-slate-600">
                      Vi har mottatt din forespørsel og kontakter deg innen 24
                      timer.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
