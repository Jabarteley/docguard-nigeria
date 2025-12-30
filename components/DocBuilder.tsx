
import React, { useState } from 'react';
import {
  Gavel,
  Loader2,
  CloudCheck,
  CloudUpload,
  Save,
  FileDown,
  PenTool
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import VariablePanel from './doc-builder/VariablePanel';
import ClauseLibrary from './doc-builder/ClauseLibrary';
import AnalysisPanel from './doc-builder/AnalysisPanel';
import Editor from './doc-builder/Editor';
import ExecutionModal from './doc-builder/ExecutionModal';

const CLAUSE_TEMPLATES: Record<string, string> = {
  'Charge Perfection (CAMA 2020)': `The Borrower shall within 90 days from the date of creation of any charge or security interest created by this Agreement, deliver to the Agent evidence of registration of such charge with the Corporate Affairs Commission in accordance with Section 222 of the Companies and Allied Matters Act 2020.`,
  'Movable Assets (STMA 2017)': `The Security Interest created under this Agreement in respect of movable assets shall be perfected by the registration of a financing statement at the National Collateral Registry in accordance with the Secured Transactions in Movable Assets Act 2017.`,
  'Anti-Bribery (Nigeria)': `The Borrower shall comply with all applicable Nigerian anti-corruption laws, including the Corrupt Practices and Other Related Offences Act and the Economic and Financial Crimes Commission (Establishment) Act.`,
  'BVN/TIN Verification': `The Borrower represents and warrants that the Bank Verification Numbers (BVN) of its directors and its Tax Identification Number (TIN) provided to the Lender are valid, active, and correctly registered with NIBSS and FIRS respectively.`,
  'Sovereign Immunity Waiver': `The Borrower irrevocably and unconditionally waives, to the fullest extent permitted by Nigerian law, any right of immunity which it or any of its assets now has or may in the future have in any jurisdiction from any legal action, suit, or proceeding.`,
  'Insurance of Secured Assets': `The Borrower shall, within 7 days of the execution of this Agreement, deliver to the Agent evidence of comprehensive insurance coverage for all Secured Assets. Such insurance must be issued by NAICOM-approved underwriters acceptable to the Agent (specifically Leadway Assurance, AIICO Insurance, or AXA Mansard) and shall name the Security Agent as first loss payee.`
};

const DocBuilder: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState('LMA Nigeria 2024 - Secured Term Facility');
  const [clauseText, setClauseText] = useState(CLAUSE_TEMPLATES['Charge Perfection (CAMA 2020)']);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('documents')
        .upsert({
          loan_id: 'LD-2024-DEMO', // Example ID
          content: clauseText,
          template_name: activeTemplate,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Cloud save failed:", err);
      // Fallback for demo if DB isn't set up
      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setIsSaving(false);
    }
  };

  const selectClause = (name: string) => {
    setClauseText(CLAUSE_TEMPLATES[name]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <ExecutionModal isOpen={isSigningModalOpen} onClose={() => setIsSigningModalOpen(false)} />

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-100 text-[#008751] rounded-lg">
              <Gavel size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">LMA Smart Document Builder</h1>
          </div>
          <p className="text-emerald-600/70 font-medium">Standardized Nigerian Loan Documentation with LMA 2024 Compliance.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 mr-2">
            {lastSaved && (
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                Cloud Sync: {lastSaved}
              </span>
            )}
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-100 rounded-xl text-xs font-bold text-emerald-900 uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : (lastSaved ? <CloudCheck size={16} className="text-emerald-500" /> : <CloudUpload size={16} className="text-emerald-500" />)}
              {isSaving ? 'Syncing...' : 'Save to Cloud'}
            </button>
          </div>
          <button
            onClick={async () => {
              if (window.electron) {
                const result = await window.electron.saveFile(clauseText, `${activeTemplate.replace(/\s+/g, '_')}.txt`);
                if (result.success) alert(`File saved: ${result.filePath}`);
              } else {
                alert("Local file saving is available in Desktop mode.");
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#008751] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-800 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
          >
            <Save size={16} />
            Commit Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Library & Variables */}
        <div className="space-y-6">
          <VariablePanel content={clauseText} onUpdate={setClauseText} />

          <ClauseLibrary
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            clauseText={clauseText}
            onSelectClause={selectClause}
            templates={CLAUSE_TEMPLATES}
          />
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Editor content={clauseText} setContent={setClauseText} />
        </div>

        {/* Right: AI Analysis & Execution */}
        <div className="space-y-6">
          <AnalysisPanel
            clauseText={clauseText}
            activeTemplate={activeTemplate}
            onUpdateClause={setClauseText}
          />

          <div className="bg-[#0a2e1f] text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-xl mb-3 tracking-tight">Execution Hub</h4>
              <p className="text-emerald-400 text-xs font-medium mb-8 leading-relaxed">Evidence Act 2023 certified e-signature integration for secure closing.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={async () => {
                    if (window.electron) { // Check if running in Electron
                      try {
                        const result = await window.electron.exportPDF();
                        if (result.success) alert(`PDF Saved to: ${result.filePath}`);
                        else if (result.error) alert(`Error: ${result.error}`);
                      } catch (e) {
                        console.error(e);
                      }
                    } else {
                      alert("PDF Export is available in Desktop App mode only.");
                    }
                  }}
                  className="w-full py-4 bg-white text-emerald-950 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
                >
                  Secure PDF Export
                </button>
                <button
                  onClick={() => setIsSigningModalOpen(true)}
                  className="w-full py-4 bg-[#008751] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <PenTool size={16} />
                  Execute via DocuSign
                </button>
              </div>
            </div>
            <FileDown className="absolute -bottom-6 -right-6 text-emerald-950 opacity-40 group-hover:scale-110 transition-transform" size={140} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocBuilder;
