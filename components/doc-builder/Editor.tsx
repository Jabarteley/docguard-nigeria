
import React from 'react';
import { CheckCircle, Leaf } from 'lucide-react';

interface EditorProps {
    content: string;
    setContent: (val: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, setContent }) => {
    return (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-900/5 min-h-[650px] flex flex-col relative overflow-hidden">
            <div className="p-5 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/10">
                <div className="flex gap-2">
                    {['B', 'I', 'U'].map(btn => (
                        <button key={btn} className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 text-emerald-900/60 font-bold rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                            {btn}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-emerald-400">Chars: {content.length}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle size={14} /> Local Draft Sync
                    </span>
                </div>
            </div>
            <textarea
                className="flex-1 p-10 text-emerald-950 text-lg leading-relaxed outline-none resize-none font-medium placeholder:text-emerald-900/20"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                placeholder="Begin drafting your Nigerian compliance overlay..."
            />
            {/* Watermark */}
            <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none select-none">
                <Leaf size={180} className="text-[#008751]" />
            </div>
        </div>
    );
};

export default Editor;
