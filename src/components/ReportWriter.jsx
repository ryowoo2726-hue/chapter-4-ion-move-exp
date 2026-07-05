import React from 'react';
import IonMovementDrawing from './IonMovementDrawing';

export default function ReportWriter({
  studentInfo,
  reportAnswers,
  setReportAnswers,
  selfEvaluation,
  setSelfEvaluation,
  triggerPrint,
  submitReportToDrive,
  submitStatus,
  canSubmitToDrive
}) {
  const handleAnswerChange = (field, value) => {
    setReportAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleEvalChange = (criterion, rating) => {
    setSelfEvaluation(prev => ({ ...prev, [criterion]: rating }));
  };

  // Helper validation for electrolyte question
  const validateElectrolyte = (text) => {
    if (!text) return null;
    const keywords = ['전류', '전해질', '전기'];
    const matched = keywords.filter(word => text.includes(word));
    if (matched.length >= 2) {
      return { status: 'success', msg: '✓ 핵심 키워드(전류, 전해질 등)가 잘 포함되었습니다.' };
    }
    if (matched.length === 1) {
      return { status: 'warning', msg: '⚠ 전류가 흐르도록 돕는 \'전해질\'이라는 단어를 포함하면 더 좋습니다.' };
    }
    return { status: 'default', msg: '전기가 통하게 하는 역할(전해질)에 대해 적어주세요.' };
  };

  // Helper validation for explanation questions
  const validateIonCharge = (ion, answer, charge) => {
    if (!answer) return null;
    const correctCharge = charge === 'plus' ? ['양', '플러스', '+'] : ['음', '마이너스', '-'];
    const correctElectrode = charge === 'plus' ? ['-', '음극', '마이너스'] : ['+', '양극', '플러스'];
    
    const hasCharge = correctCharge.some(word => answer.includes(word));
    const hasElectrode = correctElectrode.some(word => answer.includes(word));

    if (hasCharge && hasElectrode) {
      return { status: 'success', msg: `✓ 정확한 설명입니다! ${ion === 'copper' ? '(-)극' : '(+)극'}으로 이동하므로 ${charge === 'plus' ? '양전하' : '음전하'}를 띱니다.` };
    }
    return { status: 'default', msg: `어느 전극으로 이동하여 어떤 전하를 띠는지 구체적으로 서술하세요.` };
  };

  const electrolyteVal = validateElectrolyte(reportAnswers.electrolyte);
  const copperVal = validateIonCharge('copper', reportAnswers.copperExplanation, 'plus');
  const permanganateVal = validateIonCharge('permanganate', reportAnswers.permanganateExplanation, 'minus');

  return (
    <div className="report-writer-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Student ID Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <h4 style={{ fontWeight: 800, fontSize: '0.95rem', width: '100%', marginBottom: '-0.5rem', color: 'var(--primary)' }}>학습자 정보</h4>
        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>학번 {studentInfo.id}</div>
      </div>

      <div className="report-form">
        {/* Hypothesis */}
        <div className="form-group">
          <label className="form-label">
            1. 실험 가설 설정 <span className="badge-required">필수</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="예: 이온은 전하를 띠고 있으므로, 수용액에 전압을 걸어주면 이온의 전하와 반대 부호의 전극 쪽으로 이동할 것이다."
            value={reportAnswers.hypothesis}
            onChange={(e) => handleAnswerChange('hypothesis', e.target.value)}
          />
        </div>

        {/* Observations */}
        <div className="form-group" style={{ background: 'var(--bg-card)', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <label className="form-label" style={{ marginBottom: '1rem' }}>
            2. 실험 결과 및 관찰 기록 <span className="badge-required">필수</span>
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>파란색 구리 이온 (Cu²⁺) 이동 극</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['(-)', '(+)', '이동 안 함'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerChange('blueElectrode', option)}
                    className={`rating-btn ${reportAnswers.blueElectrode === option ? 'active' : ''}`}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    {option}극
                  </button>
                ))}
              </div>
              {reportAnswers.blueElectrode && (
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: reportAnswers.blueElectrode === '(-)' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {reportAnswers.blueElectrode === '(-)' ? '✓ 정답입니다! 구리 이온은 양이온입니다.' : '✕ 다시 생각해보세요. 양이온은 어디로 끌릴까요?'}
                </p>
              )}
            </div>

            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>보라색 과망가니즈산 이온 (MnO₄⁻) 이동 극</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['(-)', '(+)', '이동 안 함'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerChange('purpleElectrode', option)}
                    className={`rating-btn ${reportAnswers.purpleElectrode === option ? 'active' : ''}`}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    {option}극
                  </button>
                ))}
              </div>
              {reportAnswers.purpleElectrode && (
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: reportAnswers.purpleElectrode === '(+)' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {reportAnswers.purpleElectrode === '(+)' ? '✓ 정답입니다! 과망가니즈산 이온은 음이온입니다.' : '✕ 다시 생각해보세요. 음이온은 어디로 끌릴까요?'}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>실험 중 관찰한 색 변화 현상 상세 기록</span>
            <textarea
              className="form-textarea"
              placeholder="예: 전압을 가한 뒤 약 5분이 지나자, 연필선 가운데에 있던 파란색 구리 이온 성분은 (-)극 방향으로 번져 나가며 이동했고, 보라색 과망가니즈산 이온 성분은 (+)극 방향으로 번져 나가며 길게 띠를 형성하여 이동하는 것을 관찰했다."
              value={reportAnswers.observationDetail}
              onChange={(e) => handleAnswerChange('observationDetail', e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group drawing-form-group">
            <label className="form-label">이온의 이동 결과 그림으로 표현하기</label>
            <IonMovementDrawing
              value={reportAnswers.ionDrawing}
              onChange={(imageData) => handleAnswerChange('ionDrawing', imageData)}
            />
          </div>
        </div>

        {/* Discussion Questions */}
        <div className="form-group">
          <label className="form-label">
            3. 정리 및 토의 (추론 문항) <span className="badge-required">필수</span>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {/* Blue ion explanation */}
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Q1. 구리 이온은 어떤 전하를 띠고 있으며, 그렇게 생각한 까닭은 무엇인가?</p>
              <textarea
                className="form-textarea"
                placeholder="예: 파란색 구리 이온은 (-)극으로 이동했기 때문에, 서로 다른 전하끼리 끌어당기는 성질에 의해 구리 이온은 양(+)전하를 띠고 있음을 알 수 있다."
                value={reportAnswers.copperExplanation}
                onChange={(e) => handleAnswerChange('copperExplanation', e.target.value)}
                style={{ minHeight: '60px' }}
              />
              {copperVal && (
                <span className={`validation-hint ${copperVal.status === 'success' ? 'correct' : ''}`} style={{ marginTop: '0.25rem', display: 'block' }}>
                  {copperVal.msg}
                </span>
              )}
            </div>

            {/* Purple ion explanation */}
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Q2. 과망가니즈산 이온은 어떤 전하를 띠고 있으며, 그렇게 생각한 까닭은 무엇인가?</p>
              <textarea
                className="form-textarea"
                placeholder="예: 보라색 과망가니즈산 이온은 (+)극으로 이동했기 때문에, 서로 다른 전하끼리 끌어당기는 성질에 의해 과망가니즈산 이온은 음(-)전하를 띠고 있음을 알 수 있다."
                value={reportAnswers.permanganateExplanation}
                onChange={(e) => handleAnswerChange('permanganateExplanation', e.target.value)}
                style={{ minHeight: '60px' }}
              />
              {permanganateVal && (
                <span className={`validation-hint ${permanganateVal.status === 'success' ? 'correct' : ''}`} style={{ marginTop: '0.25rem', display: 'block' }}>
                  {permanganateVal.msg}
                </span>
              )}
            </div>

            {/* Electrolyte KNO3 explanation */}
            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Q3. 거름종이에 질산 칼륨(KNO₃) 수용액을 적셔주는 까닭은 무엇인가?</p>
              <textarea
                className="form-textarea"
                placeholder="예: 순수한 물은 전기가 잘 통하지 않기 때문에, 질산 칼륨 수용액을 적셔줌으로써 전류가 잘 흐르게 돕는 전해질 역할을 하기 위함이다."
                value={reportAnswers.electrolyte}
                onChange={(e) => handleAnswerChange('electrolyte', e.target.value)}
                style={{ minHeight: '60px' }}
              />
              {electrolyteVal && (
                <span className={`validation-hint ${electrolyteVal.status === 'success' ? 'correct' : (electrolyteVal.status === 'warning' ? 'warning' : '')}`} style={{ marginTop: '0.25rem', display: 'block', color: electrolyteVal.status === 'warning' ? 'var(--warning)' : '' }}>
                  {electrolyteVal.msg}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="form-group">
          <label className="form-label">
            4. 실험 결론 <span className="badge-required">필수</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="예: 이온은 전하를 띠고 있으므로 수용액 상태에서 전압을 가하면 이온의 전하 부호와 반대되는 전극 방향으로 이동한다. 파란색 구리 양이온은 (-)극으로, 보라색 과망가니즈산 음이온은 (+)극으로 이동한다."
            value={reportAnswers.conclusion}
            onChange={(e) => handleAnswerChange('conclusion', e.target.value)}
          />
        </div>

        {/* Self Evaluation */}
        <div className="form-group">
          <label className="form-label">
            5. 학생 자기 평가표 (Self-Evaluation)
          </label>
          <div className="self-eval-grid">
            {[
              { id: 'attitude', label: '① 실험에 흥미를 느끼고 주도적으로 끝까지 참여하였는가? (탐구 태도)' },
              { id: 'skill', label: '② 실험 안전 수칙을 준수하고 기구와 시약을 올바르게 다루었는가? (탐구 기능)' },
              { id: 'knowledge', label: '③ 이온이 전하를 띠며 전기장에서 반대 전극으로 이동함을 설명할 수 있는가? (탐구 지식)' }
            ].map((item) => (
              <div key={item.id} className="self-eval-item">
                <span className="self-eval-desc">{item.label}</span>
                <div className="rating-options">
                  {['우수(상)', '보통(중)', '노력요함(하)'].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleEvalChange(item.id, rating)}
                      className={`rating-btn ${selfEvaluation[item.id] === rating ? 'active' : ''}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export / Submit Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={triggerPrint}
          className="btn btn-primary"
          style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px', gap: '0.75rem' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          평가 보고서 인쇄 및 PDF 저장
        </button>
        <button
          type="button"
          onClick={submitReportToDrive}
          className="btn btn-secondary"
          style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px', gap: '0.75rem' }}
          title={canSubmitToDrive ? '선생님 Google Drive 폴더로 제출' : '관리자 모드에서 Drive 제출 URL을 먼저 저장하세요'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          선생님 Drive로 제출
        </button>
        {submitStatus && (
          <p style={{ width: '100%', textAlign: 'center', color: submitStatus.includes('실패') ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 800, fontSize: '0.9rem' }}>
            {submitStatus}
          </p>
        )}
      </div>
    </div>
  );
}
