import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_PROMPT_TEASER = `
ATUE COMO: Um Especialista em Fisiognomonia, Micro-expressões Faciais e Psicologia Comportamental Forense.

TAREFA: Analise a imagem anexada. Gere um "Dossiê de Personalidade TrueSight" agressivo, direto e baseado em probabilidades.

ESTRUTURA DE ANÁLISE OBRIGATÓRIA (Para compor os campos do JSON):

1. ÍNDICE DE RISCO (0 a 100%):
   - Estime um risco de Narcisismo, Infidelidade e Agressividade. (Seja polêmico, mas use termos como "Alta probabilidade baseada em traços").

2. ANÁLISE DOS OLHOS:
   - O que o formato e o olhar dizem sobre as intenções ocultas?

3. MICRO-EXPRESSÕES E SORRISO:
   - Analise se há congruência ou sinais de dissimulação.

4. TRAÇOS DE PERSONALIDADE:
   - Pontos Fortes (ex: Carisma, Liderança).
   - Pontos Sombrios (ex: Manipulação, Falta de Empatia).

5. VEREDITO FINAL DA IA:
   - Um resumo de 3 linhas sobre: "Devo confiar nessa pessoa?"

Tom de voz: Científico, frio, analítico e "Black Mirror".

IMPORTANTE:
- Adicione o seguinte disclaimer no final da análise: "Nota: Análise baseada em padrões visuais e probabilidades estatísticas, não constitui diagnóstico clínico."
- Você DEVE estruturar a resposta EXATAMENTE no formato JSON solicitado abaixo.
`;

const SYSTEM_PROMPT_REAL = `
Analise esta face e procure traços de agressividade, narcisismo e infidelidade. Seja técnico e direto. Responda em tópicos.
`;

export const analyzeImage = async (base64Image: string, isRealAnalysis: boolean = false): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const prompt = isRealAnalysis 
        ? "Analise esta face e procure traços de agressividade, narcisismo e infidelidade. Seja técnico e direto. Responda em tópicos. Formate a saída como JSON compatível com a estrutura solicitada."
        : "Gere o Dossiê de Personalidade TrueSight para esta face seguindo rigorosamente as instruções de sistema.";

    const systemInstruction = isRealAnalysis ? SYSTEM_PROMPT_REAL : SYSTEM_PROMPT_TEASER;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                titulo_principal: { type: Type.STRING },
                pontuacao_confiabilidade: { type: Type.NUMBER },
                red_flags: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                analise_detalhada: { type: Type.STRING }
            },
            required: ["titulo_principal", "pontuacao_confiabilidade", "red_flags", "analise_detalhada"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AnalysisResult;
    } else {
        throw new Error("No response text from Gemini");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock data in case of API failure (or missing key in demo)
    return {
        titulo_principal: "ERRO DE LEITURA / DISSIMULAÇÃO EXTREMA",
        pontuacao_confiabilidade: 12,
        red_flags: [
            "Falha na API ou Bloqueio de Segurança",
            "Padrão facial inconclusivo",
            "Possível uso de tecnologia anti-vigilância"
        ],
        analise_detalhada: "O sistema não conseguiu processar os dados biométricos com precisão. Isso geralmente ocorre quando o sujeito utiliza técnicas de ofuscação ou quando a chave de API do sistema está inativa. Tente novamente."
    };
  }
};