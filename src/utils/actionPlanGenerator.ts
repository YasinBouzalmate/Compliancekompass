// Utility for generating action plan based on compliance analysis

export interface ComplianceControl {
  id: number;
  category: string;
  control: string;
  framework: string;
  status: string;
  description: string;
  priority: string;
  riskDetails: string;
}

export interface GeneratedAction {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  riskLevel: string;
  consequence: string;
  relatedFrameworks: string[];
  impact: string;
  category: string;
  sourceControl: string;
}

// Threshold for identifying low scores
const SCORE_THRESHOLD = 70; // Areas below this percentage are considered "low"

// Standard action templates mapped to control categories
const ACTION_TEMPLATES: Record<string, {
  title: string;
  impact: string;
  deadline: (priority: string) => string;
}> = {
  "Tilgangsstyring": {
    title: "Etablere formell policy for tilgangskontroll",
    impact: "Systematisk tilgangsstyring, reduserer risiko for uautorisert tilgang",
    deadline: (priority: string) => priority === "Kritisk" || priority === "Høy" ? "Mars 2026" : "Juni 2026"
  },
  "Logging og overvåking": {
    title: "Implementere rutiner for loggføring og overvåking",
    impact: "Muliggjør oppdagelse av sikkerhetshendelser og etterforskning",
    deadline: (priority: string) => "April 2026" // Always high priority
  },
  "Leverandørstyring": {
    title: "Etablere prosess for leverandørvurdering og -styring",
    impact: "Kartlegger og reduserer tredjepartsrisiko",
    deadline: (priority: string) => priority === "Kritisk" || priority === "Høy" ? "Mai 2026" : "Juni 2026"
  },
  "Opplæring": {
    title: "Opprette plan for regelmessig sikkerhetstrening",
    impact: "Øker bevissthet og reduserer menneskelige feil",
    deadline: (priority: string) => "Juni 2026"
  },
  "Personvern": {
    title: "Forbedre personvernprosesser og -dokumentasjon",
    impact: "Styrker personvernpraksis og compliance med GDPR",
    deadline: (priority: string) => priority === "Kritisk" || priority === "Høy" ? "April 2026" : "Q3 2026"
  },
  "Kvalitet": {
    title: "Standardisere kvalitetsprosesser og dokumentasjon",
    impact: "Sikrer konsistent kvalitet i produkter og prosesser",
    deadline: (priority: string) => "Q3 2026"
  },
  "AI-styring": {
    title: "Utvikle AI-policy og risikovurderingsrammeverk",
    impact: "Forbereder organisasjonen for AI Act og fremtidig regulering",
    deadline: (priority: string) => priority === "Høy" ? "Juni 2026" : "Q4 2026"
  }
};

/**
 * Identifies controls with low scores (status red or yellow, or priority Kritisk/Høy)
 */
export function identifyLowScoreAreas(controls: ComplianceControl[]): ComplianceControl[] {
  return controls.filter(control => {
    const hasLowStatus = control.status === "red" || control.status === "yellow";
    const hasHighPriority = control.priority === "Kritisk" || control.priority === "Høy";
    
    return hasLowStatus && hasHighPriority;
  });
}

/**
 * Identifies frameworks with scores below threshold
 */
export function identifyLowScoreFrameworks(
  scores: { name: string; percentage: number }[]
): string[] {
  return scores
    .filter(score => score.percentage < SCORE_THRESHOLD)
    .map(score => score.name);
}

/**
 * Maps priority string to action priority
 */
function mapPriority(priority: string): "high" | "medium" | "low" {
  switch(priority) {
    case "Kritisk":
      return "high";
    case "Høy":
      return "high";
    case "Middels":
      return "medium";
    case "Lav":
      return "low";
    default:
      return "medium";
  }
}

/**
 * Determines category based on deadline and priority
 */
function determineCategory(priority: "high" | "medium" | "low", deadline: string): string {
  if (priority === "high" && (deadline.includes("Mars") || deadline.includes("April") || deadline.includes("Mai"))) {
    return "Må før pilot 2026";
  } else if (priority === "high" || priority === "medium") {
    return "Må før anbud";
  } else {
    return "Kan tas senere";
  }
}

/**
 * Generates actions for identified low-score controls
 */
export function generateActionsFromControls(
  controls: ComplianceControl[]
): GeneratedAction[] {
  const lowScoreControls = identifyLowScoreAreas(controls);
  const actions: GeneratedAction[] = [];
  const processedCategories = new Set<string>();

  // Group controls by category to avoid duplicate actions
  const controlsByCategory = lowScoreControls.reduce((acc, control) => {
    if (!acc[control.category]) {
      acc[control.category] = [];
    }
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, ComplianceControl[]>);

  // Generate one action per category with combined framework references
  Object.entries(controlsByCategory).forEach(([category, categoryControls]) => {
    const template = ACTION_TEMPLATES[category];
    
    if (!template || processedCategories.has(category)) {
      return;
    }

    // Use the highest priority control in the category
    const highestPriorityControl = categoryControls.reduce((highest, current) => {
      const priorityOrder = { "Kritisk": 4, "Høy": 3, "Middels": 2, "Lav": 1 };
      const currentPriority = priorityOrder[current.priority as keyof typeof priorityOrder] || 0;
      const highestPriority = priorityOrder[highest.priority as keyof typeof priorityOrder] || 0;
      return currentPriority > highestPriority ? current : highest;
    }, categoryControls[0]);

    const actionPriority = mapPriority(highestPriorityControl.priority);
    const deadline = template.deadline(highestPriorityControl.priority);
    const categoryType = determineCategory(actionPriority, deadline);

    // Collect all related frameworks and controls
    const relatedFrameworks = categoryControls.map(c => c.control);
    const sourceControls = categoryControls.map(c => `${c.framework} - ${c.control}`).join("; ");

    actions.push({
      id: `generated-${Date.now()}-${category}`,
      title: template.title,
      responsible: "CTO",
      deadline: deadline,
      priority: actionPriority,
      riskLevel: highestPriorityControl.priority,
      consequence: highestPriorityControl.riskDetails,
      relatedFrameworks: relatedFrameworks,
      impact: template.impact,
      category: categoryType,
      sourceControl: sourceControls
    });

    processedCategories.add(category);
  });

  return actions;
}

/**
 * Sorts actions by priority and deadline
 */
export function sortActionsByPriority(actions: GeneratedAction[]): GeneratedAction[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  
  return [...actions].sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by deadline (earlier first)
    return a.deadline.localeCompare(b.deadline);
  });
}

/**
 * Main function to generate complete action plan
 */
export function generateActionPlan(
  controls: ComplianceControl[],
  scores?: { name: string; percentage: number }[]
): GeneratedAction[] {
  const actions = generateActionsFromControls(controls);
  const sortedActions = sortActionsByPriority(actions);
  
  return sortedActions;
}