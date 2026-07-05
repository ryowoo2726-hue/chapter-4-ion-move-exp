# Google Drive 제출 및 수업 설정 공유

이 Apps Script는 두 가지 역할을 합니다.

1. 학생 보고서 PDF를 선생님 Google Drive 폴더에 저장합니다.
2. 관리자 모드에서 수정한 실험 단계 제목/목표/체크리스트를 저장하고, 학생 화면에서 불러오게 합니다.

## 설정 방법

1. Google Drive에 제출 폴더를 만듭니다.
2. 폴더 URL에서 ID를 복사해 `Code.gs`의 `FOLDER_ID`에 붙여 넣습니다.
3. Apps Script에서 Web app으로 배포합니다.
   - Execute as: Me
   - Who has access: Anyone 또는 학교 조직
4. 배포 URL을 앱의 관리자 모드 `Google Drive 제출 URL`에 저장합니다.
5. Apps Script를 수정한 뒤에는 반드시 `Deploy > Manage deployments > Edit > New version`으로 다시 배포합니다.

관리자 모드에서 단계 설정을 저장하면 같은 Web App URL에 설정이 저장됩니다. 이후 학생들이 사이트에 접속하면 최신 단계 설정을 자동으로 불러옵니다.
