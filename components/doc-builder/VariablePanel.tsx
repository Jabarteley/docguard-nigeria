
import React, { useState, useEffect } from 'react';
import { Sliders, Check } from 'lucide-react';

interface VariablePanelProps {
    content: string;
    onUpdate: (newContent: string) => void;
}

const VariablePanel: React.FC<VariablePanelProps> = ({ content, onUpdate }) => {
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [foundVars, setFoundVars] = useState<string[]>([]);

    // Regex to find {{Variable}} or {{ Variable }}
    const VAR_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

    useEffect(() => {
        const matches = [...content.matchAll(VAR_REGEX)];
        const uniqueVars = Array.from(new Set(matches.map(m => m[1])));

        // Only update if vars changed to avoid loop
        if (JSON.stringify(uniqueVars) !== JSON.stringify(foundVars)) {
            setFoundVars(uniqueVars);
            // Initialize new vars with empty string if not already set
            setVariables(prev => {
                const next = { ...prev };
                uniqueVars.forEach(v => {
                    if (next[v] === undefined) next[v] = '';
                });
                return next;
            });
        }
    }, [content]);

    const handleChange = (key: string, val: string) => {
        setVariables(prev => ({ ...prev, [key]: val }));

        // Helper to replace ALL instances
        // We don't auto-replace in the main content onChange, we might want a "Apply" button 
        // OR we do a clever replace. for now, let's keep the content as template and only replace when user asks? 
        // Actually, "Smart Variables" usually implies live preview or filling a form.
        // Let's keep the variables in the side panel separate from the content text until "Applied" or just maintain state.
        // But the requirements say "auto-detect". 
    };

    const applyVariables = () => {
        let newContent = content;
        Object.entries(variables).forEach(([key, val]) => {
            if (val) {
                const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
                newContent = newContent.replace(regex, val);
            }
        });
        onUpdate(newContent);
    };

    if (foundVars.length === 0) return null;

    return (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden mb-6 animate-in slide-in-from-right-4">
            <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 flex items-center gap-2">
                <Sliders size={14} />
                Smart Variables
            </div>
            <div className="p-4 space-y-4">
                {foundVars.map(v => (
                    <div key={v}>
                        <label className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1.5">{v}</label>
                        <input
                            type="text"
                            value={variables[v] || ''}
                            onChange={(e) => handleChange(v, e.target.value)}
                            className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-lg p-2 text-xs font-medium text-emerald-950 focus:ring-1 focus:ring-[#008751] outline-none"
                            placeholder={`Enter ${v}...`}
                        />
                    </div>
                ))}
                <button
                    onClick={applyVariables}
                    className="w-full py-2 bg-[#008751] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={14} /> Apply All
                </button>
            </div>
        </div>
    );
};

export default VariablePanel;
