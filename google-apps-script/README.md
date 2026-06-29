# Google Drive 제출 설정

1. Google Drive에 제출 폴더를 만든다.
2. 폴더 URL에서 ID를 복사해 `Code.gs`의 `FOLDER_ID`에 붙여넣는다.
3. Apps Script에서 Web app으로 배포한다.
   - Execute as: Me
   - Who has access: Anyone 또는 학교 조직
4. 배포 URL을 앱 관리자 모드의 `Google Drive 제출 URL`에 저장한다.

학생 앱은 PDF를 생성해 이 Web App URL로 전송하고, Apps Script가 선생님 Drive 폴더에 파일을 만든다.
