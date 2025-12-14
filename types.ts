export interface AnalysisResult {
    titulo_principal: string;
    pontuacao_confiabilidade: number;
    red_flags: string[];
    analise_detalhada: string;
}

export type AppState = 'LANDING' | 'UPLOAD' | 'SCANNING' | 'LOCKED' | 'RESULT';

export interface TerminalLog {
    text: string;
    id: number;
}
