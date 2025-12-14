import React, { useState, useRef, useEffect } from 'react';
import { Scan, Upload, Lock, ShieldAlert, Fingerprint, BrainCircuit, AlertTriangle, CloudUpload, ScanFace, FileWarning, ArrowLeft, Unlock, CheckCircle, LogIn, Zap, User as UserIcon, X, Search, Settings, Save } from 'lucide-react';
import { AnalysisResult, AppState, TerminalLog, User } from './types';
import { analyzeImage } from './services/gemini';
import { Terminal } from './components/Terminal';
import { db } from './services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Imagem de "Rosto Maligno/Demoníaco" para o efeito de Jump Scare
const EVIL_FACE_URL = "https://images.unsplash.com/photo-1580718559078-43890f845025?q=80&w=1000&auto=format&fit=crop";

// --- Social Proof Component ---
const SocialToast = () => {
    const [toast, setToast] = useState<{name: string, loc: string, action: string} | null>(null);
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const names = ["Júlia M.", "Roberto S.", "Carla F.", "Lucas P.", "Fernanda A.", "Marcos T.", "Larissa C.", "Pedro H."];
      const locs = ["RJ", "SP", "MG", "RS", "BA", "SC", "PE", "PR"];
      const actions = [
          "acabou de detectar um perfil de Risco Alto",
          "desbloqueou o dossiê completo",
          "descobriu sinais de narcisismo",
          "confirmou 98% de chance de traição",
          "recebeu o alerta de dissimulação"
      ];
  
      const showToast = () => {
          const name = names[Math.floor(Math.random() * names.length)];
          const loc = locs[Math.floor(Math.random() * locs.length)];
          const action = actions[Math.floor(Math.random() * actions.length)];
          setToast({ name, loc, action });
          setVisible(true);
          setTimeout(() => setVisible(false), 4000);
      };
  
      // First toast after 5s, then every 15s
      const initialTimer = setTimeout(showToast, 5000);
      const interval = setInterval(showToast, 15000);
  
      return () => {
          clearTimeout(initialTimer);
          clearInterval(interval);
      };
    }, []);
  
    if (!visible || !toast) return null;
  
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-[#0a0a0a] border-l-4 border-cyber-green p-4 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] max-w-[80%] md:max-w-xs animate-slide-up backdrop-blur-md">
          <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse mt-1.5 shrink-0"></div>
              <div>
                  <p className="text-[10px] text-cyber-subtext uppercase font-mono">Prova Social em Tempo Real</p>
                  <p className="text-xs text-white font-mono leading-tight">
                      <span className="font-bold text-cyber-green">📍 {toast.name} ({toast.loc})</span> {toast.action}.
                  </p>
              </div>
          </div>
      </div>
    );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [shaking, setShaking] = useState(false); // iOS Screen Shake State
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [analyzingReal, setAnalyzingReal] = useState(false);
  
  // Settings / Password Change State
  const [showSettings, setShowSettings] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const isAdmin = user?.email === 'thor4tech@gmail.com';

  // --- Actions ---

  const handleStart = () => {
    setAppState('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("PIXEL: Lead (Foto Carregada)"); // Simulated Pixel Event
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        
        if (appState === 'DASHBOARD') {
            // In dashboard mode, we just set the image, don't auto start fake analysis
            setAnalysis(null);
        } else {
            // Landing page flow -> Scanning -> Sales Page
            startAnalysis(base64);
        }
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

    // Simulation of scanning process with Haptic Feedback triggers
    const steps = [
        { progress: 10, msg: "Iniciando mapeamento de nós faciais...", vibrate: [50] },
        { progress: 30, msg: "Convertendo imagem para escala de cinza de alto contraste...", vibrate: [50] },
        { progress: 45, msg: "Acessando banco de dados de arquétipos comportamentais...", vibrate: [100] },
        { progress: 60, msg: "Analisando simetria da mandíbula e tensão ocular...", vibrate: [50, 50] },
        { progress: 75, msg: "Cruzando dados com Gemini 3 Pro Vision...", vibrate: [100] },
        { progress: 90, msg: "⚠️ ATENÇÃO: Padrão de dissimulação identificado.", vibrate: [500, 100, 500], shake: true },
        { progress: 100, msg: "Compilando relatório final...", vibrate: [50] }
    ];

    // Trigger API call in parallel (Fake mode)
    const apiPromise = analyzeImage(base64, false);

    // Play animation logs
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Delay between steps
        
        addLog(steps[i].msg);
        setScanProgress(steps[i].progress);
        
        // Haptic Feedback
        if (steps[i].vibrate && navigator.vibrate) {
            navigator.vibrate(steps[i].vibrate);
        }

        // Screen Shake Logic (iOS/Visual impact) + DEMON IMAGE TRIGGER
        if (steps[i].shake) {
            setShaking(true);
            setTimeout(() => setShaking(false), 800); // Slightly longer shake for the effect
        }
    }

    try {
        const result = await apiPromise;
        setAnalysis(result);
        console.log("PIXEL: InitiateCheckout"); // Simulated Pixel Event
        setAppState('LOCKED');
    } catch (e) {
        addLog("ERRO CRÍTICO NO SISTEMA.");
        console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoadingLogin(true);
      setLoginError("");

      try {
          // Lógica de Admin Hardcoded para testes se o banco falhar, 
          // mas idealmente ele deve existir no banco também.
          if (loginEmail === 'thor4tech@gmail.com') {
              // Pass through to query logic, but keep in mind rights are handled by 'isAdmin' const
          }

          const q = query(
              collection(db, "users"),
              where("email", "==", loginEmail),
              where("senha", "==", loginPass)
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
              throw new Error("Credenciais inválidas ou usuário não encontrado.");
          }

          const userDoc = querySnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() } as User;

          // Admin não precisa de créditos > 0
          if (userData.email !== 'thor4tech@gmail.com' && userData.credits <= 0) {
              alert("Sem créditos. Faça uma recarga.");
              window.location.href = "https://pay.kiwify.com.br/RVDacih"; // Link do seu checkout
              setLoadingLogin(false);
              return;
          }

          setUser(userData);
          setAppState('DASHBOARD');
      } catch (err: any) {
          console.error("Login error object:", err);
          
          if (err.code === 'permission-denied' || err.message?.includes("Missing or insufficient permissions")) {
              setLoginError("ERRO DE PERMISSÃO: Verifique as 'Firestore Rules' no Console do Firebase. Elas devem permitir leitura pública para este modo de login manual.");
          } else {
              setLoginError(err.message || "Erro ao conectar ao servidor.");
          }
      } finally {
          setLoadingLogin(false);
      }
  };

  const handleRealAnalysis = async () => {
      if (!selectedImage || !user) return;
      
      // Admin bypass credit check
      if (!isAdmin && user.credits <= 0) return;
      
      setAnalyzingReal(true);
      
      try {
          // 1. Call AI
          const result = await analyzeImage(selectedImage, true);
          
          // 2. Debit Credit (Skip if Admin)
          let newCredits = user.credits;
          if (!isAdmin) {
            const userRef = doc(db, "users", user.id);
            newCredits = user.credits - 1;
            await updateDoc(userRef, { credits: newCredits });
          }
          
          // 3. Update Local State
          setUser({ ...user, credits: newCredits });
          setAnalysis(result);
      } catch (err: any) {
          console.error(err);
          alert("Falha na análise: " + err.message);
      } finally {
          setAnalyzingReal(false);
      }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !newPassword) return;

      try {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, { senha: newPassword });
          setUser({ ...user, senha: newPassword } as any); // Update local state mostly for consistency
          setNewPassword("");
          setSaveMessage("Senha alterada com sucesso!");
          setTimeout(() => setSaveMessage(""), 3000);
      } catch (err: any) {
          console.error(err);
          setSaveMessage("Erro ao salvar senha.");
      }
  };

  const handleLogout = () => {
      setUser(null);
      setAppState('LANDING');
      setSelectedImage(null);
      setAnalysis(null);
      setShowSettings(false);
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
      
      {/* Hidden Input for Mobile Direct Action */}
      <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*" 
          className="hidden"
      />

      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
              <Scan className="text-cyber-green w-6 h-6" />
              <span className="font-mono font-bold text-lg tracking-widest text-white">TRUESIGHT_AI</span>
          </div>
          <button 
              onClick={() => setAppState('LOGIN')}
              className="border border-white/20 px-4 py-2 rounded text-xs font-mono text-white hover:bg-white/10 transition-all hover:border-cyber-green hover:text-cyber-green flex items-center gap-2"
          >
              <UserIcon className="w-4 h-4" /> ÁREA DE MEMBROS
          </button>
      </nav>

      <div className="z-10 text-center max-w-5xl mx-auto space-y-8 relative mt-20">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyber-purple/20 blur-[100px] rounded-full pointer-events-none"></div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none glitch text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" data-text="O ROSTO NÃO MENTE">
          O ROSTO NÃO MENTE
        </h1>
        <h2 className="text-xl md:text-3xl text-cyber-text font-light tracking-wide">
          A IA VÊ O QUE VOCÊ <span className="inline-block text-cyber-red font-mono font-bold bg-black/80 px-3 py-1 border border-cyber-red/50 shadow-[0_0_20px_rgba(220,20,60,0.6)] animate-pulse">IGNORA</span>.
        </h2>
        
        {/* Tech Face Scanner Image */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto my-12 group perspective-1000">
             {/* Tech Frame */}
             <div className="absolute inset-0 border border-cyber-purple/30 bg-cyber-purple/5 rounded-xl transform rotate-3 transition-transform duration-1000 group-hover:rotate-0"></div>
             <div className="absolute inset-0 border border-cyber-green/30 bg-cyber-green/5 rounded-xl transform -rotate-3 transition-transform duration-1000 group-hover:rotate-0"></div>
             
             {/* Main Image Container with Evil Animation */}
             <div className="absolute inset-0 bg-black rounded-xl overflow-hidden border-2 border-cyber-purple shadow-[0_0_50px_rgba(138,43,226,0.2)]">
                <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" 
                    alt="Subject Analysis" 
                    className="w-full h-full object-cover animate-evil-loop"
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    {/* Face Mapping Points */}
                    <div className="absolute top-[30%] left-[35%] w-1 h-1 bg-cyber-green shadow-[0_0_5px_#00FF94] animate-ping"></div>
                    <div className="absolute top-[30%] right-[35%] w-1 h-1 bg-cyber-green shadow-[0_0_5px_#00FF94] animate-ping delay-300"></div>
                    <div className="absolute bottom-[40%] left-[40%] w-1 h-1 bg-cyber-red shadow-[0_0_5px_#DC143C] animate-ping delay-700"></div>
                    
                    {/* Scanner Beam */}
                    <div className="absolute top-0 w-full h-2 bg-cyber-purple/80 shadow-[0_0_20px_#8A2BE2] animate-[scanline_3s_linear_infinite]"></div>
                </div>
             </div>
             
             {/* Data Tag */}
             <div className="absolute -right-8 top-10 bg-cyber-dark border border-cyber-purple/50 p-2 text-[10px] font-mono text-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity delay-500 hidden md:block">
                <p>ID: UNKNOWN</p>
                <p>MATCH: 98%</p>
             </div>
        </div>

        <p className="text-cyber-subtext max-w-xl mx-auto font-mono text-sm md:text-base leading-relaxed">
          Narcisista? Infiel? Manipulador? Use a tecnologia de análise fisiognômica do <span className="text-white font-bold bg-cyber-purple/20 px-2 py-0.5 rounded border border-cyber-purple/50 shadow-[0_0_10px_rgba(138,43,226,0.3)]">Gemini 3 Pro</span> para revelar as intenções ocultas em qualquer foto em 10 segundos.
        </p>

        <button 
            onClick={handleStart}
            className="group relative px-10 py-5 bg-transparent border border-cyber-purple text-white font-mono font-bold text-lg md:text-xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-cyber-purple active:scale-95 btn-neon animate-pulse"
        >
            <div className="absolute inset-0 bg-cyber-purple/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
                <Scan className="w-6 h-6" /> INICIAR VARREDURA
            </span>
        </button>
        <p className="text-[10px] text-cyber-subtext/60 tracking-widest mt-4"> // CRIPTOGRAFIA MILITAR // DADOS DELETADOS PÓS-ANÁLISE</p>
      </div>
      <SocialToast />
    </div>
  );

  const renderLogin = () => (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black relative">
          <div className="absolute top-4 left-4 cursor-pointer text-cyber-subtext hover:text-white flex items-center gap-2" onClick={() => setAppState('LANDING')}>
              <ArrowLeft className="w-4 h-4" /> VOLTAR
          </div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518544806308-c8f325ccb7cc?q=80&w=2000')] bg-cover opacity-10 pointer-events-none"></div>
          
          <div className="w-full max-w-md bg-cyber-panel border-t-4 border-cyber-green p-8 rounded-xl relative z-10 shadow-2xl backdrop-blur-xl bg-opacity-90">
              <div className="flex justify-between items-start mb-8">
                  <h2 className="text-3xl font-bold font-mono text-cyber-green">SYSTEM_LOGIN</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                      <label className="block text-xs font-mono text-gray-400 mb-2">IDENTIFICADOR (EMAIL)</label>
                      <input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-black/50 border border-gray-700 p-3 rounded focus:border-cyber-green focus:outline-none text-white font-mono"
                          placeholder="agente@truesight.ai"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-mono text-gray-400 mb-2">CHAVE DE ACESSO (SENHA)</label>
                      <input 
                          type="password" 
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          className="w-full bg-black/50 border border-gray-700 p-3 rounded focus:border-cyber-green focus:outline-none text-white font-mono"
                          placeholder="••••••••"
                          required
                      />
                  </div>

                  {loginError && (
                      <div className="p-3 bg-red-900/30 border border-cyber-red text-cyber-red text-xs font-mono flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {loginError}
                      </div>
                  )}

                  <button 
                      type="submit" 
                      disabled={loadingLogin}
                      className="w-full bg-cyber-green hover:bg-[#00cc76] text-black font-bold py-3 rounded transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                      {loadingLogin ? "AUTENTICANDO..." : "ACESSAR SISTEMA [ENTER]"}
                      {!loadingLogin && <LogIn className="w-4 h-4" />}
                  </button>
              </form>
          </div>
      </div>
  );

  const renderDashboard = () => (
      <div className="min-h-screen bg-black text-white p-4 font-sans relative">
          <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 max-w-6xl mx-auto pt-4">
              <div className="flex flex-col">
                  <span className="text-cyber-green font-mono font-bold text-lg tracking-wider">TRUESIGHT_V3</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              <div className="flex items-center gap-6">
                  <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded flex items-center gap-2">
                      <Zap className="text-yellow-400 w-4 h-4" />
                      <span className="font-mono font-bold text-white">
                        {isAdmin ? '∞ INFINITO' : `${user?.credits} CRÉDITOS`}
                      </span>
                  </div>
                  <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition-colors">
                      <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={handleLogout} className="text-xs text-cyber-red hover:text-red-400 font-mono">SAIR</button>
              </div>
          </header>

          {/* Settings Modal */}
          {showSettings && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <div className="bg-cyber-panel border border-cyber-purple p-6 rounded-xl w-full max-w-sm relative">
                      <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-xl font-mono text-cyber-purple mb-4 flex items-center gap-2">
                          <Settings className="w-5 h-5" /> CONFIGURAÇÕES
                      </h3>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                          <div>
                              <label className="block text-xs font-mono text-gray-400 mb-2">NOVA SENHA</label>
                              <input 
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Digite a nova senha"
                                  className="w-full bg-black border border-gray-700 p-2 rounded text-white focus:border-cyber-purple outline-none"
                              />
                          </div>
                          <button type="submit" className="w-full bg-cyber-purple text-black font-bold py-2 rounded hover:bg-purple-500 transition-colors flex items-center justify-center gap-2">
                              <Save className="w-4 h-4" /> SALVAR ALTERAÇÃO
                          </button>
                          {saveMessage && <p className="text-center text-xs text-cyber-green font-mono">{saveMessage}</p>}
                      </form>
                  </div>
              </div>
          )}

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coluna Esquerda: Upload e Preview */}
              <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] relative bg-gray-900/20 hover:border-cyber-green transition-colors cursor-pointer group">
                      <input 
                          type="file" 
                          onChange={handleFileChange} 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {selectedImage ? (
                          <img src={selectedImage} className="max-h-[250px] rounded shadow-lg object-cover" alt="Preview" />
                      ) : (
                          <>
                              <ScanFace className="w-16 h-16 text-gray-600 group-hover:text-cyber-green mb-4 transition-colors" />
                              <p className="text-gray-400 font-mono text-sm">ARRASTE A FOTO DO ALVO</p>
                          </>
                      )}
                  </div>

                  <button 
                      onClick={handleRealAnalysis}
                      disabled={!selectedImage || analyzingReal || (!isAdmin && (user?.credits || 0) <= 0)}
                      className="w-full bg-cyber-red hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded shadow-[0_0_15px_rgba(220,20,60,0.4)] transition-all font-mono tracking-wider flex justify-center items-center gap-2"
                  >
                      {analyzingReal ? (
                          <span className="animate-pulse">DECODIFICANDO MATRIZ...</span>
                      ) : (
                          <>
                              <Search className="w-5 h-5" /> EXECUTAR ANÁLISE {isAdmin ? '' : '(-1 CRÉDITO)'}
                          </>
                      )}
                  </button>
                  
                  {!isAdmin && (user?.credits || 0) <= 0 && (
                      <p className="text-cyber-red text-xs font-mono text-center">Saldo insuficiente. Recarregue para continuar.</p>
                  )}
              </div>

              {/* Coluna Direita: Resultado */}
              <div className="bg-[#0a0a0a] rounded-xl p-6 min-h-[400px] relative overflow-hidden border border-gray-800">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50"></div>
                  
                  {!analysis && !analyzingReal && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                          <Lock className="w-12 h-12 mb-2" />
                          <p className="font-mono text-sm">AGUARDANDO DADOS BIOMÉTRICOS</p>
                      </div>
                  )}

                  {analyzingReal && (
                      <div className="h-full flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 border-4 border-cyber-green border-t-transparent rounded-full animate-spin"></div>
                          <div className="font-mono text-cyber-green text-xs animate-pulse text-center">
                              <p>Mapeando micro-expressões...</p>
                              <p>Comparando com base de dados forense...</p>
                              <p>Gerando dossiê de personalidade...</p>
                          </div>
                      </div>
                  )}

                  {analysis && (
                      <div className="animate-slide-up h-full overflow-y-auto">
                          <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                              <FileWarning className="text-cyber-green w-5 h-5" />
                              <h3 className="font-mono font-bold text-cyber-green">DOSSIÊ GERADO</h3>
                          </div>
                          
                          <div className="space-y-4">
                              <div className="bg-gray-900 p-3 rounded border-l-2 border-cyber-red">
                                  <span className="text-xs text-gray-500 block">PERFIL</span>
                                  <span className="text-white font-bold">{analysis.titulo_principal}</span>
                              </div>

                              <div className="flex justify-between items-center bg-gray-900 p-3 rounded">
                                  <span className="text-xs text-gray-500">CONFIABILIDADE</span>
                                  <span className={`text-xl font-bold font-mono ${analysis.pontuacao_confiabilidade < 50 ? 'text-cyber-red' : 'text-cyber-green'}`}>
                                      {analysis.pontuacao_confiabilidade}%
                                  </span>
                              </div>

                              <div>
                                  <span className="text-xs text-gray-500 block mb-2">RED FLAGS</span>
                                  <div className="space-y-2">
                                      {analysis.red_flags.map((flag, i) => (
                                          <div key={i} className="text-xs bg-red-900/20 text-red-200 p-2 rounded border border-red-900/50 flex items-start gap-2">
                                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                              {flag}
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div>
                                  <span className="text-xs text-gray-500 block mb-2">ANÁLISE DETALHADA</span>
                                  <p className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                                      {analysis.analise_detalhada}
                                  </p>
                              </div>
                          </div>

                          <div className="mt-6 p-3 bg-red-900/10 border border-red-900/30 rounded text-[10px] text-gray-500 text-center">
                              NOTA: ESTA ANÁLISE É BASEADA EM PROBABILIDADES DE IA. NÃO CONSTITUI DIAGNÓSTICO CLÍNICO.
                          </div>
                      </div>
                  )}
              </div>
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
        <button onClick={() => setAppState('LANDING')} className="absolute top-6 left-6 text-gray-500 hover:text-white flex items-center gap-2 font-mono text-sm">
            <ArrowLeft className="w-4 h-4" /> VOLTAR
        </button>
        
        <div className="w-full max-w-xl text-center space-y-8">
            <ScanFace className="w-20 h-20 text-cyber-purple mx-auto animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-mono font-bold text-white glitch" data-text="UPLOAD_ALVO">UPLOAD_ALVO</h2>
            <p className="text-gray-400 font-mono text-sm">A I.A. precisa de uma foto clara do rosto. Óculos escuros podem interferir na leitura biométrica.</p>
            
            {/* Added onClick wrapper to ensure clicking the box triggers the hidden input */}
            <div 
                className="border-2 border-dashed border-gray-800 hover:border-cyber-green bg-gray-900/30 rounded-2xl p-12 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*" 
                    className="hidden"
                />
                <div className="absolute inset-0 bg-cyber-green/5 scale-0 group-hover:scale-100 transition-transform rounded-2xl"></div>
                <CloudUpload className="w-16 h-16 text-gray-600 group-hover:text-cyber-green mx-auto mb-4 transition-colors" />
                <p className="font-bold text-white mb-2">CLIQUE PARA CARREGAR FOTO</p>
                <p className="text-xs text-gray-500 font-mono">JPG, PNG ou WEBP (Max 5MB)</p>
            </div>
        </div>
    </div>
  );

  const renderScanning = () => (
    <div className={`min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden ${shaking ? 'animate-shake' : ''}`}>
        {/* Background Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
        
        {/* Demon Face Flash Effect */}
        {shaking && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                 <img src={EVIL_FACE_URL} className="w-full h-full object-cover opacity-50 mix-blend-overlay animate-pulse" alt="anomaly" />
            </div>
        )}

        <div className="w-full max-w-lg space-y-6 relative z-10">
            <div className="relative aspect-square max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-cyber-green shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                {selectedImage && (
                    <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover filter grayscale contrast-125" />
                )}
                {/* Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyber-green/50 to-transparent h-2 animate-scan"></div>
                
                {/* Face Markers Overlay */}
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping delay-100"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping delay-200"></div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-cyber-green">
                    <span>PROGRESSO_VARREDURA</span>
                    <span>{scanProgress}%</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div 
                        className="h-full bg-cyber-green shadow-[0_0_10px_#00FF94] transition-all duration-300 ease-out"
                        style={{ width: `${scanProgress}%` }}
                    ></div>
                </div>
            </div>

            <Terminal logs={logs} />
        </div>
    </div>
  );

  const renderLockedResult = () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-[#0a0a0a] border border-red-900/50 rounded-2xl p-1 relative overflow-hidden shadow-2xl">
            {/* Warning Header */}
            <div className="bg-red-900/20 border-b border-red-900/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-500 w-6 h-6 animate-pulse" />
                    <span className="font-mono font-bold text-red-500 tracking-widest">ALERTA DE RISCO DETECTADO</span>
                </div>
                <span className="text-[10px] font-mono text-red-400 border border-red-900 px-2 py-1 rounded">CONFIDENCIAL</span>
            </div>

            <div className="p-6 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Blurry Image */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                        {selectedImage && (
                            <img src={selectedImage} className="w-full h-full object-cover rounded-lg blur-sm opacity-50" alt="Target" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="text-white w-10 h-10" />
                        </div>
                    </div>

                    {/* Teaser Text */}
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white">{analysis?.titulo_principal || "ANÁLISE CONCLUÍDA"}</h3>
                        <p className="text-gray-400 text-sm font-mono leading-relaxed">
                            O sistema detectou <span className="text-red-500 font-bold">{analysis?.red_flags.length || 3} micro-sinais de comportamento oculto</span>. 
                            A análise completa contém detalhes sensíveis sobre tendências de <span className="text-white">narcisismo, infidelidade e manipulação</span>.
                        </p>
                        
                        <div className="bg-black/50 p-4 rounded border border-gray-800">
                             <div className="flex items-center justify-between text-xs font-mono mb-2">
                                <span className="text-gray-500">NÍVEL DE AMEAÇA</span>
                                <span className="text-red-500 font-bold animate-pulse">ALTO</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1.5 rounded-full">
                                 <div className="w-[85%] h-full bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Paywall / Unlock Section */}
                <div className="border-t border-gray-800 pt-8 space-y-6">
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.href = "https://pay.kiwify.com.br/RVDacih"}
                            className="w-full bg-cyber-green hover:bg-[#00cc76] text-black font-bold py-4 rounded-xl text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,148,0.4)] hover:shadow-[0_0_30px_rgba(0,255,148,0.6)] transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                            <Unlock className="w-6 h-6" /> DESBLOQUEAR POR R$ 17,90
                        </button>
                        <p className="text-[10px] text-center text-gray-500 font-mono">Oferta por tempo limitado. Receba 3 créditos de análise.</p>
                    </div>

                    <div className="text-center">
                        <button onClick={() => setAppState('LOGIN')} className="text-xs text-gray-500 underline hover:text-white transition-colors">
                            Já sou membro? Fazer Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderFinalResult = () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-white font-mono">Redirecionando para o painel...</p>
          {setTimeout(() => setAppState('DASHBOARD'), 1000) && null}
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
      {appState === 'LOGIN' && renderLogin()}
      {appState === 'DASHBOARD' && user && renderDashboard()}
      {appState === 'UPLOAD' && renderUpload()}
      {appState === 'SCANNING' && renderScanning()}
      {appState === 'LOCKED' && renderLockedResult()}
      {appState === 'RESULT' && renderFinalResult()}
    </div>
  );
};

export default App;