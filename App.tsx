import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';
import { useFalconX } from './hooks/useGeminiLive';
import { ConnectionState } from './types';
import Visualizer from './components/Visualizer';
import ChatMessageBubble from './components/ChatMessageBubble';

const App: React.FC = () => {
  const { 
    connect, 
    disconnect, 
    connectionState, 
    messages, 
    inputAnalyser, 
    outputAnalyser,
    error 
  } = useFalconX();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    if (isConnected || isConnecting) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 md:p-6">
      
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">FalconX Voice Agent</h1>
            <p className="text-xs text-slate-400 font-medium">Real-time AI Conversation</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border
          ${isConnected 
            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
            : isConnecting 
              ? 'bg-amber-900/30 text-amber-400 border-amber-800'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : isConnecting ? 'bg-amber-400' : 'bg-slate-500'}`}></div>
          {connectionState}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
        
        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-8">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <Mic size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium text-slate-400">Ready to chat?</p>
              <p className="text-sm max-w-xs mt-2">Connect to start a real-time voice conversation with FalconX.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="absolute top-0 left-0 w-full bg-red-500/90 text-white p-3 text-sm text-center flex items-center justify-center gap-2 backdrop-blur-md z-10">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Controls & Visualization */}
        <div className="bg-slate-900/80 border-t border-slate-700 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            
            {/* Visualizers Row */}
            <div className="flex items-center gap-4 h-16">
              {/* User Mic Visualizer */}
              <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden relative h-full">
                <div className="absolute top-1 left-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider z-10">
                  Microphone
                </div>
                <Visualizer 
                  isActive={isConnected} 
                  analyserNode={inputAnalyser} 
                  color="#818cf8" // Indigo 400
                />
              </div>

              {/* AI Output Visualizer */}
              <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden relative h-full">
                <div className="absolute top-1 left-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider z-10">
                  AI Response
                </div>
                 <Visualizer 
                  isActive={isConnected} 
                  analyserNode={outputAnalyser} 
                  color="#34d399" // Emerald 400
                />
              </div>
            </div>

            {/* Main Action Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={handleToggle}
                disabled={isConnecting}
                className={`
                  relative group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
                  ${isConnected 
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5'}
                  ${isConnecting && 'opacity-70 cursor-wait'}
                `}
              >
                {isConnected ? (
                  <>
                    <MicOff size={24} />
                    <span>Disconnect</span>
                  </>
                ) : isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Mic size={24} className="group-hover:scale-110 transition-transform" />
                    <span>Start Conversation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-slate-500 text-xs">
        Powered by Murf Falcon AI
      </footer>
    </div>
  );
};

export default App;