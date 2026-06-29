import React from 'react';

export default function StepRenderer({
  step,
  checklist,
  toggleCheck,
  stepsData,
  nextStep,
  prevStep,
  isStepCompleted,
  totalSteps
}) {
  const currentStepData = stepsData[step];
  const stepChecklist = checklist[step] || {};
  const allCompleted = isStepCompleted(step);

  return (
    <div className="content-pane">
      <div className="content-pane-header">
        <h2 className="content-pane-title">
          {step + 1}. {currentStepData.title}
        </h2>
        {allCompleted && (
          <span 
            style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--success)', 
              fontWeight: 800, 
              fontSize: '0.8rem', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              animation: 'pulse-green 1.5s infinite' 
            }}
          >
            ✓ 모든 항목 완료
          </span>
        )}
      </div>

      <div className="step-objective">
        <strong>학습 목표:</strong> {currentStepData.objective}
      </div>

      <div className="checklist-container">
        {currentStepData.items.map((item) => {
          const isChecked = !!stepChecklist[item.id];
          return (
            <div
              key={item.id}
              className={`checklist-item ${isChecked ? 'checked' : ''}`}
              onClick={() => toggleCheck(step, item.id)}
            >
              <div className="checkbox-custom"></div>
              <div className="checklist-text">
                <span className="checklist-title">{item.title}</span>
                <span className="checklist-desc">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="step-navigation-footer">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className="btn btn-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          이전 단계
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          단계 {step + 1} / {totalSteps}
        </span>

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!allCompleted}
            className="btn btn-primary"
          >
            다음 단계로
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        ) : (
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.9rem' }}>
            🎉 실험 가이드 완료! 보고서를 완성하세요.
          </span>
        )}
      </div>
    </div>
  );
}
