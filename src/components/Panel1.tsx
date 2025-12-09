import { Upload, CheckCircle2, Info, Loader2, CheckSquare, Square, Plus, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";

interface Panel1Props {
  onNext: () => void;
}

export function Panel1({ onNext }: Panel1Props) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<
    string[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customFrameworks, setCustomFrameworks] = useState<Array<{
    id: string;
    label: string;
    desc: string;
    details: string;
  }>>([]);
  const [newFrameworkName, setNewFrameworkName] = useState("");
  const [showAddFramework, setShowAddFramework] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const frameworks = [
    {
      id: "normen",
      label: "Normen",
      desc: "Norm for informasjonssikkerhet i helse- og omsorgssektoren",
      details:
        "Normen er det viktigste styringsdokumentet for informasjonssikkerhet i norsk helse- og omsorgssektor. Den spesifiserer krav til hvordan virksomheter skal beskytte pasientopplysninger, inkludert tekniske, organisatoriske og administrative kontroller.",
    },
    {
      id: "gdpr",
      label: "GDPR",
      desc: "(General Data Protection Regulation) Personvernforordningen",
      details:
        "EU-forordning som regulerer behandling av personopplysninger. Setter krav til dataminimering, rettslig grunnlag, lagringstid, samtykke, rettigheter for registrerte og tekniske/organisatoriske sikkerhetstiltak.",
    },
    {
      id: "iso27001",
      label: "ISO 27001",
      desc: "Informasjonssikkerhet",
      details:
        "Global standard for etablering, drift og kontinuerlig forbedring av et styringssystem for informasjonssikkerhet (ISMS). Inneholder krav til risikostyring, policyer, tilgangsstyring, kryptering, hendelseshåndtering og kontinuitetsplanlegging.",
    },
    {
      id: "iso13485",
      label: "ISO 13485",
      desc: "Medisinsk utstyr - Kvalitetsstyringssystem",
      details:
        "Internasjonal standard for kvalitetssystemer til utvikling, produksjon og vedlikehold av medisinsk utstyr. Dekker risikostyring, dokumentasjon, testing, sporbarhet og kvalitet gjennom hele livssyklusen.",
    },
    {
      id: "iso42001",
      label: "ISO 42001",
      desc: "AI Management System - AIMs",
      details:
        "Ny internasjonal standard (2023) for styring av kunstig intelligens. Angir krav til ansvarlig og transparent bruk av AI, inkludert datasikkerhet, etikk, risikoanalyse, kvalitetskontroll og dokumentasjon.",
    },
  ];

  const toggleFramework = (framework: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework],
    );
  };

  const selectAllFrameworks = () => {
    setSelectedFrameworks(frameworks.map(f => f.id));
  };

  const clearAllFrameworks = () => {
    setSelectedFrameworks([]);
  };

  const addCustomFramework = () => {
    if (newFrameworkName.trim()) {
      const customId = `custom_${Date.now()}`;
      const newFramework = {
        id: customId,
        label: newFrameworkName.trim(),
        desc: "Tilpasset rammeverk",
        details: `Egendefinert rammeverk: ${newFrameworkName.trim()}`,
      };
      setCustomFrameworks([...customFrameworks, newFramework]);
      setSelectedFrameworks([...selectedFrameworks, customId]);
      setNewFrameworkName("");
      setShowAddFramework(false);
      
      toast.success("Rammeverk lagt til!", {
        description: `${newFrameworkName.trim()} er nå tilgjengelig.`,
        duration: 3000,
      });
    }
  };

  const removeCustomFramework = (id: string) => {
    setCustomFrameworks(customFrameworks.filter(f => f.id !== id));
    setSelectedFrameworks(selectedFrameworks.filter(f => f !== id));
  };

  const allFrameworks = [...frameworks, ...customFrameworks];

  const handleNext = () => {
    if (selectedFrameworks.length === 0) {
      setShowValidationError(true);
      toast.error("Velg minst ett rammeverk", {
        description: "Du må velge minst ett compliance-rammeverk for å fortsette.",
        duration: 4000,
      });
      return;
    }
    setShowValidationError(false);
    onNext();
  };

  const handleFileUpload = () => {
    if (uploadedFiles) {
      // If already uploaded, clicking again resets it
      setUploadedFiles(false);
    } else {
      // Start upload process
      setIsUploading(true);
      
      // Simulate upload time (2-3 seconds)
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFiles(true);
        
        // Show success toast
        toast.success("Dokumenter lastet opp!", {
          description: "3 filer ble lastet opp og analysert.",
          duration: 4000,
        });
      }, 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title Section */}
      <div className="mb-10">
        <h2 className="text-slate-800 mb-3">
          Velg rammeverk og del informasjon
        </h2>
        <p className="text-slate-600 text-lg">
          Velg ett eller flere compliance-rammeverk som er relevante for
          din virksomhet og last opp eksisterende dokumentasjon.
        </p>
      </div>

      <TooltipProvider>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Frameworks */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-slate-800">
                  Velg relevante rammeverk
                </h3>
                {selectedFrameworks.length > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {selectedFrameworks.length} valgt
                  </span>
                )}
              </div>
            </div>

            {/* Validation message */}
            {showValidationError && selectedFrameworks.length === 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">
                    Du må velge minst ett rammeverk for å fortsette
                  </p>
                </div>
              </div>
            )}
            
            {/* Select All / Clear All buttons */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={selectAllFrameworks}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                Velg alle
              </button>
              {selectedFrameworks.length > 0 && (
                <button
                  onClick={clearAllFrameworks}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Fjern alle
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {allFrameworks.map((framework) => {
                const isCustom = framework.id.startsWith('custom_');
                return (
                <label
                  key={framework.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFrameworks.includes(framework.id)
                      ? "border-purple-500 bg-purple-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFrameworks.includes(framework.id)}
                    onChange={() => toggleFramework(framework.id)}
                    className="mt-1 w-5 h-5 rounded border-2 border-slate-300 bg-white checked:bg-white checked:border-purple-600 checked:accent-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800">
                        {framework.label}
                      </span>
                      {isCustom && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          Tilpasset
                        </span>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            {framework.details}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeCustomFramework(framework.id);
                          }}
                          className="ml-auto text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {framework.desc}
                    </div>
                  </div>
                </label>
              );
              })}
            </div>

            {/* Add Custom Framework */}
            <div>
              {!showAddFramework ? (
                <button
                  onClick={() => setShowAddFramework(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Legg til eget rammeverk
                </button>
              ) : (
                <div className="p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
                  <label className="block text-sm text-slate-700 mb-2">
                    Navn på rammeverk
                  </label>
                  <input
                    type="text"
                    value={newFrameworkName}
                    onChange={(e) => setNewFrameworkName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addCustomFramework();
                      } else if (e.key === 'Escape') {
                        setShowAddFramework(false);
                        setNewFrameworkName("");
                      }
                    }}
                    placeholder="F.eks. NIS2, DORA, SOC 2..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addCustomFramework}
                      disabled={!newFrameworkName.trim()}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Legg til
                    </button>
                    <button
                      onClick={() => {
                        setShowAddFramework(false);
                        setNewFrameworkName("");
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Upload */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-slate-800 mb-6">
              Last opp dokumenter
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                uploadedFiles
                  ? "border-green-500 bg-green-50"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
              onClick={handleFileUpload}
            >
              {uploadedFiles ? (
                <div className="text-green-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                  <p>Dokumenter lastet opp</p>
                  <p className="text-sm mt-1 text-green-700">
                    3 filer
                  </p>
                </div>
              ) : isUploading ? (
                <div className="text-slate-500">
                  <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" />
                  <p className="text-slate-700">
                    Laster opp dokumenter
                  </p>
                  <p className="text-sm mt-1">
                    Policyer, risikoregister, avtaler osv.
                  </p>
                </div>
              ) : (
                <div className="text-slate-500">
                  <Upload className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-slate-700">
                    Last opp dokumenter
                  </p>
                  <p className="text-sm mt-1">
                    Policyer, risikoregister, avtaler osv.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-600 leading-relaxed">
                Du vil også besvare 10-15 spørsmål for å
                kartlegge dagens praksis.
              </p>
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Info Box */}
      <div className="mt-10 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-purple-900 mb-3">
          Lav terskel for oppstart
        </h4>
        <p className="text-purple-800 leading-relaxed">
          Systemet er designet for små team. Selv med kun 2
          personer i selskapet kan dere få oversikt over
          compliance-status og konkrete handlingsplaner.
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleNext}
          className={`px-10 py-4 rounded-lg transition-all shadow-md hover:shadow-lg ${
            selectedFrameworks.length === 0
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          Start kartlegging
        </button>
      </div>
    </div>
  );
}