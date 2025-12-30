
import React from 'react';
import { FileEdit, BookOpen } from 'lucide-react';

interface ClauseLibraryProps {
    activeTemplate: string;
    setActiveTemplate: (t: string) => void;
    clauseText: string;
    onSelectClause: (name: string) => void;
    templates: Record<string, string>;
}

const ClauseLibrary: React.FC<ClauseLibraryProps> = ({
    activeTemplate,
    setActiveTemplate,
    clauseText,
    onSelectClause,
    templates
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 flex items-center gap-2">
                    <BookOpen size={14} />
                    Active Template
                </div>
                <div className="p-5">
                    <select
                        className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3 text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-[#008751] outline-none transition-all cursor-pointer"
                        value={activeTemplate}
                        onChange={(e) => setActiveTemplate(e.target.value)}
                    >
                        <option>LMA Nigeria 2024 - Secured Term Facility</option>
                        <option>LMA Nigeria 2024 - Syndicated Multicurrency</option>
                        <option>CBN Prudential SME Template</option>
                        <option>FCCPC 2025 Consumer Finance</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 flex items-center gap-2">
                    <FileEdit size={14} />
                    Nigeria Clause Library
                </div>
                <div className="p-3 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {Object.keys(templates).map((c) => (
                        <button
                            key={c}
                            onClick={() => onSelectClause(c)}
                            className={`w-full text-left px-4 py-3 text-xs rounded-xl transition-all duration-200 flex items-center gap-3 ${clauseText === templates[c]
                                ? 'bg-emerald-50 text-[#008751] font-bold shadow-inner'
                                : 'text-emerald-900/60 hover:bg-emerald-50/50 hover:text-emerald-950'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${clauseText === templates[c] ? 'bg-[#008751] shadow-[0_0_5px_#008751]' : 'bg-emerald-200'}`}></div>
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClauseLibrary;
