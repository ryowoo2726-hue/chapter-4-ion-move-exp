import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ExperimentSimulator from './components/ExperimentSimulator';
import StepRenderer from './components/StepRenderer';
import ReportWriter from './components/ReportWriter';
import ReportPrintView from './components/ReportPrintView';
import AdminPanel from './components/AdminPanel';

const DEFAULT_DRIVE_UPLOAD_URL = '';

// Default standard school curriculum experiment steps data
const defaultStepsData = [
  {
    title: '실험 준비',
    objective: '실험에 필요한 기구를 확인하고 거름종이에 전해질을 적셔 준비합니다.',
    items: [
      { id: 'prep_materials', title: '실험 준비물 확인하기', desc: '거름종이, 유리판, 전원장치, 악어 집게, 질산 칼륨(KNO₃) 수용액, 황산 구리(CuSO₄) 수용액, 과망가니즈산 칼륨(KMnO₄) 수용액을 준비합니다.' },
      { id: 'pencil_line', title: '거름종이에 기준선(연필선) 긋기', desc: '거름종이 가운데에 자를 대고 연필로 선을 긋고, 양쪽 끝에 각각 (-)극과 (+)극을 표시합니다.' },
      { id: 'kno3_wet', title: '질산 칼륨 수용액 적시기', desc: '거름종이를 질산 칼륨(KNO₃) 수용액으로 충분히 적셔 전류가 흐를 수 있는 환경(전해질)을 만듭니다.' },
      { id: 'dry_paper', title: '여분의 물기 닦아내기', desc: '거름종이가 축축한 상태를 유지하되 물방울이 고이지 않도록 거름종이 가장자리의 물기를 살짝 닦아내어 유리판 위에 놓습니다.' }
    ]
  },
  {
    title: '시약 점적',
    objective: '중앙 기준선 위에 관찰용 이온 수용액을 떨어뜨리고 전극을 설치합니다.',
    items: [
      { id: 'drop_cu', title: '황산 구리 수용액 점적하기', desc: '모세관이나 피펫을 이용해 파란색 황산 구리(CuSO₄) 수용액 한 방울을 연필선의 중앙 위쪽에 떨어뜨립니다.' },
      { id: 'drop_kmno', title: '과망가니즈산 칼륨 수용액 점적하기', desc: '보라색 과망가니즈산 칼륨(KMnO₄) 수용액 한 방울을 연필선의 중앙 아래쪽에 떨어뜨립니다.' },
      { id: 'clip_connect', title: '악어 집게 연결하기', desc: '거름종이의 (-) 표시선 쪽에 검은색 집게전극을, (+) 표시선 쪽에 빨간색 집게전극을 각각 연결합니다.' }
    ]
  },
  {
    title: '실험 진행',
    objective: '전원 공급 장치를 켜고 전압을 가한 뒤 변화를 일으킵니다.',
    items: [
      { id: 'power_connect', title: '전원 장치 연결선 재확인', desc: '집게선이 DC 전원 장치에 알맞은 극성으로 꽂혀 있는지 최종 점검합니다.' },
      { id: 'switch_on', title: '전원 인가 및 전압 서서히 높이기', desc: '전원 장치 스위치를 켜고 전압을 6V~10V 사이로 올려 시뮬레이터 속 이온이 움직이기 시작하는 것을 확인합니다.' },
      { id: 'observe_blue', title: '파란색 성분의 이동 관찰', desc: '파란색 구리 이온(Cu²⁺) 성분이 어느 극(왼쪽 (-)극) 방향으로 번져나가는지 세심히 관찰합니다.' },
      { id: 'observe_purple', title: '보라색 성분의 이동 관찰', desc: '보라색 과망가니즈산 이온(MnO₄⁻) 성분이 어느 극(오른쪽 (+)극) 방향으로 번져나가는지 세심히 관찰합니다.' }
    ]
  },
  {
    title: '결과 정리',
    objective: '이온 성분의 이동 방향을 관찰하여 이온이 띠는 전하의 성질을 추론합니다.',
    items: [
      { id: 'infer_blue', title: '구리 이온의 전하 추론', desc: '파란색 구리 이온이 (-)극으로 이동하는 성질로부터 구리 이온은 양(+)전하를 띠고 있음을 밝혀냅니다.' },
      { id: 'infer_purple', title: '과망가니즈산 이온의 전하 추론', desc: '보라색 과망가니즈산 이온이 (+)극으로 이동하는 성질로부터 과망가니즈산 이온은 음(-)전하를 띠고 있음을 밝혀냅니다.' },
      { id: 'electrolyte_role', title: '질산 칼륨 수용액 역할 이해', desc: '전하를 운반해주어 전류가 흐르도록 돕는 전해질의 기능에 대한 탐구를 끝마칩니다.' }
    ]
  },
  {
    title: '보고서 작성',
    objective: '실험 결과를 정리하여 보고서를 작성하고 자기 평가를 마칩니다.',
    items: [
      { id: 'write_info', title: '학습자 학번 확인', desc: '로그인한 학번이 보고서 상단에 표시되는지 확인합니다.' },
      { id: 'write_hypothesis', title: '가설 및 실험 결과 작성하기', desc: '가설과 실험 결과 기록, 그리고 각 추론 문항의 답안을 작성합니다.' },
      { id: 'self_eval', title: '자기 평가 완료하기', desc: '탐구 태도, 탐구 기능, 탐구 지식에 대한 세 가지 문항의 자기 점검을 완료합니다.' }
    ]
  }
];

const defaultReportAnswers = {
  hypothesis: '이온은 전하를 띠고 있으므로 수용액에 전압을 가하면 각 이온은 자신의 전하와 다른 부호의 전극 방향으로 끌려갈 것이다.',
  blueElectrode: '',
  purpleElectrode: '',
  observationDetail: '',
  copperExplanation: '',
  permanganateExplanation: '',
  electrolyte: '',
  conclusion: ''
};

const defaultProgress = (studentId = '') => ({
  studentInfo: { id: studentId },
  reportAnswers: defaultReportAnswers,
  selfEvaluation: { attitude: '', skill: '', knowledge: '' },
  checklist: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
  step: 0
});

const getProgressKey = (studentId) => `ion_student_progress_${studentId}`;

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ion_experiment_theme');
    return saved || 'light';
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [driveUploadUrl, setDriveUploadUrl] = useState(() => localStorage.getItem('ion_drive_upload_url') || DEFAULT_DRIVE_UPLOAD_URL);
  const [submitStatus, setSubmitStatus] = useState('');

  // Sync theme to body element class list and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('ion_experiment_theme', theme);
  }, [theme]);
  
  // Steps Data State (initialized from localStorage or default template)
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem('ion_experiment_steps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse steps configuration from localStorage:', e);
      }
    }
    return defaultStepsData;
  });

  const [studentIds, setStudentIds] = useState(() => {
    const saved = localStorage.getItem('ion_student_ids');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) return ids;
      } catch {}
    }
    return [];
  });

  const [studentInfo, setStudentInfo] = useState(defaultProgress().studentInfo);
  const [reportAnswers, setReportAnswers] = useState(defaultProgress().reportAnswers);
  const [selfEvaluation, setSelfEvaluation] = useState(defaultProgress().selfEvaluation);
  const [checklist, setChecklist] = useState(defaultProgress().checklist);
  const [step, setStep] = useState(defaultProgress().step);

  // Simulator States (Non-persistent, reset on reload/experiment restart)
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [voltage, setVoltage] = useState(0);
  const [blueIonPos, setBlueIonPos] = useState(0.5); // starts at 50% (middle)
  const [purpleIonPos, setPurpleIonPos] = useState(0.5); // starts at 50% (middle)

  // Confetti Canvas Refs
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Sync Student Progress to localStorage on changes
  useEffect(() => {
    if (!studentInfo.id) return;
    const progress = {
      studentInfo,
      reportAnswers,
      selfEvaluation,
      checklist,
      step
    };
    localStorage.setItem(getProgressKey(studentInfo.id), JSON.stringify(progress));
  }, [studentInfo, reportAnswers, selfEvaluation, checklist, step]);

  // Toggle App Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check if a specific step's checklist is fully completed
  const isStepCompleted = (stepIdx) => {
    const stepItems = steps[stepIdx]?.items || [];
    if (stepItems.length === 0) return false;
    const stepChecklist = checklist[stepIdx] || {};
    return stepItems.every(item => !!stepChecklist[item.id]);
  };

  // Check if step is unlocked (all prior steps must be fully completed)
  const canUnlockStep = (stepIdx) => {
    for (let i = 0; i < stepIdx; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  };

  // Handle checking checklist items
  const toggleCheck = (stepIdx, itemId) => {
    setChecklist(prev => {
      const stepItems = steps[stepIdx]?.items || [];
      const prevStepChecklist = prev[stepIdx] || {};
      const wasCompleted = stepItems.every(item => !!prevStepChecklist[item.id]);

      const updatedStep = {
        ...prevStepChecklist,
        [itemId]: !prevStepChecklist[itemId]
      };

      const isCompletedNow = stepItems.every(item => !!updatedStep[item.id]);

      if (!wasCompleted && isCompletedNow) {
        triggerConfetti();
      }

      return {
        ...prev,
        [stepIdx]: updatedStep
      };
    });
  };

  // Sync profile data and self evaluation into checklist in step 5
  useEffect(() => {
    const hasProfile = !!studentInfo.id;
    
    // Validate form: only check fields if they exist in customized steps
    const stepFiveItems = steps[4]?.items || [];
    const hasWriteInfo = stepFiveItems.some(i => i.id === 'write_info');
    const hasWriteHypo = stepFiveItems.some(i => i.id === 'write_hypothesis');
    const hasSelfEval = stepFiveItems.some(i => i.id === 'self_eval');

    const hasForm = !!(reportAnswers.hypothesis && reportAnswers.blueElectrode && reportAnswers.purpleElectrode && reportAnswers.observationDetail && reportAnswers.copperExplanation && reportAnswers.permanganateExplanation && reportAnswers.electrolyte && reportAnswers.conclusion);
    const hasEval = !!(selfEvaluation.attitude && selfEvaluation.skill && selfEvaluation.knowledge);

    setChecklist(prev => {
      const prevStepChecklist = prev[4] || {};
      
      const newInfoVal = hasWriteInfo ? hasProfile : true;
      const newHypoVal = hasWriteHypo ? hasForm : true;
      const newEvalVal = hasSelfEval ? hasEval : true;

      // Update check items only if they changed
      if (
        prevStepChecklist.write_info !== newInfoVal ||
        prevStepChecklist.write_hypothesis !== newHypoVal ||
        prevStepChecklist.self_eval !== newEvalVal
      ) {
        const updatedStep = {
          ...prevStepChecklist
        };
        if (hasWriteInfo) updatedStep.write_info = newInfoVal;
        if (hasWriteHypo) updatedStep.write_hypothesis = newHypoVal;
        if (hasSelfEval) updatedStep.self_eval = newEvalVal;

        const wasCompleted = stepFiveItems.every(item => !!prevStepChecklist[item.id]);
        const isCompletedNow = stepFiveItems.every(item => !!updatedStep[item.id]);

        if (!wasCompleted && isCompletedNow) {
          triggerConfetti();
        }

        return {
          ...prev,
          4: updatedStep
        };
      }
      return prev;
    });
  }, [studentInfo, reportAnswers, selfEvaluation, steps]);

  // Confetti Particle Explosion
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#3b82f6', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
    const newParticles = [];
    
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.8,
        radius: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 15,
        vy: -(Math.random() * 15 + 10),
        gravity: 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
    
    particlesRef.current = [...particlesRef.current, ...newParticles];
    
    if (!animationRef.current) {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const particles = particlesRef.current;
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.rotation += p.rotationSpeed;
          
          if (p.alpha <= 0 || p.x < 0 || p.x > canvas.width || p.y > canvas.height) {
            particles.splice(i, 1);
            continue;
          }
          
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.restore();
        }
        
        if (particles.length > 0) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Reset simulator positions
  const resetSim = () => {
    setIsPowerOn(false);
    setVoltage(0);
    setBlueIonPos(0.5);
    setPurpleIonPos(0.5);
  };

  const applyProgress = (progress) => {
    setStudentInfo({ id: progress.studentInfo?.id || '' });
    setReportAnswers({ ...defaultReportAnswers, ...progress.reportAnswers });
    setSelfEvaluation({ attitude: '', skill: '', knowledge: '', ...progress.selfEvaluation });
    setChecklist(progress.checklist || { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} });
    setStep(progress.step || 0);
    resetSim();
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const id = loginId.trim();
    if (!id) return;
    const saved = localStorage.getItem(getProgressKey(id));
    let progress = defaultProgress(id);
    if (saved) {
      try {
        progress = JSON.parse(saved);
      } catch {}
    }
    progress.studentInfo = { id };
    applyProgress(progress);
    if (!studentIds.includes(id)) {
      const updatedIds = [...studentIds, id].sort();
      setStudentIds(updatedIds);
      localStorage.setItem('ion_student_ids', JSON.stringify(updatedIds));
    }
  };

  const saveStudentIds = (ids) => {
    setStudentIds(ids);
    localStorage.setItem('ion_student_ids', JSON.stringify(ids));
  };

  const saveDriveUploadUrl = (url) => {
    const cleanUrl = url.trim();
    setDriveUploadUrl(cleanUrl);
    if (cleanUrl) localStorage.setItem('ion_drive_upload_url', cleanUrl);
    else localStorage.removeItem('ion_drive_upload_url');
  };

  const logoutStudent = () => {
    setStudentInfo({ id: '' });
    setLoginId('');
    resetSim();
  };

  // Clear current student progress to allow a fresh report for the same ID
  const clearStudentSession = () => {
    if (window.confirm('현재 학번의 이온 이동 보고서 및 체크리스트 기록을 모두 초기화하시겠습니까?\n(설계된 가이드라인 설정은 초기화되지 않습니다.)')) {
      applyProgress(defaultProgress(studentInfo.id));
      localStorage.removeItem(getProgressKey(studentInfo.id));
    }
  };

  // Navigations
  const nextStep = () => {
    if (isStepCompleted(step) && step < steps.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleStepClick = (idx) => {
    if (canUnlockStep(idx)) {
      setStep(idx);
    }
  };

  // Admin page save handlers
  const saveCustomSteps = (newSteps) => {
    setSteps(newSteps);
    localStorage.setItem('ion_experiment_steps', JSON.stringify(newSteps));
  };

  // Admin page reset handler
  const resetCustomSteps = () => {
    setSteps(defaultStepsData);
    localStorage.removeItem('ion_experiment_steps');
    return defaultStepsData;
  };

  const triggerPrint = () => {
    window.print();
  };

  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const submitReportToDrive = async () => {
    if (!driveUploadUrl) {
      setSubmitStatus('관리자 모드에서 Drive 제출 URL을 먼저 저장해주세요.');
      return;
    }

    const source = document.getElementById('report-print-container');
    if (!source) return;

    const exportNode = document.createElement('div');
    exportNode.className = 'pdf-export-container';
    exportNode.innerHTML = source.innerHTML;
    document.body.appendChild(exportNode);

    try {
      setSubmitStatus('PDF 생성 중...');
      const { default: html2pdf } = await import('html2pdf.js');
      const pdfBlob = await html2pdf()
        .set({
          margin: 8,
          filename: `${studentInfo.id}_ion_report.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(exportNode)
        .outputPdf('blob');

      setSubmitStatus('Drive로 제출 중...');
      const fileBase64 = await blobToBase64(pdfBlob);
      const res = await fetch(driveUploadUrl, {
        method: 'POST',
        body: JSON.stringify({
          studentId: studentInfo.id,
          fileBase64
        })
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || '제출 실패');
      setSubmitStatus(`제출 완료: ${result.url || 'Drive에 저장됨'}`);
    } catch (err) {
      setSubmitStatus(`제출 실패: ${err.message}`);
    } finally {
      exportNode.remove();
    }
  };

  return (
    <div className="app-container">
      {/* Background glow graphics */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* Confetti Celebration */}
      <canvas ref={canvasRef} className="confetti-canvas"></canvas>

      {/* Header */}
      <header className="app-header">
        <div className="header-title-section">
          <h1>
            🧪 이온의 이동 가상 실험실
          </h1>
          <p>중학교 과학 - 물질의 구성 | 탐구 보고서 & 단계별 체크리스트</p>
        </div>

        <div className="header-actions">
          {/* Admin Toggler */}
          <button
            type="button"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`theme-toggle-btn ${isAdminMode ? 'active' : ''}`}
            style={{ 
              background: isAdminMode ? 'var(--warning)' : undefined,
              borderColor: isAdminMode ? 'var(--warning)' : undefined,
              color: isAdminMode ? 'white' : undefined 
            }}
            title={isAdminMode ? '학생 모드로 전환' : '관리자 설정 열기'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          {/* Theme Switcher */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {studentInfo.id && (
            <div className="student-info-bar">
              <span className="student-id-label">학번 {studentInfo.id}</span>
              <button type="button" onClick={logoutStudent} className="student-mini-btn">
                나가기
              </button>
              <button
                type="button"
                onClick={clearStudentSession}
                className="student-mini-btn danger"
                title="현재 학번의 탐구 내용 초기화"
              >
                초기화
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="main-content">
        {/* Step Navigation Bar */}
        {(studentInfo.id || isAdminMode) && (
          <div className="step-nav" style={{ pointerEvents: isAdminMode ? 'none' : 'auto', opacity: isAdminMode ? 0.3 : 1 }}>
            {steps.map((s, idx) => {
              const isActive = step === idx;
              const isCompleted = isStepCompleted(idx);
              const isLocked = !canUnlockStep(idx);
              
              let statusIcon = '🔒';
              if (isActive) statusIcon = '⚡';
              else if (isCompleted) statusIcon = '✓';
              else if (!isLocked) statusIcon = '○';

              return (
                <div
                  key={idx}
                  className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleStepClick(idx)}
                >
                  <div className="step-number">Step {idx + 1}</div>
                  <div className="step-title">
                    <span>{s.title}</span>
                    <span className="step-status-icon">{statusIcon}</span>
                  </div>
                  <div className="step-progress-line"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Split Workspace */}
        <div className="workspace-grid" style={{ gridTemplateColumns: isAdminMode ? '1fr' : undefined }}>
          {isAdminMode ? (
            <AdminPanel
              stepsData={steps}
              studentIds={studentIds}
              driveUploadUrl={driveUploadUrl}
              onSave={saveCustomSteps}
              onReset={resetCustomSteps}
              onSaveStudentIds={saveStudentIds}
              onSaveDriveUploadUrl={saveDriveUploadUrl}
              onExit={() => setIsAdminMode(false)}
            />
          ) : !studentInfo.id ? (
            <div className="login-panel">
              <form onSubmit={handleStudentLogin} className="login-box">
                <h2>학번으로 입장</h2>
                <p>저장된 보고서가 있으면 불러오고, 없으면 새 보고서를 시작합니다.</p>
                <input
                  type="text"
                  inputMode="numeric"
                  list="student-id-list"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="form-input"
                  placeholder="학번 입력"
                  autoFocus
                />
                <datalist id="student-id-list">
                  {studentIds.map(id => <option key={id} value={id} />)}
                </datalist>
                <button type="submit" className="btn btn-primary">
                  시작하기
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Left Column: Instruction & Checklist or Report Writer */}
              {step < 4 ? (
                <StepRenderer
                  step={step}
                  checklist={checklist}
                  toggleCheck={toggleCheck}
                  stepsData={steps}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isStepCompleted={isStepCompleted}
                  totalSteps={steps.length}
                />
              ) : (
                <div className="content-pane">
                  <div className="content-pane-header">
                    <h2 className="content-pane-title">5. 평가 보고서 작성</h2>
                    {isStepCompleted(4) && (
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontWeight: 800, fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                        ✓ 모든 항목 완료 (출력 가능)
                      </span>
                    )}
                  </div>
                  <div className="step-objective" style={{ borderLeftColor: 'var(--success)' }}>
                    <strong>안내:</strong> 가상 실험 결과를 토대로 아래 보고서를 성실히 완성하세요. 항목이 모두 작성되면 보고서를 예쁘게 인쇄하거나 PDF로 저장할 수 있는 기능이 활성화됩니다.
                  </div>

                  <ReportWriter
                    studentInfo={studentInfo}
                    reportAnswers={reportAnswers}
                    setReportAnswers={setReportAnswers}
                    selfEvaluation={selfEvaluation}
                    setSelfEvaluation={setSelfEvaluation}
                    triggerPrint={triggerPrint}
                    submitReportToDrive={submitReportToDrive}
                    submitStatus={submitStatus}
                    canSubmitToDrive={!!driveUploadUrl}
                  />

                  <div className="step-navigation-footer" style={{ marginTop: '2rem' }}>
                    <button type="button" onClick={prevStep} className="btn btn-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      이전 단계 (결과 확인)
                    </button>
                  </div>
                </div>
              )}

              {/* Right Column: Virtual Experiment Simulator */}
              <ExperimentSimulator
                isPowerOn={isPowerOn}
                setIsPowerOn={setIsPowerOn}
                voltage={voltage}
                setVoltage={setVoltage}
                blueIonPos={blueIonPos}
                setBlueIonPos={setBlueIonPos}
                purpleIonPos={purpleIonPos}
                setPurpleIonPos={setPurpleIonPos}
                resetSim={resetSim}
                step={step}
              />
            </>
          )}
        </div>
      </main>

      {/* Hidden Print Layout (Used by window.print()) */}
      <ReportPrintView
        studentInfo={studentInfo}
        reportAnswers={reportAnswers}
        selfEvaluation={selfEvaluation}
      />
    </div>
  );
}

export default App;
