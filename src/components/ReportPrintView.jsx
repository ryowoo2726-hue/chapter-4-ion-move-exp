import React from 'react';
import { ION_DRAWING_BACKGROUND_SRC } from './IonMovementDrawing';

export default function ReportPrintView({
  studentInfo,
  reportAnswers,
  selfEvaluation
}) {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const blueMove = reportAnswers.blueElectrode || '미기록';
  const purpleMove = reportAnswers.purpleElectrode || '미기록';
  const drawingSrc = reportAnswers.ionDrawing || ION_DRAWING_BACKGROUND_SRC;

  return (
    <div id="report-print-container">
      <div className="print-header">
        <h1>과학 탐구 보고서</h1>
        <h2 style={{ border: 'none', margin: 0, padding: 0, fontSize: '13pt', color: '#555' }}>
          단원: 물질의 구성 - 이온의 이동 실험
        </h2>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>실험 일자</th>
            <td style={{ width: '25%' }}>{currentDate}</td>
            <th style={{ width: '15%' }}>학번</th>
            <td colSpan="3" style={{ width: '45%', fontWeight: 'bold' }}>{studentInfo.id || '        '}</td>
          </tr>
          <tr>
            <th>실험 주제</th>
            <td colSpan="5" style={{ textAlign: 'left', fontWeight: 'bold', paddingLeft: '12px' }}>
              이온의 이동 관찰 및 전하의 성질 규명
            </td>
          </tr>
        </thead>
      </table>

      <div className="print-section">
        <h2>1. 실험 목적</h2>
        <div className="print-content-box" style={{ minHeight: 'auto' }}>
          수용액 속의 이온은 전하를 띠고 있음을 알고, 전압을 걸어주었을 때 전하와 반대 부호의 전극으로 이동함을 가상 실험과 체크리스트 가이드를 통해 관찰 및 증명한다.
        </div>
      </div>

      <div className="print-section">
        <h2>2. 실험 가설</h2>
        <div className="print-content-box">
          {reportAnswers.hypothesis || '가설이 작성되지 않았습니다.'}
        </div>
      </div>

      <div className="print-section">
        <h2>3. 실험 결과 및 관찰</h2>
        <table className="print-table" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>구분</th>
              <th>주입 시약</th>
              <th>관찰 색상</th>
              <th>원인 이온</th>
              <th>이동한 전극</th>
              <th>이온의 전하 성질</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>양이온</td>
              <td>황산 구리 수용액 (CuSO4)</td>
              <td>파란색</td>
              <td>구리 이온 (Cu2+)</td>
              <td>{blueMove}</td>
              <td>{reportAnswers.blueElectrode === '(-)' ? '양(+)전하' : '미확인'}</td>
            </tr>
            <tr>
              <td>음이온</td>
              <td>과망가니즈산 칼륨 수용액 (KMnO4)</td>
              <td>보라색</td>
              <td>과망가니즈산 이온 (MnO4-)</td>
              <td>{purpleMove}</td>
              <td>{reportAnswers.purpleElectrode === '(+)' ? '음(-)전하' : '미확인'}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '9pt', fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>
          [상세 관찰 기록]
        </p>
        <div className="print-content-box" style={{ minHeight: '60px' }}>
          {reportAnswers.observationDetail || '관찰 내용이 작성되지 않았습니다.'}
        </div>

        <p style={{ fontSize: '9pt', fontWeight: 'bold', marginTop: '12px', marginBottom: '5px' }}>
          [이온의 이동 결과 그림]
        </p>
        <div className="print-drawing-box">
          <img src={drawingSrc} alt="이온의 이동 결과 그림" />
        </div>
      </div>

      <div className="print-section" style={{ pageBreakBefore: 'always', paddingTop: '20px' }}>
        <h2>4. 정리 및 토의 (추론 문항)</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          <div>
            <p style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '4px' }}>
              Q1. 파란색 구리 이온은 어느 전극으로 이동하며, 이를 통해 구리 이온은 어떤 전하를 띠고 있음을 알 수 있는가?
            </p>
            <div className="print-content-box" style={{ minHeight: '50px' }}>
              {reportAnswers.copperExplanation || '답안이 작성되지 않았습니다.'}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '4px' }}>
              Q2. 보라색 과망가니즈산 이온은 어느 전극으로 이동하며, 이를 통해 과망가니즈산 이온은 어떤 전하를 띠고 있음을 알 수 있는가?
            </p>
            <div className="print-content-box" style={{ minHeight: '50px' }}>
              {reportAnswers.permanganateExplanation || '답안이 작성되지 않았습니다.'}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '4px' }}>
              Q3. 거름종이에 질산 칼륨(KNO3) 수용액을 적셔주는 까닭은 무엇인가?
            </p>
            <div className="print-content-box" style={{ minHeight: '50px' }}>
              {reportAnswers.electrolyte || '답안이 작성되지 않았습니다.'}
            </div>
          </div>
        </div>
      </div>

      <div className="print-section">
        <h2>5. 실험 결론</h2>
        <div className="print-content-box" style={{ minHeight: '60px' }}>
          {reportAnswers.conclusion || '결론이 작성되지 않았습니다.'}
        </div>
      </div>

      <div className="print-section print-final-grid">
        <div>
          <h2 style={{ fontSize: '11pt', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '8px' }}>
            6. 자기 평가표
          </h2>
          <table className="print-eval-table">
            <thead>
              <tr>
                <th>평가 기준</th>
                <th style={{ width: '25%' }}>평가 등급</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>실험에 성실하게 참여하고 단계별 체크리스트를 준수했는가? (태도)</td>
                <td>{selfEvaluation.attitude || '미평가'}</td>
              </tr>
              <tr>
                <td>안전 수칙에 유의하고 기구와 시약을 바르게 조립 및 관찰했는가? (기능)</td>
                <td>{selfEvaluation.skill || '미평가'}</td>
              </tr>
              <tr>
                <td>이온이 전하를 띠며 전기장에서 반대 극으로 이동함을 이해했는가? (지식)</td>
                <td>{selfEvaluation.knowledge || '미평가'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ border: '1px solid #000', display: 'flex', flexDirection: 'column', borderRadius: '4px' }}>
          <div style={{ background: '#f2f2f2', borderBottom: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>
            교사 확인란
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10pt', color: '#999', minHeight: '60px' }}>
            ( 서명 / 날인 )
          </div>
        </div>
      </div>
    </div>
  );
}
