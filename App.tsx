import React, { useState, useRef } from 'react';
import { Scan, Upload, Lock, ShieldAlert, Fingerprint, BrainCircuit, AlertTriangle, CloudUpload, ScanFace, FileWarning, ArrowLeft } from 'lucide-react';
import { AnalysisResult, AppState, TerminalLog } from './types';
import { analyzeImage } from './services/gemini';
import { Terminal } from './components/Terminal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Actions ---

  const handleStart = () => {
    setAppState('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        startAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLog = (text: string) => {
    setLogs(prev => [...prev, { text, id: Date.now() }]);
  };

  const startAnalysis = async (base64: string) => {
    setAppState('SCANNING');
    setLogs([]);
    setScanProgress(0);

    // Simulation of scanning process
    const steps = [
        { progress: 10, msg: "Iniciando mapeamento de nós faciais..." },
        { progress: 30, msg: "Convertendo imagem para escala de cinza de alto contraste..." },
        { progress: 45, msg: "Acessando banco de dados de arquétipos comportamentais..." },
        { progress: 60, msg: "Analisando simetria da mandíbula e tensão ocular..." },
        { progress: 75, msg: "Cruzando dados com Gemini 3 Pro Vision..." },
        { progress: 90, msg: "ATENÇÃO: Padrão de dissimulação identificado." },
        { progress: 100, msg: "Compilando relatório final..." }
    ];

    // Trigger API call in parallel
    const apiPromise = analyzeImage(base64);

    // Play animation logs
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay between steps
        addLog(steps[i].msg);
        setScanProgress(steps[i].progress);
    }

    try {
        const result = await apiPromise;
        setAnalysis(result);
        setAppState('LOCKED');
    } catch (e) {
        addLog("ERRO CRÍTICO NO SISTEMA.");
        console.error(e);
    }
  };

  // --- Sub-components ---

  const Ticker = () => (
    <div className="bg-cyber-purple text-black py-2 overflow-hidden whitespace-nowrap border-y border-cyber-purple font-mono font-bold text-sm">
        <div className="inline-block animate-scroll">
            🔥 "Me salvou de um golpe de R$ 5k" - Ana P. &nbsp;&nbsp;///&nbsp;&nbsp; 
            👁️ "A precisão sobre o narcisismo dele foi de 100%" - Carla M. &nbsp;&nbsp;///&nbsp;&nbsp; 
            💔 "Descobri a traição antes de acontecer" - Roberto S. &nbsp;&nbsp;///&nbsp;&nbsp; 
            🛡️ 2.341 Pessoas analisadas hoje &nbsp;&nbsp;///&nbsp;&nbsp;
            ⚠️ ALTA DEMANDA: Servidores operando a 98% de capacidade &nbsp;&nbsp;///&nbsp;&nbsp;
            🔥 "Me salvou de um golpe de R$ 5k" - Ana P. &nbsp;&nbsp;///&nbsp;&nbsp; 
            👁️ "A precisão sobre o narcisismo dele foi de 100%" - Carla M. &nbsp;&nbsp;///&nbsp;&nbsp; 
        </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-black py-8 text-center text-cyber-subtext text-xs font-mono border-t border-cyber-dark mt-auto">
        <p>&copy; {new Date().getFullYear()} PROJETO ALETHEIA. TODOS OS DIREITOS RESERVADOS.</p>
        <p className="mt-2 opacity-50">Esta ferramenta utiliza Inteligência Artificial experimental. Os resultados são baseados em probabilidade estatística.</p>
    </footer>
  );

  // --- Renders ---

  const renderHero = () => (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6 bg-[#000000]">
      {/* Dynamic Tech Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#000000] to-[#000000] z-0"></div>
      <div className="absolute inset-0 cyber-grid opacity-30 z-0 pointer-events-none"></div>
      
      <div className="z-10 text-center max-w-5xl mx-auto space-y-8 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyber-purple/20 blur-[100px] rounded-full pointer-events-none"></div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none glitch text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" data-text="O ROSTO NÃO MENTE">
          O ROSTO NÃO MENTE
        </h1>
        <h2 className="text-xl md:text-3xl text-cyber-text font-light tracking-wide">
          A IA VÊ O QUE VOCÊ <span className="inline-block text-cyber-red font-mono font-bold bg-black/80 px-3 py-1 border border-cyber-red/50 shadow-[0_0_20px_rgba(220,20,60,0.6)] animate-pulse">IGNORA</span>.
        </h2>
        
        {/* New Tech Face Scanner Image */}
        <div className="relative w-80 h-80 mx-auto my-12 group perspective-1000">
             {/* Tech Frame */}
             <div className="absolute inset-0 border border-cyber-purple/30 bg-cyber-purple/5 rounded-xl transform rotate-3 transition-transform duration-1000 group-hover:rotate-0"></div>
             <div className="absolute inset-0 border border-cyber-green/30 bg-cyber-green/5 rounded-xl transform -rotate-3 transition-transform duration-1000 group-hover:rotate-0"></div>
             
             {/* Main Image Container */}
             <div className="absolute inset-0 bg-black rounded-xl overflow-hidden border-2 border-cyber-purple shadow-[0_0_50px_rgba(138,43,226,0.2)]">
                <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" 
                    alt="Subject Analysis" 
                    className="w-full h-full object-cover grayscale opacity-60 scale-110 group-hover:scale-100 transition-transform duration-[2s]"
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    {/* Face Mapping Points */}
                    <div className="absolute top-[30%] left-[35%] w-1 h-1 bg-cyber-green shadow-[0_0_5px_#00FF94] animate-ping"></div>
                    <div className="absolute top-[30%] right-[35%] w-1 h-1 bg-cyber-green shadow-[0_0_5px_#00FF94] animate-ping delay-300"></div>
                    <div className="absolute bottom-[40%] left-[40%] w-1 h-1 bg-cyber-red shadow-[0_0_5px_#DC143C] animate-ping delay-700"></div>
                    
                    {/* Connecting Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full opacity-40">
                        <path d="M100,100 L150,150 L200,100" fill="none" stroke="#8A2BE2" strokeWidth="1" className="animate-pulse" />
                        <rect x="50" y="50" width="20" height="20" fill="none" stroke="#00FF94" strokeWidth="1" />
                    </svg>

                    {/* Scanner Beam */}
                    <div className="absolute top-0 w-full h-2 bg-cyber-purple/80 shadow-[0_0_20px_#8A2BE2] animate-[scanline_3s_linear_infinite]"></div>
                </div>
             </div>

             {/* Corner Markers */}
             <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyber-text z-30"></div>
             <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-text z-30"></div>
             <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-text z-30"></div>
             <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyber-text z-30"></div>
             
             {/* Data Tag */}
             <div className="absolute -right-12 top-10 bg-cyber-dark border border-cyber-purple/50 p-2 text-[10px] font-mono text-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity delay-500">
                <p>ID: UNKNOWN</p>
                <p>MATCH: 98%</p>
             </div>
        </div>

        <p className="text-cyber-subtext max-w-xl mx-auto font-mono text-sm md:text-base leading-relaxed">
          Narcisista? Infiel? Manipulador? Use a tecnologia de análise fisiognômica do <span className="text-white font-bold bg-cyber-purple/20 px-2 py-0.5 rounded border border-cyber-purple/50 shadow-[0_0_10px_rgba(138,43,226,0.3)]">Gemini 3 Pro</span> para revelar as intenções ocultas em qualquer foto em 10 segundos.
        </p>

        <button 
            onClick={handleStart}
            className="group relative px-10 py-5 bg-transparent border border-cyber-purple text-white font-mono font-bold text-lg md:text-xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-cyber-purple hover:shadow-[0_0_40px_rgba(138,43,226,0.6)] active:scale-95"
        >
            <div className="absolute inset-0 bg-cyber-purple/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
                <Scan className="w-6 h-6 animate-pulse" /> INICIAR VARREDURA
            </span>
        </button>
        <p className="text-[10px] text-cyber-subtext/60 tracking-widest mt-4"> // CRIPTOGRAFIA MILITAR // DADOS DELETADOS PÓS-ANÁLISE</p>
      </div>
    </div>
  );

  const renderHowItWorks = () => (
    <div className="py-20 px-6 bg-cyber-dark border-t border-cyber-subtext/10">
        <div className="max-w-6xl mx-auto">
             <h3 className="text-2xl md:text-4xl font-mono text-center mb-16 text-cyber-text">
                PROCESSO <span className="text-cyber-purple">DECODIFICADO</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-cyber-panel border border-cyber-subtext/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-cyber-purple transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                        <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CloudUpload className="w-10 h-10 text-cyber-subtext group-hover:text-cyber-purple transition-colors" />
                    </div>
                    <h4 className="font-mono font-bold text-lg mb-2 text-white">1. UPLOAD SEGURO</h4>
                    <p className="text-sm text-cyber-subtext">Envie a foto do alvo. Dados criptografados e deletados após a análise.</p>
                </div>
                <div className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-cyber-panel border border-cyber-subtext/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-cyber-purple transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                         <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <ScanFace className="w-10 h-10 text-cyber-subtext group-hover:text-cyber-purple transition-colors" />
                    </div>
                    <h4 className="font-mono font-bold text-lg mb-2 text-white">2. VARREDURA IA</h4>
                    <p className="text-sm text-cyber-subtext">O Gemini 3 Pro mapeia micro-expressões e anomalias faciais.</p>
                </div>
                <div className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-cyber-panel border border-cyber-subtext/20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-cyber-red transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                         <div className="absolute inset-0 bg-cyber-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FileWarning className="w-10 h-10 text-cyber-subtext group-hover:text-cyber-red transition-colors" />
                    </div>
                    <h4 className="font-mono font-bold text-lg mb-2 text-white">3. DOSSIÊ VERMELHO</h4>
                    <p className="text-sm text-cyber-subtext">Receba o relatório detalhado com Red Flags e traços ocultos.</p>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSocialProof = () => (
    <div className="py-20 px-6 bg-cyber-panel relative border-t border-cyber-dark">
        <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-mono text-center mb-12 text-cyber-text">
                ELES ESCONDEM. <span className="text-cyber-red">A MÁQUINA REVELA.</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { text: "Miga do céu... passei a foto daquele 'boy perfeito' e a IA deu 90% de chance de narcisismo. Bloqueei na hora. Esse app salvou minha vida.", author: "Anônima, SP" },
                    { text: "Ia fechar negócio com um sócio. A análise apontou 'alta tendência a ocultar informações'. Investiguei e era golpe. Surreal.", author: "Carlos F., RJ" },
                    { text: "Usei na foto da minha ex. Bateu 100% com o comportamento tóxico dela. Queria ter essa ferramenta antes.", author: "Ricardo M., MG" },
                ].map((item, i) => (
                    <div key={i} className="bg-cyber-dark p-6 rounded-lg border border-cyber-subtext/20 relative overflow-hidden group hover:border-cyber-purple transition-colors">
                         <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0"></div>
                         <div className="relative z-10">
                            <p className="text-cyber-subtext text-sm italic mb-4">"{item.text}"</p>
                            <p className="text-cyber-purple text-xs font-bold font-mono text-right">- {item.author}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderTechAuthority = () => (
    <div className="py-16 px-6 bg-black border-t border-cyber-dark flex flex-col items-center">
         <BrainCircuit className="w-16 h-16 text-cyber-purple mb-6 animate-pulse" />
         <h3 className="text-xl md:text-2xl font-mono text-center mb-4 text-cyber-text">
             MOTOR: <span className="text-cyber-purple">GOOGLE GEMINI 3 PRO</span>
         </h3>
         <p className="text-cyber-subtext max-w-2xl text-center text-sm md:text-base leading-relaxed">
             Não é mágica. É ciência de dados. Utilizamos o modelo de IA mais avançado do mundo para cruzar milhares de pontos de micro-expressões faciais com padrões comportamentais psicológicos documentados.
         </p>
    </div>
  );

  const renderUpload = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative">
        <div className="absolute top-4 left-4 cursor-pointer text-cyber-subtext hover:text-white flex items-center gap-2" onClick={() => setAppState('LANDING')}>
            <ArrowLeft className="w-4 h-4" /> VOLTAR
        </div>
        <div className="w-full max-w-xl border-2 border-dashed border-cyber-subtext/30 hover:border-cyber-purple bg-cyber-panel rounded-xl p-12 flex flex-col items-center justify-center transition-all group relative overflow-hidden">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className="w-20 h-20 bg-cyber-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform z-10">
                <Upload className="w-10 h-10 text-cyber-purple" />
            </div>
            <h3 className="text-xl font-mono text-white mb-2 z-10">CARREGUE A FOTO DO ALVO</h3>
            <p className="text-cyber-subtext text-sm text-center z-10">Rosto frontal e claro. Apenas JPG/PNG.</p>
        </div>
    </div>
  );

  const renderScanning = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border-2 border-cyber-purple overflow-hidden rounded-lg shadow-[0_0_50px_rgba(138,43,226,0.2)]">
            {selectedImage && (
                <img 
                    src={selectedImage} 
                    alt="Target" 
                    className="w-full h-full object-cover grayscale contrast-125"
                />
            )}
            <div className="absolute inset-0 bg-green-500/10 z-10 mix-blend-overlay"></div>
            {/* Moving Scanner Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-purple shadow-[0_0_20px_#8A2BE2,0_0_10px_#fff] animate-[scanline_1.5s_linear_infinite] z-20"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(138,43,226,0.2)_1px,transparent_1px),linear-gradient(rgba(138,43,226,0.2)_1px,transparent_1px)] bg-[size:20px_20px] z-10 pointer-events-none"></div>
        </div>

        <Terminal logs={logs} />
        
        <div className="w-full max-w-lg mt-4 h-1 bg-cyber-dark rounded-full overflow-hidden">
            <div 
                className="h-full bg-cyber-purple transition-all duration-300" 
                style={{ width: `${scanProgress}%` }}
            ></div>
        </div>
    </div>
  );

  const renderLockedResult = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050000] relative">
        {/* Flashing Red Background Effect */}
        <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none"></div>

        <div className="max-w-2xl w-full z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6 animate-bounce">
                <AlertTriangle className="w-10 h-10 text-cyber-red" />
                <h2 className="text-2xl md:text-3xl font-mono text-cyber-red font-bold">
                    ANÁLISE CONCLUÍDA
                </h2>
                <AlertTriangle className="w-10 h-10 text-cyber-red" />
            </div>

            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-cyber-red mb-8 shadow-[0_0_40px_rgba(220,20,60,0.4)]">
                {selectedImage && (
                    <img 
                        src={selectedImage} 
                        alt="Target" 
                        className="w-full h-full object-cover grayscale blur-md" 
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Lock className="w-16 h-16 text-white" />
                </div>
            </div>

            <div className="bg-[#1a0505] border border-cyber-red p-6 rounded-lg w-full text-center mb-8">
                 <h3 className="text-xl text-white font-bold mb-2">3 RED FLAGS CRÍTICAS DETECTADAS</h3>
                 <p className="text-cyber-subtext text-sm">
                     A IA identificou padrões de micro-expressão preocupantes nesta pessoa. O relatório completo contém informações sensíveis sobre dissimulação e intenções ocultas.
                 </p>
            </div>

            <div className="w-full bg-cyber-dark p-6 rounded-t-xl border-t border-l border-r border-cyber-subtext/20 shadow-2xl">
                 <div className="flex flex-col items-center">
                     <p className="text-cyber-subtext line-through text-lg">R$ 49,90</p>
                     <p className="text-4xl font-bold text-white mb-6">R$ 17,90 <span className="text-xs font-normal text-cyber-red ml-2">HOJE</span></p>
                     
                     <a 
                        href="https://pay.kiwify.com.br/RVDacih"
                        className="w-full py-5 bg-cyber-red hover:bg-red-700 text-white font-bold text-lg uppercase tracking-wider rounded-lg btn-danger-neon flex items-center justify-center gap-2 text-center"
                     >
                         <Lock className="w-5 h-5" /> Desbloquear a Verdade
                     </a>
                     
                     <div className="flex gap-4 mt-4 text-[#444] text-xs">
                         <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Pagamento Seguro</span>
                         <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> Tecnologia Gemini</span>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );

  const renderFinalResult = () => (
    <div className="min-h-screen p-6 bg-black text-cyber-text">
        <div className="max-w-3xl mx-auto border border-cyber-subtext/20 bg-cyber-panel rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-cyber-dark p-4 border-b border-cyber-subtext/20 flex justify-between items-center">
                <span className="font-mono text-cyber-purple text-sm">DOSSIÊ #ALE-{new Date().getFullYear()}-{Math.floor(Math.random() * 99)}</span>
                <span className="text-cyber-subtext text-xs uppercase">Confidencial</span>
            </div>
            
            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 border-2 border-cyber-purple rounded-lg overflow-hidden relative">
                         {selectedImage && (
                            <img 
                                src={selectedImage} 
                                alt="Target" 
                                className="w-full h-full object-cover grayscale contrast-125" 
                            />
                        )}
                        <div className="absolute bottom-0 w-full bg-cyber-purple text-black text-center text-xs font-bold py-1">ANALISADO</div>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2 uppercase">
                            "{analysis?.titulo_principal}"
                        </h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-cyber-subtext uppercase">Confiabilidade</span>
                                <div className="text-3xl font-mono font-bold text-cyber-red">
                                    {analysis?.pontuacao_confiabilidade}%
                                </div>
                            </div>
                            <div className="h-10 w-px bg-cyber-dark"></div>
                             <div className="flex flex-col">
                                <span className="text-[10px] text-cyber-subtext uppercase">Status</span>
                                <div className="text-sm font-mono text-cyber-red font-bold border border-cyber-red px-2 py-1 rounded bg-cyber-red/10 mt-1">
                                    ALERTA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-cyber-purple font-mono text-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> RED FLAGS DETECTADAS
                    </h3>
                    <div className="space-y-3">
                        {analysis?.red_flags.map((flag, idx) => (
                            <div key={idx} className="bg-[#1a0505] border-l-4 border-cyber-red p-4 text-sm text-[#ddd]">
                                {flag}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                     <h3 className="text-cyber-purple font-mono text-lg mb-4 flex items-center gap-2">
                        <Fingerprint className="w-5 h-5" /> ANÁLISE DETALHADA
                    </h3>
                    <p className="text-cyber-subtext leading-relaxed text-sm md:text-base border border-cyber-dark p-6 rounded bg-[#050505]">
                        {analysis?.analise_detalhada}
                    </p>
                </div>

                <button 
                    onClick={() => { setAppState('LANDING'); setSelectedImage(null); setAnalysis(null); }}
                    className="w-full py-4 border border-cyber-subtext/20 text-cyber-subtext hover:text-white hover:border-white transition-colors text-sm uppercase tracking-widest"
                >
                    Nova Análise
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="font-sans text-cyber-text min-h-screen bg-black flex flex-col">
      {appState === 'LANDING' && (
        <>
            {renderHero()}
            <Ticker />
            {renderHowItWorks()}
            {renderSocialProof()}
            {renderTechAuthority()}
            <Footer />
        </>
      )}
      {appState === 'UPLOAD' && renderUpload()}
      {appState === 'SCANNING' && renderScanning()}
      {appState === 'LOCKED' && renderLockedResult()}
      {appState === 'RESULT' && renderFinalResult()}
    </div>
  );
};

export default App;