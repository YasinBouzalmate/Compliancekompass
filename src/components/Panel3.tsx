import { Download, User, Calendar, ArrowLeft, Bell, AlertTriangle, Info, Search, SlidersHorizontal, ArrowUpDown, X, Edit, Plus, Trash2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import echoMedicLogo from "figma:asset/61856fa87ca18fb2a0c20df6113cec96e4392d29.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useCompliance } from "../contexts/ComplianceContext";
import type { GeneratedAction } from "../utils/actionPlanGenerator";

interface Panel3Props {
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  riskLevel: string;
  consequence: string;
  relatedFrameworks: string[];
  impact: string;
}

interface TasksData {
  [category: string]: Task[];
}

export function Panel3({ onBack }: Panel3Props) {
  const { generatedActions } = useCompliance();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"deadline" | "priority" | "responsible">("priority");
  const [showFilters, setShowFilters] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [isNewTask, setIsNewTask] = useState(false);

  const initialTasks: TasksData = {
    "Må før pilot 2026": [
      { 
        id: "1",
        title: "Etablere rutine for tilgangsstyring", 
        responsible: "CTO",
        deadline: "Mars 2026",
        priority: "high",
        riskLevel: "Kritisk",
        consequence: "Kan ikke starte pilot uten tilgangskontroll. Potensielt brudd på GDPR og Normen.",
        relatedFrameworks: ["ISO 27001 A.9.1.1", "Normen Krav 2.1"],
        impact: "Blokkerer pilot-oppstart"
      },
      { 
        id: "2",
        title: "Dokumentere prosess for hendelseshåndtering", 
        responsible: "CTO",
        deadline: "April 2026",
        priority: "high",
        riskLevel: "Høy",
        consequence: "Manglende evne til å håndtere sikkerhetshendelser. Obligatorisk for ISO 27001.",
        relatedFrameworks: ["ISO 27001 A.16.1", "GDPR Art. 33"],
        impact: "Sertifiseringsrisiko"
      },
    ],
    "Må før anbud": [
      { 
        id: "3",
        title: "Plan for regelmessig opplæring av ansatte", 
        responsible: "CTO",
        deadline: "Juni 2026",
        priority: "medium",
        riskLevel: "Middels",
        consequence: "Redusert sikkerhetsnivå. Kan svekke tilbud i anbud.",
        relatedFrameworks: ["ISO 27001 A.7.2.2", "Normen Krav 4.3"],
        impact: "Konkurransefortrinn"
      },
      { 
        id: "4",
        title: "Gjennomføre leverandørgjennomgang", 
        responsible: "CTO",
        deadline: "Juni 2026",
        priority: "medium",
        riskLevel: "Middels",
        consequence: "Ukjent risiko fra tredjeparter. Ofte et krav i anbud.",
        relatedFrameworks: ["ISO 27001 A.15.1", "Normen Krav 5.1"],
        impact: "Anbudskrav"
      },
    ],
    "Kan tas senere": [
      { 
        id: "5",
        title: "Implementere avansert logging", 
        responsible: "",
        deadline: "Q4 2026",
        priority: "low",
        riskLevel: "Lav",
        consequence: "Begrenset sporbarhet, men ikke kritisk på kort sikt.",
        relatedFrameworks: ["ISO 27001 A.12.4.1"],
        impact: "Forbedring"
      },
      { 
        id: "6",
        title: "Utvide sikkerhetsdokumentasjon", 
        responsible: "",
        deadline: "Q4 2026",
        priority: "low",
        riskLevel: "Lav",
        consequence: "Langsiktig forbedring av compliance-nivå.",
        relatedFrameworks: ["ISO 27001 generelt"],
        impact: "Optimalisering"
      },
    ],
  };

  const [tasks, setTasks] = useState<TasksData>(initialTasks);

  // Convert generated actions to tasks and merge with initial tasks on mount or when generated actions change
  useEffect(() => {
    if (generatedActions && generatedActions.length > 0) {
      const convertedTasks: TasksData = {};
      
      // Initialize with empty arrays for all categories
      convertedTasks["Må før pilot 2026"] = [];
      convertedTasks["Må før anbud"] = [];
      convertedTasks["Kan tas senere"] = [];
      
      // Add generated actions
      generatedActions.forEach((action: GeneratedAction) => {
        const task: Task = {
          id: action.id,
          title: action.title,
          responsible: action.responsible,
          deadline: action.deadline,
          priority: action.priority,
          riskLevel: action.riskLevel,
          consequence: action.consequence,
          relatedFrameworks: action.relatedFrameworks,
          impact: action.impact
        };
        
        if (!convertedTasks[action.category]) {
          convertedTasks[action.category] = [];
        }
        convertedTasks[action.category].push(task);
      });
      
      setTasks(convertedTasks);
      toast.success(`${generatedActions.length} tiltak generert basert på analysen!`, {
        description: "Tiltakene er prioritert etter risiko og tidslinje."
      });
    }
  }, [generatedActions]);

  // Form state for editing
  const [formData, setFormData] = useState({
    title: "",
    responsible: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
    riskLevel: "",
    consequence: "",
    relatedFrameworks: "",
    impact: "",
    category: ""
  });

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Get all tasks as flat array for filtering/sorting
  const allTasks = Object.entries(tasks).flatMap(([category, categoryTasks]) => 
    categoryTasks.map(task => ({ ...task, category }))
  );

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.responsible?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    } else if (sortBy === "deadline") {
      return a.deadline.localeCompare(b.deadline);
    } else if (sortBy === "responsible") {
      return (a.responsible || "zzz").localeCompare(b.responsible || "zzz");
    }
    return 0;
  });

  // Group sorted tasks back into categories
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPriority("all");
    setSortBy("priority");
  };

  const hasActiveFilters = searchQuery !== "" || filterPriority !== "all" || sortBy !== "priority";

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500";
      case "low": return "border-l-green-500";
      default: return "border-l-slate-300";
    }
  };

  const handleOpenEditDialog = (task: Task, category: string) => {
    setEditingTask(task);
    setEditingCategory(category);
    setIsNewTask(false);
    setFormData({
      title: task.title,
      responsible: task.responsible,
      deadline: task.deadline,
      priority: task.priority,
      riskLevel: task.riskLevel,
      consequence: task.consequence,
      relatedFrameworks: task.relatedFrameworks.join(", "),
      impact: task.impact,
      category: category
    });
    setEditDialogOpen(true);
  };

  const handleOpenNewTaskDialog = (category: string) => {
    setIsNewTask(true);
    setEditingCategory(category);
    setEditingTask(null);
    setFormData({
      title: "",
      responsible: "",
      deadline: "",
      priority: "medium",
      riskLevel: "Middels",
      consequence: "",
      relatedFrameworks: "",
      impact: "",
      category: category
    });
    setEditDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) {
      toast.error("Tittel er påkrevd");
      return;
    }

    const frameworksArray = formData.relatedFrameworks
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (isNewTask) {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        responsible: formData.responsible,
        deadline: formData.deadline,
        priority: formData.priority,
        riskLevel: formData.riskLevel,
        consequence: formData.consequence,
        relatedFrameworks: frameworksArray,
        impact: formData.impact
      };

      setTasks(prev => ({
        ...prev,
        [formData.category]: [...(prev[formData.category] || []), newTask]
      }));

      toast.success("Nytt tiltak lagt til");
    } else if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        ...editingTask,
        title: formData.title,
        responsible: formData.responsible,
        deadline: formData.deadline,
        priority: formData.priority,
        riskLevel: formData.riskLevel,
        consequence: formData.consequence,
        relatedFrameworks: frameworksArray,
        impact: formData.impact
      };

      setTasks(prev => {
        const newTasks = { ...prev };
        
        // If category changed, move task to new category
        if (formData.category !== editingCategory) {
          // Remove from old category
          newTasks[editingCategory] = newTasks[editingCategory].filter(
            t => t.id !== editingTask.id
          );
          // Add to new category
          newTasks[formData.category] = [...(newTasks[formData.category] || []), updatedTask];
        } else {
          // Update in same category
          newTasks[editingCategory] = newTasks[editingCategory].map(t =>
            t.id === editingTask.id ? updatedTask : t
          );
        }
        
        return newTasks;
      });

      toast.success("Tiltak oppdatert");
    }

    setEditDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string, category: string) => {
    if (confirm("Er du sikker på at du vil slette dette tiltaket?")) {
      setTasks(prev => ({
        ...prev,
        [category]: prev[category].filter(t => t.id !== taskId)
      }));
      toast.success("Tiltak slettet");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // Add logo to header (left side)
    const img = new Image();
    img.src = echoMedicLogo;
    try {
      doc.addImage(img, 'PNG', 15, yPosition, 40, 10);
    } catch (error) {
      console.log('Could not add logo to PDF');
    }

    // Header metadata (right side)
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Slate-500
    const date = new Date().toLocaleDateString("nb-NO");
    const time = new Date().toLocaleTimeString("nb-NO", { hour: '2-digit', minute: '2-digit' });
    doc.text(`Dato: ${date} ${time}`, pageWidth - 15, yPosition + 3, { align: "right" });
    doc.text(`Bruker: CTO`, pageWidth - 15, yPosition + 7, { align: "right" });
    doc.text(`Dokument: Handlingsplan`, pageWidth - 15, yPosition + 11, { align: "right" });

    // Horizontal line under header
    yPosition += 15;
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    
    yPosition += 10;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(88, 28, 135); // Purple
    doc.text("Compliance-kompass", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 8;
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("Prioritert handlingsplan", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    const totalTasks = Object.values(tasks).flat().length;
    const highPriority = Object.values(tasks).flat().filter(t => t.priority === "high").length;
    doc.text(`Totalt ${totalTasks} tiltak (${highPriority} med høy prioritet)`, 20, yPosition);
    
    yPosition += 10;

    // Loop through categories
    Object.entries(groupedTasks).forEach(([category, categoryTasks]) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Category header
      doc.setFillColor(241, 245, 249); // Slate-100
      doc.rect(15, yPosition - 5, pageWidth - 30, 10, "F");
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(category, 20, yPosition);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${categoryTasks.length} tiltak`, pageWidth - 20, yPosition, { align: "right" });
      
      yPosition += 10;

      // Tasks in category
      categoryTasks.forEach((task, index) => {
        // Check if we need a new page
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        // Priority indicator
        const priorityColors = {
          high: [239, 68, 68],    // Red
          medium: [234, 179, 8],  // Yellow
          low: [34, 197, 94]      // Green
        };
        const color = priorityColors[task.priority as keyof typeof priorityColors] || [203, 213, 225];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(20, yPosition - 3, 2, 12, "F");

        // Task number
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`${index + 1}.`, 25, yPosition);

        // Task title
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        const titleLines = doc.splitTextToSize(task.title, pageWidth - 55);
        doc.text(titleLines, 32, yPosition);
        
        yPosition += titleLines.length * 5;

        // Responsible and deadline
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        if (task.responsible) {
          doc.text(`Ansvarlig: ${task.responsible}`, 32, yPosition);
          yPosition += 4;
        }
        doc.text(`Frist: ${task.deadline}`, 32, yPosition);
        
        yPosition += 8;
      });

      yPosition += 5;
    });

    // Footer on last page
    if (yPosition < 270) {
      yPosition = 270;
    } else {
      doc.addPage();
      yPosition = 270;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Generert av Compliance-kompass | Echomedic", pageWidth / 2, yPosition, { align: "center" });
    doc.text("Handlingsplanen oppdateres kontinuerlig ved nye krav", pageWidth / 2, yPosition + 5, { align: "center" });

    // Save the PDF
    doc.save(`Handlingsplan_${date.replace(/\./g, '-')}.pdf`);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationEmail) {
      setEmailSubmitted(true);
      setTimeout(() => {
        setEmailSubmitted(false);
        setNotificationEmail("");
      }, 3000);
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-slate-800 mb-2">Prioritert handlingsplan</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors mb-2">
                  <Info className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white border border-slate-300 text-black">
                <div className="space-y-2">
                  <p className="font-semibold text-black">Om handlingsplanen:</p>
                  <p className="text-sm text-slate-700">Tiltakene er organisert i tre kategorier basert på tidslinje og risiko:</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span className="text-xs text-slate-700"><strong className="text-black">Må før pilot 2026:</strong> Kritiske tiltak som må være på plass før pilot kan starte</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                      <span className="text-xs text-slate-700"><strong className="text-black">Må før anbud:</strong> Tiltak som styrker konkurranseevne i anbudsprosesser</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-xs text-slate-700"><strong className="text-black">Kan tas senere:</strong> Forbedringstiltak uten akutt tidspress</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <p className="text-xs text-slate-700"><strong className="text-black">Tips:</strong> Klikk på et tiltak for å se detaljert risikoinformasjon og relaterte krav.</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-slate-600">
            Konkrete tiltak prioritert etter risiko og tidslinje for pilot og anbud.
          </p>
          
          {generatedActions && generatedActions.length > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-green-900 mb-1">Automatisk generert plan</h4>
                <p className="text-green-800 text-sm">
                  Denne handlingsplanen er automatisk generert basert på områder med lav compliance-score fra analysen. Tiltakene er prioritert etter alvorlighetsgrad og relaterte krav.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søk i tiltak..."
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Toggle filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                showFilters 
                  ? "border-purple-500 bg-purple-50 text-purple-700" 
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtre
            </button>

            {/* Results counter */}
            <div className="text-sm text-slate-600">
              {filteredTasks.length} av {allTasks.length} tiltak
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-3 items-end">
              {/* Priority filter */}
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Prioritet</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Alle prioriteter</option>
                  <option value="high">🔴 Høy</option>
                  <option value="medium">🟡 Middels</option>
                  <option value="low">🟢 Lav</option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Sorter etter</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "deadline" | "priority" | "responsible")}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="priority">Prioritet</option>
                  <option value="deadline">Frist</option>
                  <option value="responsible">Ansvarlig</option>
                </select>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Nullstill
                </button>
              )}
            </div>
          )}
        </div>

        {/* Edit Mode Toggle Button - Prominent placement above tasks */}
        <div className="mb-6">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            size="lg"
            className={`w-full md:w-auto ${
              isEditMode 
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg" 
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl"
            } transition-all duration-200`}
          >
            <Edit className="w-5 h-5 mr-2" />
            {isEditMode ? "✓ Ferdig med redigering" : "Rediger og tilpass handlingsplan"}
          </Button>
          {isEditMode && (
            <p className="text-sm text-purple-700 mt-2 ml-1">
              💡 Klikk på blyant-ikonet for å redigere tiltak, eller søppelbøtte for å slette. Klikk &apos;Legg til nytt tiltak&apos; nederst i hver kategori.
            </p>
          )}
        </div>

        {/* Tasks Grid */}
        {Object.keys(groupedTasks).length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
              <div key={category} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                  <h3 className="text-slate-800">{category}</h3>
                  <p className="text-sm text-slate-500">{categoryTasks.length} tiltak</p>
                </div>
                <div className="p-4 space-y-3">
                  {categoryTasks.map((task) => (
                    <div key={task.id} className="relative">
                      {isEditMode && (
                        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDialog(task, category);
                            }}
                            className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id, category);
                            }}
                            className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`bg-white border-2 border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border-l-4 ${getPriorityColor(task.priority)} ${
                              selectedTasks.includes(task.id) ? 'ring-2 ring-purple-500' : ''
                            }`}
                            onClick={() => toggleTask(task.id)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="text-slate-800 flex-1">{task.title}</p>
                              <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                                task.priority === 'high' ? 'text-red-500' : 
                                task.priority === 'medium' ? 'text-yellow-500' : 
                                'text-green-500'
                              }`} />
                            </div>
                            
                            {task.responsible && (
                              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                <User className="w-4 h-4" />
                                <span>{task.responsible}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4" />
                              <span>{task.deadline}</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-white border border-slate-300 text-black" side="right">
                          <div className="space-y-3">
                            <div>
                              <p className="font-semibold mb-1 text-black">Risikonivå: {task.riskLevel}</p>
                              <p className="text-sm text-slate-700">{task.consequence}</p>
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                              <p className="font-semibold text-sm mb-1 text-black">Påvirkning:</p>
                              <p className="text-xs text-slate-700">{task.impact}</p>
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                              <p className="font-semibold text-sm mb-1 text-black">Relaterte krav:</p>
                              <div className="flex flex-wrap gap-1">
                                {task.relatedFrameworks.map((framework, idx) => (
                                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {framework}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
                {isEditMode && (
                  <div className="p-4">
                    <Button
                      onClick={() => handleOpenNewTaskDialog(category)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Legg til nytt tiltak
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 mb-6 text-center">
            <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-600 mb-2">Ingen tiltak matcher søket</p>
            <p className="text-sm text-slate-500 mb-4">Prøv å endre søkeord eller filtre</p>
            <button
              onClick={clearFilters}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Nullstill filtre
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h4 className="text-purple-900 mb-2">Levende handlingsplan</h4>
          <p className="text-purple-800">
            Handlingsplanen kan oppdateres kontinuerlig når nye krav eller standarder innføres. Du får alltid en konkret to-do-liste i stedet for bare en rapport.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-slate-800">{allTasks.length}</div>
            <p className="text-sm text-slate-600">Totalt tiltak</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-slate-800">{allTasks.filter(t => t.priority === 'high' || t.priority === 'medium').length}</div>
            <p className="text-sm text-slate-600">Høy/middels prioritet</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <div className="text-slate-800">{selectedTasks.length}</div>
            <p className="text-sm text-slate-600">Valgte tiltak</p>
          </div>
        </div>

        {/* Email Notification Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-blue-900 mb-2">Få varsler om endringer</h4>
              <p className="text-blue-800 text-sm mb-4">
                Motta e-postvarsel når tiltak endrer status, eller når nye tiltak legges til i handlingsplanen.
              </p>
              
              {!emailSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="din@epost.no"
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Bell className="w-4 h-4" />
                    Få varsler
                  </button>
                </form>
              ) : (
                <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-800">Varsler aktivert! Du vil motta e-post ved endringer.</p>
                </div>
              )}
            </div>
          </div>
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
            onClick={handleExportPDF}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Eksporter til PDF
          </button>
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isNewTask ? "Legg til nytt tiltak" : "Rediger tiltak"}
              </DialogTitle>
              <DialogDescription>
                {isNewTask ? "Oppgi detaljer for det nye tiltaket." : "Oppgi nye detaljer for tiltaket."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Tittel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="responsible">Ansvarlig</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="deadline">Frist</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="priority">Prioritet</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as "high" | "medium" | "low" })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                >
                  <option value="high">Høy</option>
                  <option value="medium">Middels</option>
                  <option value="low">Lav</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                >
                  <option value="Må før pilot 2026">Må før pilot 2026</option>
                  <option value="Må før anbud">Må før anbud</option>
                  <option value="Kan tas senere">Kan tas senere</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="riskLevel">Risikonivå</Label>
                <Input
                  id="riskLevel"
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="consequence">Konsekvens</Label>
                <Textarea
                  id="consequence"
                  value={formData.consequence}
                  onChange={(e) => setFormData({ ...formData, consequence: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="relatedFrameworks">Relaterte rammer (kommaseparert)</Label>
                <Input
                  id="relatedFrameworks"
                  value={formData.relatedFrameworks}
                  onChange={(e) => setFormData({ ...formData, relatedFrameworks: e.target.value })}
                  placeholder="ISO 27001 A.9.1.1, Normen Krav 2.1"
                  className="col-span-2"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="impact">Påvirkning</Label>
                <Textarea
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  className="col-span-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSaveTask}
                className="bg-green-600 hover:bg-green-700"
              >
                Lagre
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}