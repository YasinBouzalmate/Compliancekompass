import { AlertCircle, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Filter, X, Info, Search, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useCompliance } from "../contexts/ComplianceContext";
import { generateActionPlan } from "../utils/actionPlanGenerator";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Panel2Props {
  onNext: () => void;
  onBack: () => void;
}

export function Panel2({ onNext, onBack }: Panel2Props) {
  const { setComplianceData, setScores, setGeneratedActions } = useCompliance();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to get color and status based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) {
      return { 
        color: "bg-green-500",
        textColor: "text-green-500", 
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "God dekning",
        labelColor: "text-green-700",
        icon: CheckCircle
      };
    } else if (percentage >= 50) {
      return { 
        color: "bg-yellow-500",
        textColor: "text-yellow-500", 
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Middels dekning",
        labelColor: "text-yellow-700",
        icon: AlertTriangle
      };
    } else {
      return { 
        color: "bg-red-500",
        textColor: "text-red-500", 
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Lav dekning",
        labelColor: "text-red-700",
        icon: AlertCircle
      };
    }
  };

  const scores = [
    { name: "Normen", percentage: 62 },
    { name: "ISO 27001", percentage: 45 },
    { name: "GDPR", percentage: 72 },
    { name: "ISO 13485", percentage: 38 },
    { name: "ISO 42001", percentage: 55 },
  ];

  const areas = [
    { name: "Tilgangsstyring", status: "yellow", description: "Mangler dokumentasjon" },
    { name: "Logging og overvåking", status: "red", description: "Ikke implementert" },
    { name: "Rutiner for leverandører", status: "red", description: "Mangler prosess" },
    { name: "Opplæring ansatte", status: "yellow", description: "Uregelmessig gjennomføring" },
    { name: "Dataminimering", status: "green", description: "God praksis" },
  ];

  // SoA Table data
  const soaData = [
    { id: 1, category: "Tilgangsstyring", control: "A.9.1.1 Tilgangskontrollpolicy", framework: "ISO 27001", status: "yellow", description: "Mangler formell policy", priority: "Høy", riskDetails: "Uten formell policy kan tilganger ikke styres systematisk. Risiko for uautorisert tilgang." },
    { id: 2, category: "Tilgangsstyring", control: "A.9.2.1 Brukerregistrering", framework: "ISO 27001", status: "green", description: "Implementert", priority: "Lav", riskDetails: "Kontroll er implementert og fungerer som forventet." },
    { id: 3, category: "Tilgangsstyring", control: "Krav 2.1 Tilgangsstyring", framework: "Normen", status: "yellow", description: "Delvis oppfylt", priority: "Høy", riskDetails: "Delvis implementert, men mangler enkelte deler av kravet. Kan påvirke godkjenning." },
    { id: 4, category: "Logging og overvåking", control: "A.12.4.1 Loggføring av hendelser", framework: "ISO 27001", status: "red", description: "Ikke implementert", priority: "Kritisk", riskDetails: "Uten logging kan sikkerhetshendelser ikke oppdages eller etterforskes. Brudd på flere rammeverk." },
    { id: 5, category: "Logging og overvåking", control: "Krav 3.2 Logging", framework: "Normen", status: "red", description: "Mangler loggrutiner", priority: "Kritisk", riskDetails: "Obligatorisk krav i Normen. Blokkerer sertifisering." },
    { id: 6, category: "Personvern", control: "Art. 5 Grunnprinsipper", framework: "GDPR", status: "green", description: "God praksis", priority: "Lav", riskDetails: "Grunnprinsipper er implementert korrekt." },
    { id: 7, category: "Personvern", control: "Art. 25 Innebygd personvern", framework: "GDPR", status: "yellow", description: "Kan forbedres", priority: "Middels", riskDetails: "Privacy by design/default kan forbedres. Risiko ved fremtidig tilsyn." },
    { id: 8, category: "Leverandørstyring", control: "A.15.1.1 Leverandøravtaler", framework: "ISO 27001", status: "red", description: "Mangler prosess", priority: "Høy", riskDetails: "Leverandørrisiko ikke kartlagt. Kan påvirke hele sikkerhetsstrukturen." },
    { id: 9, category: "Leverandørstyring", control: "Krav 5.1 Leverandørvurdering", framework: "Normen", status: "red", description: "Ikke etablert", priority: "Høy", riskDetails: "Tredjepartsrisiko ukjent. Ofte et krav i anbud og kontrakter." },
    { id: 10, category: "Opplæring", control: "A.7.2.2 Bevisstgjøring", framework: "ISO 27001", status: "yellow", description: "Uregelmessig", priority: "Middels", riskDetails: "Uregelmessig opplæring øker risiko for menneskelige feil og phishing." },
    { id: 11, category: "Opplæring", control: "Krav 4.3 Kompetanse", framework: "Normen", status: "yellow", description: "Mangler plan", priority: "Middels", riskDetails: "Manglende kompetanseplan kan føre til vedlikeholdsproblemer over tid." },
    { id: 12, category: "Kvalitet", control: "5.5.1 Ledelsens ansvar", framework: "ISO 13485", status: "green", description: "Implementert", priority: "Lav", riskDetails: "Ledelsens ansvar er tydelig definert og implementert." },
    { id: 13, category: "Kvalitet", control: "7.3.2 Designinndata", framework: "ISO 13485", status: "yellow", description: "Kan forbedres", priority: "Middels", riskDetails: "Designprosess kan standardiseres bedre for å sikre kvalitet." },
    { id: 14, category: "AI-styring", control: "5.1 AI-policy", framework: "ISO 42001", status: "red", description: "Ikke etablert", priority: "Høy", riskDetails: "Uten AI-policy kan ikke AI-risiko styres. Viktig for fremtidig regulering." },
    { id: 15, category: "AI-styring", control: "6.2 Risikovurdering AI", framework: "ISO 42001", status: "yellow", description: "Under utvikling", priority: "Høy", riskDetails: "AI-risikovurdering pågår, men ikke ferdigstilt. Haster med AI Act." },
  ];

  // Get unique categories and frameworks for filters
  const categories = ["all", ...Array.from(new Set(soaData.map(item => item.category)))];
  const frameworks = ["all", ...Array.from(new Set(soaData.map(item => item.framework)))];

  // Filter logic
  const filteredSoaData = soaData.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
    const frameworkMatch = selectedFramework === "all" || item.framework === selectedFramework;
    const searchMatch = searchQuery === "" || 
                        item.control.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && frameworkMatch && searchMatch;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedFramework("all");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedStatus !== "all" || selectedFramework !== "all" || searchQuery !== "";

  const getStatusDetails = (status: string) => {
    switch(status) {
      case "green": 
        return { 
          color: "border-green-500 bg-green-50", 
          icon: CheckCircle, 
          iconColor: "text-green-600",
          badge: "bg-green-500"
        };
      case "yellow": 
        return { 
          color: "border-yellow-500 bg-yellow-50", 
          icon: AlertTriangle, 
          iconColor: "text-yellow-600",
          badge: "bg-yellow-500"
        };
      case "red": 
        return { 
          color: "border-red-500 bg-red-50", 
          icon: AlertCircle, 
          iconColor: "text-red-600",
          badge: "bg-red-500"
        };
      default: 
        return { 
          color: "border-slate-300 bg-slate-50", 
          icon: AlertCircle, 
          iconColor: "text-slate-600",
          badge: "bg-slate-500"
        };
    }
  };

  const handleGenerateActionPlan = async () => {
    setIsGenerating(true);
    try {
      const actionPlan = await generateActionPlan(filteredSoaData);
      setGeneratedActions(actionPlan);
      toast.success("Handlingsplan generert!");
      onNext();
    } catch (error) {
      toast.error("Noe gikk galt ved generering av handlingsplan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-slate-800 mb-2">Oversikt og score</h2>
          <p className="text-slate-600">
            Her er en analyse av din compliance-status basert på dokumenter og svar.
          </p>
        </div>

        {/* Scores Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-slate-800">Compliance-dekning</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white border border-slate-300 text-black">
                <div className="space-y-2">
                  <p className="font-semibold text-black">Statusnivåer:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Grønn (70-100%):</strong> God dekning av kravene</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Gul (50-69%):</strong> Middels dekning, forbedring anbefales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Rød (0-49%):</strong> Lav dekning, handling nødvendig</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {scores.map((score) => {
              const colorDetails = getScoreColor(score.percentage);
              const StatusIcon = colorDetails.icon;
              return (
                <div key={score.name} className={`text-center border-2 rounded-lg p-4 ${colorDetails.borderColor} ${colorDetails.bgColor}`}>
                  <div className="relative w-32 h-32 mx-auto mb-3">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - score.percentage / 100)}`}
                        className={colorDetails.color.replace('bg-', 'text-')}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-slate-800">{score.percentage}%</span>
                      <span className="text-sm text-slate-500">dekket</span>
                    </div>
                  </div>
                  <p className="text-slate-800 mb-2">{score.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${colorDetails.textColor}`} />
                    <span className={`text-sm ${colorDetails.labelColor}`}>{colorDetails.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Areas Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-slate-800">Status per område</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg border border-slate-300 text-black">
                <div className="space-y-2">
                  <p className="font-semibold text-black">Statusforklaring:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Grønn:</strong> Krav oppfylt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Gul:</strong> Delvis oppfylt, forbedring nødvendig</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700"><strong className="text-black">Rød:</strong> Ikke oppfylt, må implementeres</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-3">
            {areas.map((area) => {
              const details = getStatusDetails(area.status);
              const Icon = details.icon;
              return (
                <div 
                  key={area.name}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${details.color}`}
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 ${details.iconColor}`} />
                  <div className="flex-1">
                    <p className="text-slate-800">{area.name}</p>
                    <p className="text-sm text-slate-600">{area.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${details.badge}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Matrix */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-slate-800">Risikomatrise</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white border border-slate-300 text-black">
                <div className="space-y-2">
                  <p className="font-semibold text-black">Om risikomatrisen:</p>
                  <p className="text-sm text-slate-700">Risikomatrisen viser compliance-områder basert på sannsynlighet for brudd og konsekvens.</p>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <p className="font-semibold text-sm mb-1 text-black">Risikonivåer:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: '#7FC97F' }} />
                        <span className="text-xs text-slate-700">Lav risiko - Akseptabelt nivå</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: '#FDC863' }} />
                        <span className="text-xs text-slate-700">Middels risiko - Planlegg tiltak</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: '#FDAE61' }} />
                        <span className="text-xs text-slate-700">Høy risiko - Krever handling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: '#D7191C' }} />
                        <span className="text-xs text-slate-700">Kritisk risiko - Umiddelbar handling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="relative overflow-x-auto">
            {/* Matrix Grid - 5x5 */}
            <div className="inline-grid grid-cols-6 gap-0 border border-slate-300 min-w-[700px]">
              {/* Top left corner cell */}
              <div className="bg-slate-100 border-r border-b border-slate-300 p-2 flex items-center justify-center w-32">
                <span className="text-xs text-slate-600">Konsekvens / Sannsynlighet</span>
              </div>
              
              {/* X-axis labels (Sannsynlighet) - Top row */}
              <div className="flex flex-col items-center justify-center py-2 bg-slate-100 border-r border-b border-slate-300">
                <span className="text-xs text-slate-700">1</span>
                <span className="text-xs text-slate-600">Svært lav</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 bg-slate-100 border-r border-b border-slate-300">
                <span className="text-xs text-slate-700">2</span>
                <span className="text-xs text-slate-600">Lav</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 bg-slate-100 border-r border-b border-slate-300">
                <span className="text-xs text-slate-700">3</span>
                <span className="text-xs text-slate-600">Middels</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 bg-slate-100 border-r border-b border-slate-300">
                <span className="text-xs text-slate-700">4</span>
                <span className="text-xs text-slate-600">Høy</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 bg-slate-100 border-b border-slate-300">
                <span className="text-xs text-slate-700">5</span>
                <span className="text-xs text-slate-600">Svært høy</span>
              </div>
              
              {/* Row 5 - Kritisk consequence */}
              <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-100 border-r border-b border-slate-300 w-32">
                <span className="text-xs text-slate-700">5</span>
                <span className="text-xs text-slate-600">Kritisk</span>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDAE61' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDAE61' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#D7191C' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center cursor-help">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 text-xs shadow-md">
                        L
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-slate-300 text-black">
                    <p className="text-sm"><strong>Logging og overvåking</strong></p>
                    <p className="text-xs text-slate-600">Kritisk risiko - Ikke implementert</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative h-20 p-2 border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#D7191C' }}>
              </div>
              
              {/* Row 4 - Alvorlig consequence */}
              <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-100 border-r border-b border-slate-300 w-32">
                <span className="text-xs text-slate-700">4</span>
                <span className="text-xs text-slate-600">Alvorlig</span>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDAE61' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDAE61' }}>
              </div>
              <div className="relative h-20 p-2 border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#D7191C' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center cursor-help">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 text-xs shadow-md">
                        R
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-slate-300 text-black">
                    <p className="text-sm"><strong>Rutiner for leverandører</strong></p>
                    <p className="text-xs text-slate-600">Kritisk risiko - Mangler prosess</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Row 3 - Moderat consequence */}
              <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-100 border-r border-b border-slate-300 w-32">
                <span className="text-xs text-slate-700">3</span>
                <span className="text-xs text-slate-600">Moderat</span>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center cursor-help">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 text-xs shadow-md">
                        D
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-slate-300 text-black">
                    <p className="text-sm"><strong>Dataminimering</strong></p>
                    <p className="text-xs text-slate-600">Lav risiko - God praksis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center cursor-help">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 text-xs shadow-md">
                        T
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-slate-300 text-black">
                    <p className="text-sm"><strong>Tilgangsstyring</strong></p>
                    <p className="text-xs text-slate-600">Middels risiko - Mangler dokumentasjon</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center cursor-help">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 text-xs shadow-md">
                        O
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-slate-300 text-black">
                    <p className="text-sm"><strong>Opplæring ansatte</strong></p>
                    <p className="text-xs text-slate-600">Middels risiko - Uregelmessig gjennomføring</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative h-20 p-2 border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDAE61' }}>
              </div>
              
              {/* Row 2 - Begrenset consequence */}
              <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-100 border-r border-b border-slate-300 w-32">
                <span className="text-xs text-slate-700">2</span>
                <span className="text-xs text-slate-600">Begrenset</span>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
              </div>
              <div className="relative h-20 p-2 border-b border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#FDC863' }}>
              </div>
              
              {/* Row 1 - Ubetydelig consequence */}
              <div className="flex flex-col items-center justify-center px-2 py-3 bg-slate-100 border-r border-slate-300 w-32">
                <span className="text-xs text-slate-700">1</span>
                <span className="text-xs text-slate-600">Ubetydelig</span>
              </div>
              <div className="relative h-20 p-2 border-r border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-r border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
              <div className="relative h-20 p-2 border-slate-200 transition-opacity hover:opacity-80" style={{ backgroundColor: '#7FC97F' }}>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md border border-slate-200">D</div>
              <span className="text-slate-700">Dataminimering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md border border-slate-200">T</div>
              <span className="text-slate-700">Tilgangsstyring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md border border-slate-200">O</div>
              <span className="text-slate-700">Opplæring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md border border-slate-200">L</div>
              <span className="text-slate-700">Logging</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md border border-slate-200">R</div>
              <span className="text-slate-700">Leverandører</span>
            </div>
          </div>
        </div>

        {/* SoA Table */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-slate-800">Statement of Applicability (SoA)</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-white border border-slate-300 text-black">
                    <div className="space-y-2">
                      <p className="text-sm text-black">SoA gir en detaljert oversikt over alle kontroller og krav fra de valgte rammeverkene, med status for hver enkelt kontroll.</p>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <p className="font-semibold text-sm mb-1 text-black">Status i tabellen:</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-slate-700">Grønn = Implementert</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-600" />
                            <span className="text-xs text-slate-700">Gul = Delvis/Forbedring nødvendig</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span className="text-xs text-slate-700">Rød = Ikke implementert</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-slate-600 mt-1">Detaljert oversikt over alle kontroller og krav</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="w-4 h-4" />
              <span>{filteredSoaData.length} av {soaData.length} kontroller</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-50 rounded-lg">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-600 mb-1 block">Søk</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søk i kontroller, beskrivelse..."
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Alle kategorier</option>
                {categories.filter(c => c !== "all").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Alle statuser</option>
                <option value="green">✓ Grønn (OK)</option>
                <option value="yellow">⚠ Gul (Advarsel)</option>
                <option value="red">✗ Rød (Kritisk)</option>
              </select>
            </div>

            {/* Framework Filter */}
            <div>
              <label className="text-xs text-slate-600 mb-1 block">Rammeverk</label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Alle rammeverk</option>
                {frameworks.filter(f => f !== "all").map(fw => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Nullstill
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Kontroll</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Kategori</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Rammeverk</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Beskrivelse</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Prioritet</th>
                </tr>
              </thead>
              <tbody>
                {filteredSoaData.map((item) => {
                  const details = getStatusDetails(item.status);
                  const Icon = details.icon;
                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-800">{item.control}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{item.category}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {item.framework}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${details.iconColor}`} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{item.description}</td>
                      <td className="py-3 px-4 text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`inline-block px-2 py-1 rounded text-xs cursor-help ${
                              item.priority === "Kritisk" ? "bg-red-100 text-red-700" :
                              item.priority === "Høy" ? "bg-orange-100 text-orange-700" :
                              item.priority === "Middels" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {item.priority}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-white border border-slate-300 text-black">
                            <div className="space-y-2">
                              <p className="font-semibold text-sm text-black">Risikodetaljer:</p>
                              <p className="text-xs text-slate-700">{item.riskDetails}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredSoaData.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Ingen kontroller matcher valgte filtre</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-purple-600 hover:text-purple-700 text-sm"
                >
                  Nullstill filtre
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h4 className="text-purple-900 mb-2">Automatisk analyse</h4>
          <p className="text-purple-800">
            Systemet har matchet dine svar og dokumenter mot kravene i de valgte rammeverkene. Du får rask oversikt uten å måtte lese hele Normen eller ISO-standarden manuelt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Tilbake
          </button>
          <button
            onClick={handleGenerateActionPlan}
            disabled={isGenerating}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Genererer..." : "Se handlingsplan"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}