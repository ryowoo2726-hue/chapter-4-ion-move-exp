import React, { useState } from 'react';

export default function AdminPanel({
  stepsData,
  studentIds,
  driveUploadUrl,
  onSave,
  onReset,
  onSaveStudentIds,
  onSaveDriveUploadUrl,
  onExit
}) {
  const [localSteps, setLocalSteps] = useState(JSON.parse(JSON.stringify(stepsData)));
  const [studentIdsText, setStudentIdsText] = useState(studentIds.join('\n'));
  const [driveUrlText, setDriveUrlText] = useState(driveUploadUrl);
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  
  // PIN Verification States
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const activeStep = localSteps[selectedStepIdx];

  // Update step field (title, objective)
  const handleStepFieldChange = (field, value) => {
    setLocalSteps(prev => {
      const updated = [...prev];
      updated[selectedStepIdx] = {
        ...updated[selectedStepIdx],
        [field]: value
      };
      return updated;
    });
  };

  // Update specific checklist item field
  const handleItemFieldChange = (itemId, field, value) => {
    setLocalSteps(prev => {
      const updated = [...prev];
      const items = updated[selectedStepIdx].items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      updated[selectedStepIdx].items = items;
      return updated;
    });
  };

  // Delete checklist item
  const handleDeleteItem = (itemId) => {
    if (activeStep.items.length <= 1) {
      alert('체크리스트에는 최소 1개 이상의 항목이 존재해야 합니다.');
      return;
    }
    setLocalSteps(prev => {
      const updated = [...prev];
      updated[selectedStepIdx].items = updated[selectedStepIdx].items.filter(item => item.id !== itemId);
      return updated;
    });
  };

  // Add new checklist item
  const handleAddItem = () => {
    const newItemId = `custom_item_${Date.now()}`;
    const newItem = {
      id: newItemId,
      title: '새 체크리스트 항목',
      desc: '여기에 체크리스트 상세 설명을 적어주세요.'
    };
    setLocalSteps(prev => {
      const updated = [...prev];
      updated[selectedStepIdx].items = [...updated[selectedStepIdx].items, newItem];
      return updated;
    });
  };

  // Trigger PIN Verification Modal
  const handleTriggerSave = () => {
    // Basic validation: ensure all items have values
    for (let sIdx = 0; sIdx < localSteps.length; sIdx++) {
      const step = localSteps[sIdx];
      if (!step.title.trim()) {
        alert(`${sIdx + 1}단계의 제목이 비어있습니다.`);
        return;
      }
      if (!step.objective.trim()) {
        alert(`${sIdx + 1}단계의 학습 목표가 비어있습니다.`);
        return;
      }
      for (let i = 0; i < step.items.length; i++) {
        const item = step.items[i];
        if (!item.title.trim()) {
          alert(`${sIdx + 1}단계의 일부 항목 제목이 비어있습니다.`);
          return;
        }
      }
    }

    setPinInput('');
    setPinError('');
    setShowPinModal(true);
  };

  // Confirm PIN and Save
  const handlePinSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (pinInput === '2726') {
      try {
        await onSave(localSteps, pinInput);
        setShowPinModal(false);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (err) {
        setPinError(`저장 실패: ${err.message}`);
      }
    } else {
      setPinError('PIN 번호가 일치하지 않습니다. 다시 입력해주세요.');
      setPinInput('');
    }
  };

  // Reset to default settings
  const handleReset = () => {
    if (window.confirm('모든 실험 정보가 기본 교육과정 설정으로 복원됩니다. 계속하시겠습니까?')) {
      const defaultSteps = onReset();
      setLocalSteps(JSON.parse(JSON.stringify(defaultSteps)));
      setSaveStatus('reset');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSaveStudentIds = () => {
    const pin = window.prompt('학생 학번 DB를 저장하려면 관리자 PIN 번호를 입력하세요.');
    if (pin !== '2726') {
      alert('PIN 번호가 일치하지 않습니다.');
      return;
    }
    const ids = [...new Set(studentIdsText.split(/\s+/).map(id => id.trim()).filter(Boolean))].sort();
    onSaveStudentIds(ids);
    setStudentIdsText(ids.join('\n'));
    setSaveStatus('students');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSaveDriveUrl = () => {
    const pin = window.prompt('Drive 제출 URL을 저장하려면 관리자 PIN 번호를 입력하세요.');
    if (pin !== '2726') {
      alert('PIN 번호가 일치하지 않습니다.');
      return;
    }
    onSaveDriveUploadUrl(driveUrlText);
    setSaveStatus('drive');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="content-pane" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="content-pane-header">
        <h2 className="content-pane-title">🛠️ 실험 설계 관리자 모드</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
            기본값 복원
          </button>
          <button type="button" onClick={onExit} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)' }}>
            나가기
          </button>
        </div>
      </div>

      <div className="step-objective" style={{ borderLeftColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.04)' }}>
        <strong>안내:</strong> 각 실험 단계의 명칭, 학습 목표, 체크리스트 항목 및 세부 설명 내용을 커스텀하게 편집할 수 있습니다. 저장 시 학생 페이지에 즉시 실시간으로 반영됩니다.
      </div>

      <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontWeight: 'bold' }}>학생 학번 DB</h4>
        <textarea
          value={studentIdsText}
          onChange={(e) => setStudentIdsText(e.target.value)}
          className="form-textarea"
          placeholder="한 줄에 학번 하나씩 입력"
          style={{ minHeight: '90px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>이 목록은 브라우저 로컬저장소에만 저장되며 GitHub 배포 파일에는 포함되지 않습니다.</span>
          <button type="button" onClick={handleSaveStudentIds} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            학번 DB 저장
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ fontWeight: 'bold' }}>Google Drive 제출 URL</h4>
        <input
          type="url"
          value={driveUrlText}
          onChange={(e) => setDriveUrlText(e.target.value)}
          className="form-input"
          placeholder="Apps Script Web App URL"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apps Script를 Web App으로 배포한 뒤 URL을 붙여넣으세요.</span>
          <button type="button" onClick={handleSaveDriveUrl} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            제출 URL 저장
          </button>
        </div>
      </div>

      {/* Editor Main Layout */}
      <div className="admin-editor-grid">
        
        {/* Left Step Selector */}
        <div className="admin-step-selector">
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>편집할 실험 단계 선택</span>
          {localSteps.map((step, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedStepIdx(idx)}
              className="btn"
              style={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '0.8rem',
                fontSize: '0.9rem',
                borderRadius: '8px',
                background: selectedStepIdx === idx ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedStepIdx === idx ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: selectedStepIdx === idx ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <span style={{ marginRight: '0.5rem', opacity: 0.8 }}>Step {idx + 1}</span>
              <strong>{step.title}</strong>
            </button>
          ))}
        </div>

        {/* Right Editor Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {/* Step Metadata Form */}
          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              [Step {selectedStepIdx + 1}] 단계 메타데이터 수정
            </h4>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>단계 이름</label>
              <input
                type="text"
                value={activeStep.title}
                onChange={(e) => handleStepFieldChange('title', e.target.value)}
                className="form-input"
                placeholder="단계 타이틀을 적어주세요."
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>학습 목표</label>
              <textarea
                value={activeStep.objective}
                onChange={(e) => handleStepFieldChange('objective', e.target.value)}
                className="form-textarea"
                placeholder="학습 목표를 명확히 작성해주세요."
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>

          {/* Step Items Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 'bold' }}>📋 체크리스트 구성 항목</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px' }}
              >
                + 항목 추가
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeStep.items.map((item, itemIdx) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      항목 #{itemIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        borderRadius: '6px',
                        border: 'none'
                      }}
                    >
                      삭제
                    </button>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemFieldChange(item.id, 'title', e.target.value)}
                      className="form-input"
                      placeholder="체크할 핵심 액션 설명"
                      style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      value={item.desc}
                      onChange={(e) => handleItemFieldChange(item.id, 'desc', e.target.value)}
                      className="form-textarea"
                      placeholder="행동 요령 또는 이온에 관한 상세 가이드라인 설명"
                      style={{ minHeight: '50px', padding: '0.5rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Save Settings Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: 'auto' }}>
        {saveStatus === 'success' && (
          <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ✓ 설정이 로컬저장소에 안전하게 저장되었습니다!
          </span>
        )}
        {saveStatus === 'reset' && (
          <span style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ✓ 기본 교육과정 설정으로 원복되었습니다.
          </span>
        )}
        {saveStatus === 'students' && (
          <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ✓ 학생 학번 DB가 저장되었습니다.
          </span>
        )}
        {saveStatus === 'drive' && (
          <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ✓ Drive 제출 URL이 저장되었습니다.
          </span>
        )}
        <button
          type="button"
          onClick={handleTriggerSave}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
        >
          설정 저장 (Apply)
        </button>
        <button
          type="button"
          onClick={onExit}
          className="btn btn-secondary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          학생 페이지로 이동
        </button>
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>🔒 관리자 인증 필요</h3>
            </div>
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                변경사항을 저장하려면 관리자 PIN 번호 4자리(기본값: 2726)를 입력하세요.
              </p>
              
              <div className="form-group">
                <input
                  type="password"
                  placeholder="PIN 번호 입력"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  maxLength={4}
                  autoFocus
                  className="form-input"
                  style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem', padding: '0.5rem' }}
                />
              </div>

              {pinError && (
                <p style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>
                  {pinError}
                </p>
              )}

              <div className="modal-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
