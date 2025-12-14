export interface AnalysisResult {
    titulo_principal: string;
    pontuacao_confiabilidade: number;
    red_flags: string[];
    analise_detalhada: string;
}

export interface User {
    id: string;
    email: string;
    credits: number;
}

export type AppState = 'LANDING' | 'LOGIN' | 'DASHBOARD' | 'UPLOAD' | 'SCANNING' | 'LOCKED' | 'RESULT';

export interface TerminalLog {
    text: string;
    id: number;
}