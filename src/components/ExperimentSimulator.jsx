import React, { useEffect } from 'react';

export default function ExperimentSimulator({
  isPowerOn,
  setIsPowerOn,
  voltage,
  setVoltage,
  blueIonPos,
  setBlueIonPos,
  purpleIonPos,
  setPurpleIonPos,
  resetSim,
  step
}) {
  const blueRef = React.useRef(blueIonPos);
  const purpleRef = React.useRef(purpleIonPos);

  React.useEffect(() => {
    blueRef.current = blueIonPos;
    purpleRef.current = purpleIonPos;
  }, [blueIonPos, purpleIonPos]);

  // Animate ion positions when power is on and voltage > 0
  useEffect(() => {
    let animId;
    if (isPowerOn && voltage > 0) {
      const tick = () => {
        // Stop scheduling animation if both ions have reached their destinations
        if (blueRef.current <= 0.15 && purpleRef.current >= 0.85) {
          return;
        }

        // Speed is proportional to voltage.
        // Base rate is chosen so that at 10V it takes about 8 seconds to travel to the electrode.
        const speed = (voltage / 10) * 0.003;
        
        setBlueIonPos(prev => Math.max(0.15, prev - speed)); // moves left (towards -)
        setPurpleIonPos(prev => Math.min(0.85, prev + speed)); // moves right (towards +)
        
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPowerOn, voltage, setBlueIonPos, setPurpleIonPos]);

  // Determine label states based on step
  const isReagentAdded = step >= 1; // Step 2 (0-indexed: 1) or higher
  const isVoltageActive = step >= 2; // Step 3 (0-indexed: 2) or higher

  return (
    <div className="simulator-panel">
      <div className="sim-header">
        <h3 className="sim-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          가상 실험실 (Simulator)
        </h3>
        <span className={`sim-status-tag ${isPowerOn ? 'active' : ''}`}>
          {isPowerOn ? '전원 연결됨 (ON)' : '전원 차단됨 (OFF)'}
        </span>
      </div>

      <div className="svg-canvas-container">
        {/* Render simulated experiment SVG */}
        <svg className="svg-element" viewBox="0 0 400 300">
          {/* Glass Plate */}
          <rect x="30" y="80" width="340" height="140" rx="8" fill="rgba(148, 163, 184, 0.15)" stroke="var(--border-color)" strokeWidth="2.5" />
          <rect x="35" y="85" width="330" height="130" rx="6" fill="rgba(255, 255, 255, 0.05)" />
          
          {/* Filter Paper */}
          <rect x="60" y="100" width="280" height="100" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))" />
          
          {/* Wet Electrolyte Texture (KNO3) - slight yellow/blue overlay representing moisture */}
          {step >= 0 && (
            <rect x="62" y="102" width="276" height="96" rx="3" fill="rgba(6, 182, 212, 0.03)" />
          )}

          {/* Pencil Center Line */}
          <line x1="200" y1="100" x2="200" y2="200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="200" y="93" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="bold">기준선 (연필선)</text>

          {/* Electrode markings on filter paper */}
          <text x="75" y="155" fill="var(--accent-blue)" fontSize="18" fontWeight="bold" textAnchor="middle" opacity="0.8">(-)</text>
          <text x="325" y="155" fill="var(--accent-red)" fontSize="18" fontWeight="bold" textAnchor="middle" opacity="0.8">(+)</text>

          {/* Crocodile clips */}
          {/* Left Clip (-) */}
          <path d="M 40 140 L 60 145 L 60 155 L 40 160 Z" fill="var(--accent-grey)" stroke="#374151" strokeWidth="1" />
          <line x1="25" y1="150" x2="40" y2="150" stroke="var(--accent-grey)" strokeWidth="3" />
          {/* Right Clip (+) */}
          <path d="M 360 140 L 340 145 L 340 155 L 360 160 Z" fill="var(--accent-red)" stroke="#b91c1c" strokeWidth="1" />
          <line x1="375" y1="150" x2="360" y2="150" stroke="var(--accent-red)" strokeWidth="3" />

          {/* Reagents (Ions) */}
          {isReagentAdded ? (
            <>
              {/* Copper Ion Cu2+ (Blue) */}
              <g transform={`translate(${60 + blueIonPos * 280}, 130)`}>
                <circle r="8" fill="var(--accent-blue)" opacity="0.8" filter="drop-shadow(0 0 6px var(--accent-blue))" />
                <circle r="4" fill="#ffffff" opacity="0.5" />
                <text y="3" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">Cu²⁺</text>
              </g>

              {/* Permanganate Ion MnO4- (Purple) */}
              <g transform={`translate(${60 + purpleIonPos * 280}, 170)`}>
                <circle r="8" fill="var(--accent-purple)" opacity="0.8" filter="drop-shadow(0 0 6px var(--accent-purple))" />
                <circle r="4" fill="#ffffff" opacity="0.5" />
                <text y="3" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">MnO₄⁻</text>
              </g>
            </>
          ) : (
            // Placeholder hint of spots before drop
            step === 0 && (
              <g opacity="0.25">
                <circle cx="200" cy="130" r="6" fill="#cbd5e1" stroke="#94a3b8" strokeDasharray="2 2" />
                <circle cx="200" cy="170" r="6" fill="#cbd5e1" stroke="#94a3b8" strokeDasharray="2 2" />
                <text x="200" y="154" fill="var(--text-muted)" fontSize="8" textAnchor="middle">시약 대기</text>
              </g>
            )
          )}

          {/* DC Power Supply (Box UI inside SVG) */}
          <rect x="110" y="10" width="180" height="55" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          {/* LCD Screen */}
          <rect x="120" y="18" width="80" height="24" rx="3" fill="#0f172a" stroke="#334155" />
          <text x="160" y="34" fill="#10b981" fontSize="12" fontFamily="'Outfit', monospace" fontWeight="bold" textAnchor="middle">
            {isPowerOn ? `${voltage.toFixed(1)} V` : '0.0 V'}
          </text>
          {/* Dial/Buttons on Power Supply */}
          <circle cx="225" cy="30" r="8" fill="#475569" stroke="#64748b" />
          <line x1="225" y1="30" x2="225" y2="24" stroke="#e2e8f0" strokeWidth="1.5" transform={`rotate(${voltage * 27}, 225, 30)`} />
          
          {/* ON/OFF Status LED */}
          <circle cx="255" cy="30" r="4" fill={isPowerOn ? '#10b981' : '#ef4444'} />
          <text x="278" y="33" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="end">POWER</text>

          {/* Wires connecting power supply to clips */}
          {/* Negative Wire (Black/Grey) */}
          <path 
            d="M 120 40 C 40 40, 20 100, 25 150" 
            className={`wire-path ${isPowerOn ? 'glowing-minus' : ''}`}
          />
          {/* Positive Wire (Red) */}
          <path 
            d="M 280 40 C 360 40, 380 100, 375 150" 
            className={`wire-path ${isPowerOn ? 'glowing-plus' : ''}`}
          />
        </svg>
      </div>

      {/* Simulator controls */}
      <div className="sim-controls">
        <div className="control-row">
          <span className="control-label">전원 장치 제어</span>
          <button 
            type="button" 
            onClick={() => {
              if (!isVoltageActive) return;
              setIsPowerOn(!isPowerOn);
            }} 
            disabled={!isVoltageActive}
            className={`toggle-switch-btn ${isPowerOn ? 'active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            {isPowerOn ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="control-row">
          <span className="control-label">전압 설정 (Voltage)</span>
          <div className="voltage-slider-wrapper">
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="1"
              value={voltage} 
              onChange={(e) => {
                if (!isVoltageActive) return;
                setVoltage(Number(e.target.value));
              }}
              disabled={!isVoltageActive || !isPowerOn}
              className="voltage-slider"
            />
            <span className="voltage-val">{voltage}V</span>
          </div>
        </div>

        <div className="control-row" style={{ marginTop: '0.25rem' }}>
          <button 
            type="button" 
            onClick={resetSim} 
            disabled={!isReagentAdded}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            시뮬레이터 리셋 (초기화)
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="sim-legend">
        <div className="legend-item">
          <div className="legend-dot blue"></div>
          <div>구리 이온 (Cu²⁺)</div>
        </div>
        <div className="legend-item">
          <div className="legend-dot purple"></div>
          <div>과망가니즈산 이온 (MnO₄⁻)</div>
        </div>
      </div>

      {/* Hint messaging inside simulator depending on step */}
      {step === 0 && (
        <div className="sim-tip-card">
          <strong>팁:</strong> 1단계 완료 후 2단계로 넘어가 '황산 구리'와 '과망가니즈산 칼륨' 수용액을 떨어뜨리면 이온이 튜브에서 연필선 위에 올라갑니다.
        </div>
      )}
      {step === 1 && (
        <div className="sim-tip-card">
          <strong>팁:</strong> 시약이 중심선 위에 잘 배치되었습니다! 이제 3단계로 이동하여 전원 케이블을 연결하고 전원을 켜봅시다.
        </div>
      )}
      {isPowerOn && voltage === 0 && (
        <div className="sim-tip-card">
          <strong>안내:</strong> 전압이 0V입니다. 전압 조절기를 올려서 전류를 흐르게 하세요!
        </div>
      )}
      {isPowerOn && voltage > 0 && (
        <div className="sim-tip-card" style={{ background: 'rgba(16, 185, 129, 0.06)', borderLeftColor: 'var(--success)' }}>
          <strong>실험 진행 중:</strong> 파란색 구리 이온은 (-)극으로, 보라색 과망가니즈산 이온은 (+)극으로 이동하는 것을 확인하세요. (전압이 높을수록 빠르게 움직입니다)
        </div>
      )}
    </div>
  );
}
