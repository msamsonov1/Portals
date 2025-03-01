import React, { useState, useEffect } from 'react';
import { Thermometer, Power, X, Shield } from 'lucide-react';

function App() {
  const [temperature, setTemperature] = useState(20);
  const [stage, setStage] = useState(0);
  const [showBlackHole, setShowBlackHole] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const formatTemperature = (temp: number) => {
    if (temp < 1000) return temp.toFixed(0);
    if (temp < 1000000) return `${(temp / 1000).toFixed(1)}K`;
    if (temp < 1000000000) return `${(temp / 1000000).toFixed(1)}M`;
    if (temp < 1000000000000) return `${(temp / 1000000000).toFixed(1)}B`;
    return `${(temp / 1000000000000).toFixed(1)}T`;
  };

  const handleStart = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (stage === 0) {
      // First stage: increase to 20,000°C
      let currentTemp = temperature;
      const targetTemp = 20000;
      const interval = setInterval(() => {
        const increment = Math.max(1, Math.floor((targetTemp - currentTemp) / 100));
        currentTemp = Math.min(targetTemp, currentTemp + increment);
        setTemperature(currentTemp);
        
        if (currentTemp >= targetTemp) {
          clearInterval(interval);
          setStage(1);
          setIsAnimating(false);
        }
      }, 30);
    } else if (stage === 1) {
      // Second stage: increase to Planck temperature (1.417e32 °C)
      let currentTemp = temperature;
      const targetTemp = 1.417e32;
      const logStart = Math.log(currentTemp);
      const logEnd = Math.log(targetTemp);
      const steps = 200;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const logCurrent = logStart + (logEnd - logStart) * progress;
        currentTemp = Math.exp(logCurrent);
        setTemperature(currentTemp);
        
        if (step >= steps) {
          clearInterval(interval);
          setShowBlackHole(true);
          setStage(2);
          setIsAnimating(false);
        }
      }, 30);
    }
  };

  const resetExperiment = () => {
    setTemperature(20);
    setStage(0);
    setShowBlackHole(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Портал Петровича</h1>
          <div className="flex items-center space-x-2">
            <Thermometer className="text-red-500" />
            <span className="text-xl">{formatTemperature(temperature)}°C</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6 relative">
        {/* Black hole overlay */}
        {showBlackHole && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="absolute inset-0 bg-black bg-opacity-80"></div>
            <div className="relative z-30 flex flex-col items-center">
              <div className="w-64 h-64 rounded-full bg-black shadow-[0_0_60px_40px_rgba(0,0,0,0.8)] animate-pulse"></div>
              <p className="mt-8 text-2xl text-center">Пространственно-временной портал открыт</p>
              <button 
                onClick={resetExperiment}
                className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center"
              >
                <X className="mr-2" /> Завершить эксперимент
              </button>
            </div>
          </div>
        )}

        {/* Left panel - Controls */}
        <div className="md:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Панель управления</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Текущая конфигурация:</h3>
            <p className="mb-1">Конденсаторы: {stage === 0 ? '12 единиц' : '1024 единиц'}</p>
            <p className="mb-1">Катушки индуктивности: {stage === 0 ? '8 единиц' : '512 единиц'}</p>
            <p className="mb-4">Экранирование: {stage === 0 ? 'Базовое титановое' : 'Многослойное с наноматериалами'}</p>
            
            <div className="flex items-center mb-2">
              <Shield className="mr-2 text-blue-400" />
              <div className="flex-grow bg-gray-700 h-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: stage === 0 ? '30%' : '100%' }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Уровень защиты: {stage === 0 ? 'Стандартный' : 'Максимальный'}</p>
          </div>
          
          <button
            onClick={handleStart}
            disabled={isAnimating}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center text-lg font-bold ${
              isAnimating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Power className="mr-2" />
            {stage === 0 
              ? 'Запустить нагрев до 20 000°C' 
              : stage === 1 
                ? 'Запустить нагрев до планковской температуры' 
                : 'Эксперимент завершен'}
          </button>
          
          {stage > 0 && !showBlackHole && (
            <button
              onClick={resetExperiment}
              className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Сбросить эксперимент
            </button>
          )}
        </div>

        {/* Right panel - Visualization */}
        <div className="md:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">Визуализация эксперимента</h2>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Reactor core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className={`w-1/2 h-1/2 rounded-full ${
                    temperature < 100 
                      ? 'bg-blue-500' 
                      : temperature < 1000 
                        ? 'bg-yellow-500' 
                        : temperature < 10000 
                          ? 'bg-orange-500' 
                          : 'bg-red-500'
                  } shadow-lg transition-all duration-300`}
                  style={{
                    boxShadow: `0 0 ${Math.min(60, Math.log(temperature) * 3)}px ${Math.min(40, Math.log(temperature) * 2)}px ${
                      temperature < 100 
                        ? 'rgba(59, 130, 246, 0.7)' 
                        : temperature < 1000 
                          ? 'rgba(234, 179, 8, 0.7)' 
                          : temperature < 10000 
                            ? 'rgba(249, 115, 22, 0.7)' 
                            : 'rgba(239, 68, 68, 0.7)'
                    }`
                  }}
                ></div>
              </div>
              
              {/* Capacitors */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={`capacitor-${i}`}
                  className="absolute w-6 h-12 bg-gray-300 border border-gray-400"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-120px)`,
                    transformOrigin: 'center center',
                    left: 'calc(50% - 3px)'
                  }}
                ></div>
              ))}
              
              {/* Inductors */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={`inductor-${i}`}
                  className="absolute w-8 h-8 rounded-full border-4 border-copper-400"
                  style={{
                    borderColor: '#b87333',
                    transform: `rotate(${i * 45 + 22.5}deg) translateY(-100px)`,
                    transformOrigin: 'center center',
                    left: 'calc(50% - 4px)'
                  }}
                ></div>
              ))}
              
              {/* Shielding */}
              <div 
                className="absolute inset-0 rounded-full border-8 border-gray-500 opacity-30"
                style={{ transform: 'scale(1.2)' }}
              ></div>
              
              {stage > 0 && (
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50"
                  style={{ transform: 'scale(1.3)' }}
                ></div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-lg">Текущая температура: <span className="font-bold">{formatTemperature(temperature)}°C</span></p>
              <p className="text-sm text-gray-400 mt-2">
                {temperature < 100 
                  ? 'Нагрев начат. Система стабильна.' 
                  : temperature < 1000 
                    ? 'Температура растет. Все системы в норме.' 
                    : temperature < 10000 
                      ? 'Высокая температура. Экранирование активно.' 
                      : temperature < 100000 
                        ? 'Критическая температура! Максимальная мощность экранирования.' 
                        : 'ВНИМАНИЕ! Планковская температура! Пространственно-временные искажения!'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>© 2025 Портал Петровича | Исследование высоких температур</p>
      </footer>
    </div>
  );
}

export default App;