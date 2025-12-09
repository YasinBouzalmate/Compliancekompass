import {
  ClipboardList,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  Printer,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollToTop } from "./ScrollToTop";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";

interface UserTestGuideProps {
  onClose: () => void;
}

export function UserTestGuide({ onClose }: UserTestGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "scenario"
  );
  const [isPrintMode, setIsPrintMode] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDownloadPDF = () => {
    // Expand all sections for printing
    setIsPrintMode(true);

    // Wait for DOM to update, then trigger print
    setTimeout(() => {
      window.print();
      // Reset after print dialog is closed
      setTimeout(() => {
        setIsPrintMode(false);
      }, 100);
    }, 100);
  };

  // Handle print event
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrintMode(true);
    };

    const handleAfterPrint = () => {
      setIsPrintMode(false);
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-expand {
            display: block !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
      <div className="min-h-screen bg-slate-50 p-8" id="printable-content">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-3">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Brukertestløype
                </Badge>
                <h1 className="text-purple-900 mb-2">
                  Compliance-kompass - Brukertesting
                </h1>
                <p className="text-slate-600">
                  Strukturert testløype for konsistent og målrettet evaluering
                  av prototypen
                </p>
              </div>
              <div className="flex gap-3 no-print">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={handleDownloadPDF}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Skriv ut / Last ned PDF
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Tilbake til app
                </Button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <Card className="p-4 border-l-4 border-l-purple-600">
                <div className="text-slate-600 text-sm mb-1">Varighet</div>
                <div className="text-purple-900">30-45 min</div>
              </Card>
              <Card className="p-4 border-l-4 border-l-purple-600">
                <div className="text-slate-600 text-sm mb-1">Deltakere</div>
                <div className="text-purple-900">5-8 brukere</div>
              </Card>
              <Card className="p-4 border-l-4 border-l-purple-600">
                <div className="text-slate-600 text-sm mb-1">Målgruppe</div>
                <div className="text-purple-900">CTO/Sikkerhetsansvarlige</div>
              </Card>
              <Card className="p-4 border-l-4 border-l-purple-600">
                <div className="text-slate-600 text-sm mb-1">Metode</div>
                <div className="text-purple-900">Think-aloud + Intervju</div>
              </Card>
            </div>
          </div>

          {/* Main content sections */}
          <div className="space-y-4">
            {/* Scenario */}
            <Card className="overflow-hidden border-2 border-purple-100">
              <button
                onClick={() => toggleSection("scenario")}
                className="w-full p-6 flex items-center justify-between hover:bg-purple-50/50 transition-colors no-print"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-purple-900 mb-1">1. Test-scenario</h3>
                    <p className="text-slate-600 text-sm">
                      Kontekst og situasjon for brukeren
                    </p>
                  </div>
                </div>
                {expandedSection === "scenario" ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {(expandedSection === "scenario" || isPrintMode) && (
                <div
                  className={
                    isPrintMode
                      ? "px-6 pb-6 pt-6 bg-white print-expand"
                      : "px-6 pb-6 border-t border-purple-100 pt-6 bg-white"
                  }
                >
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                    <h4 className="text-purple-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Scenario-beskrivelse
                    </h4>
                    <p className="text-slate-700 mb-4">
                      "Du er nylig ansatt som CTO i et medisinteknisk selskap
                      med 15 ansatte. Selskapet utvikler en digital
                      helseplattform og trenger å dokumentere compliance med ISO
                      27001 (informasjonssikkerhet), GDPR (personvern) og ISO
                      13485 (medisinteknisk kvalitet).
                    </p>
                    <p className="text-slate-700 mb-4">
                      Styret har gitt deg 3 måneder til å kartlegge nåværende
                      compliance-status og lage en realistisk handlingsplan. Du
                      har begrenset tid og budsjett, og trenger en effektiv måte
                      å få oversikt på.
                    </p>
                    <p className="text-slate-700">
                      Du har hørt om Compliance-kompass og vil teste om det kan
                      hjelpe deg med denne oppgaven."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-purple-900 mb-3">
                      Kontekst-spørsmål (før test)
                    </h4>
                    {[
                      "Kan du fortelle litt om din erfaring med compliance-arbeid?",
                      "Hvordan håndterer du i dag oversikt over compliance-krav?",
                      "Hva er de største utfordringene du opplever med compliance?",
                      "Hvilke verktøy eller metoder bruker du i dag for å holde oversikt?",
                    ].map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-700">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Oppgaver */}
            <Card className="overflow-hidden border-2 border-purple-100">
              <button
                onClick={() => toggleSection("tasks")}
                className="w-full p-6 flex items-center justify-between hover:bg-purple-50/50 transition-colors no-print"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-purple-900 mb-1">2. Test-oppgaver</h3>
                    <p className="text-slate-600 text-sm">
                      Konkrete oppgaver brukeren skal utføre
                    </p>
                  </div>
                </div>
                {expandedSection === "tasks" ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {(expandedSection === "tasks" || isPrintMode) && (
                <div
                  className={
                    isPrintMode
                      ? "px-6 pb-6 pt-6 bg-white print-expand"
                      : "px-6 pb-6 border-t border-purple-100 pt-6 bg-white"
                  }
                >
                  <p className="text-slate-600 mb-6">
                    Be brukeren om å "tenke høyt" mens de utfører oppgavene.
                    Ikke hjelp med mindre de står fullstendig fast i mer enn 2
                    minutter.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        num: "Oppgave 1",
                        title: "Start en ny compliance-kartlegging",
                        time: "5 min",
                        tasks: [
                          "Naviger fra landingssiden til selve verktøyet",
                          "Velg 3 relevante compliance-rammeverk (ISO 27001, GDPR, ISO 13485)",
                          "Last opp ett dokument (bruk testfil som vi gir)",
                        ],
                        observations: [
                          'Finner brukeren lett "Kom i gang"-knappen?',
                          "Forstår brukeren hvilke rammeverk som er tilgjengelige?",
                          "Er opplastingsprosessen intuitiv?",
                        ],
                      },
                      {
                        num: "Oppgave 2",
                        title: "Analyser compliance-status",
                        time: "10 min",
                        tasks: [
                          "Gå til analyse-panelet (Panel 2)",
                          "Identifiser hvilket område som har lavest score",
                          "Finn ut hva som mangler i dette området",
                          "Sammenlign status på tvers av de valgte rammeverkene",
                        ],
                        observations: [
                          "Forstår brukeren fargesystemet (grønn/gul/rød)?",
                          "Kan brukeren enkelt navigere mellom områder?",
                          "Er informasjonen om mangler tydelig nok?",
                          "Synes brukeren oversikten er nyttig?",
                        ],
                      },
                      {
                        num: "Oppgave 3",
                        title: "Generer og prioriter handlingsplan",
                        time: "10 min",
                        tasks: [
                          "Gå til handlingsplan-panelet (Panel 3)",
                          "Se gjennom den genererte tiltakslisten",
                          "Finn de 3 viktigste tiltakene basert på risiko",
                          "Eksporter eller lagre handlingsplanen",
                        ],
                        observations: [
                          "Er prioriteringen logisk for brukeren?",
                          "Forstår brukeren hvorfor tiltak er prioritert som de er?",
                          "Er tiltakene konkrete nok til å handle på?",
                          "Savner brukeren noen funksjonalitet?",
                        ],
                      },
                      {
                        num: "Oppgave 4",
                        title: "Fri utforsking",
                        time: "5 min",
                        tasks: [
                          "Utforsk verktøyet fritt",
                          "Prøv funksjoner du selv er interessert i",
                          "Test eventuelt andre arbeidsflyter",
                        ],
                        observations: [
                          "Hvilke funksjoner trekkes brukeren mot?",
                          "Oppdager brukeren funksjoner vi ikke har vist?",
                          "Er det noe som overrasker brukeren (positivt eller negativt)?",
                        ],
                      },
                    ].map((task, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-lg p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge className="bg-purple-600 text-white mb-2">
                              {task.num}
                            </Badge>
                            <h4 className="text-purple-900 mb-1">
                              {task.title}
                            </h4>
                            <p className="text-slate-500 text-sm">
                              Estimert tid: {task.time}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-slate-700 mb-2">Deloppgaver:</h5>
                          <ul className="space-y-2">
                            {task.tasks.map((t, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-slate-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h5 className="text-amber-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Observasjonspunkter
                          </h5>
                          <ul className="space-y-1">
                            {task.observations.map((obs, i) => (
                              <li key={i} className="text-amber-800 text-sm">
                                • {obs}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Intervjuguide */}
            <Card className="overflow-hidden border-2 border-purple-100">
              <button
                onClick={() => toggleSection("interview")}
                className="w-full p-6 flex items-center justify-between hover:bg-purple-50/50 transition-colors no-print"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-purple-900 mb-1">3. Intervjuguide</h3>
                    <p className="text-slate-600 text-sm">
                      Spørsmål for dybdeintervju etter testing
                    </p>
                  </div>
                </div>
                {expandedSection === "interview" ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {(expandedSection === "interview" || isPrintMode) && (
                <div
                  className={
                    isPrintMode
                      ? "px-6 pb-6 pt-6 bg-white print-expand"
                      : "px-6 pb-6 border-t border-purple-100 pt-6 bg-white"
                  }
                >
                  <div className="space-y-6">
                    {[
                      {
                        category: "Generell opplevelse",
                        questions: [
                          "Hva var ditt førsteinntrykk av verktøyet?",
                          "På en skala fra 1-10, hvor sannsynlig er det at du ville brukt dette verktøyet? Hvorfor?",
                          "Hva likte du best med Compliance-kompass?",
                          "Hva var mest frustrerende eller forvirrende?",
                        ],
                      },
                      {
                        category: "Verdi og nytte",
                        questions: [
                          "Løser dette verktøyet et reelt problem for deg?",
                          "Hvor mye tid tror du dette kan spare deg sammenlignet med dagens løsning?",
                          "Ville du anbefalt dette til en kollega? Hvorfor/hvorfor ikke?",
                          "Hva er den viktigste funksjonen for deg?",
                          "Hva mangler for at dette skal bli et 'must-have' verktøy?",
                        ],
                      },
                      {
                        category: "Brukervennlighet",
                        questions: [
                          "Var navigasjonen mellom panelene logisk for deg?",
                          "Var terminologien forståelig og relevant?",
                          "Var det noe du forventet å finne, men ikke fant?",
                          "Hvordan opplevde du mengden informasjon på skjermen?",
                        ],
                      },
                      {
                        category: "Spesifikke funksjoner",
                        questions: [
                          "Var fargesystemet (grønn/gul/rød) intuitivt?",
                          "Ga analysepanelet deg nok innsikt til å forstå status?",
                          "Var handlingsplanen konkret nok til å følges?",
                          "Var prioriteringen av tiltak logisk og nyttig?",
                        ],
                      },
                      {
                        category: "Forbedringer",
                        questions: [
                          "Hvis du kunne endre én ting, hva ville det vært?",
                          "Hvilke ekstra funksjoner ville gjort dette mer nyttig?",
                          "Er det noen deler av prosessen som føltes unødvendige?",
                          "Hva ville fått deg til å velge dette over konkurrentene?",
                        ],
                      },
                      {
                        category: "Kontekst og integrering",
                        questions: [
                          "Hvordan ville dette passet inn i din eksisterende arbeidsflyt?",
                          "Hvilke andre verktøy ville du ønsket å integrere dette med?",
                          "Hvem andre i organisasjonen burde ha tilgang til dette?",
                          "Hvor ofte tror du ville brukt dette verktøyet?",
                        ],
                      },
                    ].map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-purple-900 mb-4 pb-2 border-b border-purple-100">
                          {section.category}
                        </h4>
                        <div className="space-y-3">
                          {section.questions.map((q, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <p className="text-slate-700">{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Avslutning
                    </h4>
                    <ul className="space-y-2 text-green-800">
                      <li>
                        • Takk deltakeren for tiden og verdifulle
                        tilbakemeldinger
                      </li>
                      <li>
                        • Spør om de har noen siste kommentarer eller tanker
                      </li>
                      <li>
                        • Forklar hva som skjer videre med tilbakemeldingene
                      </li>
                      <li>• Gi eventuelt kompensasjon (gavekort, etc.)</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* Tips og best practice */}
            <Card className="bg-purple-50 border-2 border-purple-200 p-6">
              <h3 className="text-purple-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Tips til testfasilitatoren
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-purple-800">✅ Gjør dette:</h4>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• Vær nøytral og ikke led brukeren</li>
                    <li>• Oppmuntre til "tenk høyt"</li>
                    <li>• Noter både verbale og non-verbale reaksjoner</li>
                    <li>• Spør "hvorfor?" for å forstå resonnementer</li>
                    <li>• Ta opp økten (med samtykke)</li>
                    <li>• Ha testdata klart på forhånd</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-purple-800">❌ Unngå dette:</h4>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    <li>• Forsvare designvalg</li>
                    <li>• Forklare hvordan ting "skal" brukes</li>
                    <li>• Avbryte brukerens tankeprosess</li>
                    <li>• Stille ledende spørsmål</li>
                    <li>• Hoppe over stillehet - la brukeren tenke</li>
                    <li>• Fokusere kun på positive tilbakemeldinger</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </>
  );
}
