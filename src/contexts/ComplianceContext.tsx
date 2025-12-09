import { createContext, useContext, useState, ReactNode } from "react";
import { ComplianceControl, GeneratedAction } from "../utils/actionPlanGenerator";

interface ComplianceContextType {
  complianceData: ComplianceControl[];
  scores: { name: string; percentage: number }[];
  generatedActions: GeneratedAction[];
  setComplianceData: (data: ComplianceControl[]) => void;
  setScores: (scores: { name: string; percentage: number }[]) => void;
  setGeneratedActions: (actions: GeneratedAction[]) => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export function ComplianceProvider({ children }: { children: ReactNode }) {
  const [complianceData, setComplianceData] = useState<ComplianceControl[]>([]);
  const [scores, setScores] = useState<{ name: string; percentage: number }[]>([]);
  const [generatedActions, setGeneratedActions] = useState<GeneratedAction[]>([]);

  return (
    <ComplianceContext.Provider
      value={{
        complianceData,
        scores,
        generatedActions,
        setComplianceData,
        setScores,
        setGeneratedActions,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error("useCompliance must be used within a ComplianceProvider");
  }
  return context;
}
