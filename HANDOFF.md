# 🧪 프로젝트 인계 문서 (Project Handoff for ChatGPT Codex)

이 문서는 **이온의 이동 가상 실험실 & 보고서 작성기** 프로젝트의 구조, 최근 작업 내역 및 후속 개발(데이터 처리 및 기능 보완) 가이드를 Codex 에이전트가 즉시 이해하고 작업을 이어갈 수 있도록 정리한 파일입니다.

---

## 1. 프로젝트 개요 (Overview)
* **목적**: 중학교 과학 '물질의 구성' 단원의 '이온의 이동' 실험을 가상으로 수행하고, 실시간 피드백을 통해 단계별 체크리스트 작성과 탐구 보고서를 완성하여 PDF/인쇄물로 출력하는 교육용 웹 애플리케이션입니다.
* **기술 스택**: React (v19), Vite (v8), Vanilla CSS (Tailwind 사용 안 함), Oxlint (Linter).
* **주요 기능**:
  1. **실험 가이드 & 체크리스트** (Step 1~4)
  2. **가상 실험 시뮬레이터** (실시간 전압 조절, 이온 가속 및 전하 이동 애니메이션)
  3. **보고서 작성기** (실시간 키워드 감지 및 정답 검증 엔진 탑재)
  4. **설계 관리자 모드** (실험 스텝 이름, 목표, 체크리스트 세부 문항 커스텀 수정 가능, PIN 인증 포함)
  5. **인쇄 전용 깔끔한 출력 뷰 (PDF 변환)**

---

## 2. 프로젝트 디렉토리 및 컴포넌트 구조
* **[App.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/App.jsx)**: 중앙 상태(학습자 정보, 체크리스트 달성율, 시뮬레이터 상태값, 보고서 답변, 테마 모드) 및 스텝 제어 로직 관리.
* **[ExperimentSimulator.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/ExperimentSimulator.jsx)**: SVG 그래픽 기반 가상 실험 기구. 전압 및 전원 제어에 따른 구리 이온($Cu^{2+}$, 파란색)과 과망가니즈산 이온($MnO_4^-$, 보라색)의 이동을 애니메이션화.
* **[ReportWriter.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/ReportWriter.jsx)**: 학습자 학번/이름 입력, 가설 설정, 탐구 질문(Q1~Q3), 자기평가표 작성 폼 및 텍스트 검증 정답 도우미.
* **[ReportPrintView.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/ReportPrintView.jsx)**: `window.print()` 호출 시에만 나타나는 인쇄용 레이아웃 컴포넌트.
* **[StepRenderer.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/StepRenderer.jsx)**: Step 1~4의 체크리스트 UI 렌더링.
* **[AdminPanel.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/AdminPanel.jsx)**: 실험 설계 관리자 패널 (기본 PIN: `2726`).
* **[App.css](file:///c:/src/vscode/middle%20school/4ion_move_report/src/App.css)**: 다크/라이트 테마 토큰, CSS Glow 애니메이션, 모바일 반응형 및 프린트 미디어 쿼리 제어.

---

## 3. 최근 완료된 수정 내역 (Completed Work)

1. **테마 상태 영구 보존**: 다크/라이트 모드 설정이 새로고침 시 초기화되는 문제를 해결하기 위해 `localStorage('ion_experiment_theme')`를 추가하고 `useEffect`를 통해 상태를 동기화했습니다.
2. **모바일 반응형 스텝 Stepper 개선**: 모바일 등 좁은 뷰포트에서 상단 스텝 카드들이 세로로 찌그러지거나 겹쳐 보이는 현상을 해결하기 위해 가로 스와이프 터치 스크롤 스레드 스타일(`overflow-x: auto`)을 적용했습니다.
3. **Admin Panel 반응형 버그 수정**: 모바일 뷰에서 관리자 패널의 2열 그리드가 붕괴되던 문제를 해결하고자 `AdminPanel.jsx` 내부의 인라인 그리드 열 설정을 제거하고 `App.css` 클래스로 반응형 처리를 완전 이관했습니다.
4. **시뮬레이터 CPU 오버헤드 최적화**: 이온들이 전기장에 의해 양끝 전극(Left `0.15`, Right `0.85`)에 도달한 이후에도 백그라운드에서 `requestAnimationFrame`이 무한 루프를 도는 현상을 방지하도록 Ref 기반 비교 구문을 추가해 애니메이션을 자동 종료시켰습니다.
5. **PDF 인쇄 본문 겹침 문제 해결**: 인쇄 모드 실행 시 기존 대화형 보고서 양식과 인쇄 전용 양식이 중첩되던 버그를 완전히 격리하기 위해 `@media print` 시 일반 UI 최상단 레이아웃인 `.main-content`와 `.app-header` 전체를 숨김 처리하여 정돈된 표 양식만 깔끔하게 출력되도록 교정했습니다.
6. **텍스트 버그 수정**: 이온 이동 결과 정리 테이블에서 이동 극을 `이동 안 함`으로 선택 시 `이동 안 함극`으로 어색하게 꼬리가 달리던 출력 에러를 수정했습니다.
7. **코드 린팅**: Oxlint 린트 룰에 맞춰 불필요한 Catch 블록 내 예외 매개변수 선언 경고를 소거하여 `0 warnings, 0 errors` 빌드를 확립했습니다.

---

## 4. Codex 에이전트가 처리할 후속 작업 및 보완 아이디어 (Next Steps)

### A. 데이터 처리 보완 (Data Processing)
1. **설계 템플릿 내보내기/가져오기 (JSON Export/Import)**:
   * 관리자 모드([AdminPanel.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/AdminPanel.jsx))에서 교사가 수정한 스텝 데이터(`ion_experiment_steps`)를 파일(`JSON`)로 다운로드하거나, 기작성된 JSON 파일을 업로드하여 일괄 반영하는 데이터 연동 기능을 추가할 수 있습니다.
2. **학생 보고서 데이터 제출 및 CSV 다운로드**:
   * 학생들이 인쇄만 하는 것 외에 학년/반 데이터를 기준으로 로컬 스토리지에 학생 여러 명의 데이터를 누적 저장할 수 있도록 하거나, 전체 작성 완료 목록을 하나의 **CSV 파일로 백업/다운로드**하는 교사용 통계 데이터 처리 기능 보완을 제안합니다.
   * 실제 백엔드 API 서버가 연동될 경우를 대비해 완성된 JSON 보고서 데이터를 REST API(`fetch`)로 송신하는 API 요청 모듈 개발이 가능합니다.
3. **정밀 자동 채점 기능 (Automated Grading Engine)**:
   * [ReportWriter.jsx](file:///c:/src/vscode/middle%20school/4ion_move_report/src/components/ReportWriter.jsx)의 텍스트 검증 로직을 고도화하여 학생이 작성한 가설, 추론 답변에서 핵심 키워드 유무와 맥락 유사성을 판단한 후 가독성 높은 점수를 부여하여 교사 확인란 옆에 표시할 수 있습니다.

### B. 시뮬레이터 및 UX 기능 보완 (Simulator & UX)
1. **전극 연결선 극성 스왑(Crocodile Clip drag & swap)**:
   * 현재 시뮬레이터는 고정된 좌측(-) 우측(+) 구조를 가집니다. 악어 집게의 빨간선과 검은선 위치를 드래그 앤 드롭으로 스왑하거나 전원공급장치의 스위치 극성을 누르면 이온이 이동하는 방향도 그에 맞춰 실시간 반전되는 물리 반응 체계를 보완해 볼 수 있습니다.
2. **직접 스포이트로 시약 떨어뜨리기 (Interactive Reagent Dripping)**:
   * 2단계 점적 시 체크만 하면 시약이 생기는 방식 대신, 사용자가 직접 스포이트 도구를 마우스로 드래그하여 기준선 중앙에 1방울 떨어뜨려야만 스텝이 진행되는 물리 드롭 액션을 Simulator 모듈 내에 구성할 수 있습니다.
