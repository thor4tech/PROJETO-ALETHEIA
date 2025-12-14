import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';

interface TerminalProps {
    logs: TerminalLog[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#333] p-4 rounded-md font-mono text-xs md:text-sm h-48 overflow-y-auto opacity-80 shadow-inner">
            {logs.map((log) => (
                <div key={log.id} className="mb-1">
                    <span className="text-green-500 mr-2">➜</span>
                    <span className="text-[#A9A9A9]">{log.text}</span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};
