# Class-Manager
위치기반 QR 출석 체크 애플리케이션

## Documents
- [개요](https://powerful-aries-478.notion.site/1f3f47f8875b43efacaa9a9911d10944?pvs=4)<br>
- [개발일지](https://powerful-aries-478.notion.site/8f9462fd3f6641c2b224bc0a5b3a12de?pvs=4)<br>
- Swagger API Docs: `{BACKEND_URL}/api-docs`

## Stacks
- **Frontend**: React Native, Expo
- **Backend**: Nest.js
- **Database**: MongoDB

## Packages
- **Frontend**: react-native-paper, react-native-qrcode-svg, react-native-toast-message, react-native-barcode-mask, loadash, axios, eventemitter3
- **Backend**: mongoose, cqrs, class-validator, passport, jwt, bcrypt, haversine-distance, terminus, swagger

## Features
### Authentication
- JWT Token 전략
- 소셜 로그인(구글, 카카오)
- 이메일 인증
- 역할 기반 접근 제어
- 리소스 업데이트 시 소유자 검증
### Course
- 수업 생성 및 관리
- 수업 QR코드 촬영을 통한 출석(+딥링크)
- 부정 출석 방지(위치, 디바이스/유저 ID 중복 여부 검증)
### UI
- Material Design
- 다크 모드
### Future
- 웹 관리자 페이지
- 더 많은 Use Case 대응 예정

## Screenshots
<img src="https://github.com/user-attachments/assets/b77b55a3-74c9-4520-b3fb-35bc3e856f9b" alt="Screenshot_1730907307" width="200" />
<img src="https://github.com/user-attachments/assets/ceeeb0c2-7a4d-4f78-9d6c-8328984a385a" alt="Screenshot_1730907378" width="200" />
<img src="https://github.com/user-attachments/assets/c2bda66f-c6c3-42ba-87c2-ff7ecfdc0a59" alt="Screenshot_1730907748" width="200" />
<img src="https://github.com/user-attachments/assets/84fa64a5-10a1-4a19-bd0b-5825545b36ee" alt="Screenshot_1730907847" width="200" />
<img src="https://github.com/user-attachments/assets/126d204b-6533-4787-a781-cf2959642614" alt="Screenshot_1730907876" width="200" />
<img src="https://github.com/user-attachments/assets/bcdc28bc-52d9-40b6-bf03-29a54876d9ff" alt="Screenshot_1730907974" width="200" />
<img src="https://github.com/user-attachments/assets/88bb051b-a3e4-4e95-a066-bc97e2fb8c40" alt="Screenshot_1730908029" width="200" />
<img src="https://github.com/user-attachments/assets/d360ac28-1b59-4dea-bdad-87c7e467383c" alt="Screenshot_1730908000" width="200" />
<img src="https://github.com/user-attachments/assets/81603874-3d5f-4161-89ff-d8c030498115" alt="Screenshot_1730908054" width="200" />
<img src="https://github.com/user-attachments/assets/321216b4-8164-499b-b1a5-732a52ca72af" alt="Screenshot_1728945072" width="200" />
<img src="https://github.com/user-attachments/assets/57636286-93e2-4f3c-a302-81ff01bed94c" alt="Screenshot_1730908180" width="200" />
<img src="https://github.com/user-attachments/assets/723b6a5d-5c21-463c-9fd0-e84537a180e7" alt="Screenshot_1730908255" width="200" />

## Installation
- `/client` : 프론트엔드 디렉토리
- `/server` : 백엔드 디렉토리
### Frontend
```
$ cd client
$ npm install
```
### Backend
```
$ cd server
$ npm install
```
### Domain(ngrok)
- 구글 OAuth 2.0 사용을 위해서는 외부 도메인이 필요합니다.([개발일지](https://powerful-aries-478.notion.site/627f802edf1a408fae6dd049733c287d?pvs=97#12b1d3f66b8280de9612d918953e57ca))
<br>[ngrok 문서](https://ngrok.com/docs/getting-started/)를 참고하세요.
## Configuration
애플리케이션 실행을 위해 환경변수 설정 필요
### Frontend
- `/client/.env` 생성 후 아래와 같이 작성

    ```
    API_URL = {Backend_URL}
    ```
    - `API_URL`: 백엔드 서버의 루트 주소를 완전한 형식으로 입력합니다. 로컬 주소 사용 시 구글 OAuth 사용이 불가능합니다.
        > ex) `https://example.com`
- `/client/app.json` 수정(선택)

    ```
    ...
    [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
    ]
    ...
    ```
    - `usesCleartextTraffic`: http 프로토콜 접속을 허용합니다. 프로덕션 빌드에서는 이 옵션을 해제하는 것이 권장됩니다.
### Backend
- `/server/.env` 생성 후 아래와 같이 작성

    ```
    API_URL = {Backend URL}
    MONGO_URI = {MongoDB URI}
    MONGO_USERNAME = {MongoDB Username}
    MONGO_PASSWORD = {MongoDB Password}
    JWT_SECRET = {JWT Secret Key}
    JWT_ACCESS_EXP = '30m'
    JWT_REFRESH_EXP = '7d'
    LOCATION_RANGE = 100
    KAKAO_CLIENT_ID = {Kakao Client ID}
    GOOGLE_CLIENT_ID = {Google OAuth Client ID}
    GOOGLE_CLIENT_SECRET = {Google OAuth Client Secret}
    SMTP_USER = {SMTP Email}
    SMTP_PASS = {SMTP Pass}
    VERIFICATION_EXPIRES_IN = 600000
    ```
    - `API_URL`: 백엔드 서버의 루트 주소를 완전한 형식으로 입력합니다. 로컬 주소 사용 시 구글 OAuth 사용이 불가능합니다.
        > ex) `https://example.com`
    - `MONGO_URI`: MongoDB 연결 주소입니다. `mongodb+srv://` 를 제외한 URI를 작성해주세요.
    - `MONGO_USERNAME`, `MONGO_PASSWORD`: MongoDB 인증
    - `JWT_SECRET`: JWT Token 발급에 사용할 Secret Key 입니다. 안전한 값으로 입력합니다.
    - `JWT_ACCESS_EXP`, `JWT_REFRESH_EXP`: Access Token 과 Refresh Token 의 유효기간 입니다. 초 단위 혹은 문자열 형식으로 입력합니다.
    - `LOCATION_RANGE`: 출석 요청 검증 시 위치 오차범위 입니다. 미터 단위로 입력합니다.
    - `KAKAO_CLIENT_ID`: 카카오 로그인 시 사용할 APP KEY 입니다. [카카오 개발자 문서](https://developers.kakao.com/docs/latest/ko/getting-started/quick-start#create)를 참고하세요.
    - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: 구글 OAuth 2.0 사용 시 필요한 클라이언트 정보입니다. [구글 개발자 문서](https://developers.google.com/identity/protocols/oauth2/web-server) 혹은 [chrkb1569.log](https://velog.io/@chrkb1569/OAuth-2.0%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84#%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%84%A4%EC%A0%95) 게시물을 참고하세요.
    - `SMTP_USER`, `SMTP_PASS`: 이메일 인증 사용에 필요한 SMTP 인증 정보입니다. 필요시 [JungMin](https://velog.io/@jungmin_/%EC%9D%B4%EB%A9%94%EC%9D%BC-%EC%A0%84%EC%86%A1%ED%95%98%EA%B8%B0-SMTP) 게시물을 참고하세요.
    - `VERIFICATION_EXPIRES_IN`: 이메일 인증 코드의 유효 기간입니다. 밀리초 단위로 입력합니다.
## Build and run
프로덕션 빌드 혹은 개발 환경 실행 방법
### Frontend
- 개발 환경에서 실행

    ```
    $ cd client
    $ npm run start
    ```
    - Web: `w` 키 입력(검증되지 않음)
    - Android: `s` 키 입력으로 expo go 진입 후 `a` 키 입력
        > 안드로이드 실행 시 에뮬레이터가 필요합니다. [Expo 문서](https://docs.expo.dev/workflow/android-studio-emulator/)를 참고하세요.
- 프로덕션 빌드

  [EAS 빌드 문서](https://docs.expo.dev/build/setup/) 참고

Expo 와 관련된 내용은 [Expo Readme](https://github.com/tkddnr1022/Class-Manager/tree/main/client) 를 참고할 수 있습니다.
### Backend
- 개발 환경에서 실행

    ```
    $ cd server
    $ npm run start:dev
    ```
- 프로덕션 빌드

    ```
    $ cd server
    $ npm run build
    $ npm run start:prod
    ```
## File Structure
- **Frontend**(`/client`)

    ```
    📦client
    ┣ 📂app
    ┃ ┣ 📂(tabs)
    ┃ ┃ ┣ 📂course          # 수업 탭(교수와 관리자만 접근 가능)
    ┃ ┃ ┃ ┣ 📂edit
    ┃ ┃ ┃ ┃ ┗ 📜[id].tsx    # 수업 수정
    ┃ ┃ ┃ ┣ 📂qrcode
    ┃ ┃ ┃ ┃ ┗ 📜[id].tsx    # QR코드 보기
    ┃ ┃ ┃ ┣ 📜create.tsx    # 수업 생성
    ┃ ┃ ┃ ┣ 📜index.tsx     # 수업 목록
    ┃ ┃ ┃ ┣ 📜[id].tsx      # 수업 상세
    ┃ ┃ ┃ ┗ 📜_layout.tsx
    ┃ ┃ ┣ 📂entry           # 출석 탭
    ┃ ┃ ┃ ┣ 📜index.tsx     # 출석 기록
    ┃ ┃ ┃ ┣ 📜[id].tsx      # 출석 요청
    ┃ ┃ ┃ ┗ 📜_layout.tsx
    ┃ ┃ ┣ 📂profile         # 프로필 탭
    ┃ ┃ ┃ ┣ 📜edit.tsx      # 회원정보 수정
    ┃ ┃ ┃ ┣ 📜index.tsx     # 프로필
    ┃ ┃ ┃ ┣ 📜settings.tsx  # 앱 설정
    ┃ ┃ ┃ ┗ 📜_layout.tsx
    ┃ ┃ ┣ 📜home.tsx        # 홈 탭
    ┃ ┃ ┗ 📜_layout.tsx     # 탭 레이아웃
    ┃ ┣ 📜camera.tsx        # QR 스캐너
    ┃ ┣ 📜error.tsx         # 오류 페이지
    ┃ ┣ 📜index.tsx
    ┃ ┣ 📜login.tsx         # 로그인
    ┃ ┣ 📜oauth-profile.tsx # 소셜 로그인 프로필 입력
    ┃ ┣ 📜signup.tsx        # 회원 가입
    ┃ ┣ 📜verify-email.tsx  # 이메일 인증
    ┃ ┗ 📜_layout.tsx       # 최상위 레이아웃(세션 검사 수행, 테마 관리)
    ┣ 📂assets
    ┃ ┣ 📂fonts
    ┃ ┃ ┗ 📜SpaceMono-Regular.ttf
    ┃ ┗ 📂images
    ┃ ┃ ┣ 📜adaptive-icon.png
    ┃ ┃ ┣ 📜favicon.png
    ┃ ┃ ┣ 📜google-logo.png
    ┃ ┃ ┣ 📜icon.png
    ┃ ┃ ┣ 📜kakao-logo.png
    ┃ ┃ ┣ 📜partial-react-logo.png
    ┃ ┃ ┣ 📜react-logo.png
    ┃ ┃ ┣ 📜react-logo@2x.png
    ┃ ┃ ┣ 📜react-logo@3x.png
    ┃ ┃ ┗ 📜splash.png
    ┣ 📂components
    ┃ ┗ 📂navigation
    ┃ ┃ ┗ 📜TabBarIcon.tsx
    ┣ 📂constants
    ┃ ┗ 📜Colors.ts
    ┣ 📂hooks
    ┃ ┣ 📜useColorScheme.ts
    ┃ ┣ 📜useColorScheme.web.ts
    ┃ ┗ 📜useThemeColor.ts
    ┣ 📂interfaces
    ┃ ┣ 📜course.ts
    ┃ ┣ 📜entry.ts
    ┃ ┣ 📜health.ts
    ┃ ┣ 📜token.ts
    ┃ ┗ 📜user.ts
    ┣ 📂scripts
    ┃ ┣ 📂api               # API 요청 스크립트
    ┃ ┃ ┣ 📜auth.ts         # 인증 관련 요청
    ┃ ┃ ┣ 📜course.ts       # 수업 관련 요청
    ┃ ┃ ┣ 📜entry.ts        # 출석 관련 요청
    ┃ ┃ ┣ 📜health.ts       # 서버 상태 요청
    ┃ ┃ ┗ 📜user.ts         # 유저 관련 요청
    ┃ ┣ 📂utils             # 유틸리티
    ┃ ┃ ┣ 📜eventEmitter.ts # 이벤트 관리
    ┃ ┃ ┣ 📜interceptors.ts # Axios 인터셉터
    ┃ ┃ ┗ 📜storage.ts      # AsyncStorage 관리
    ┃ ┗ 📜reset-project.js
    ┣ 📜.gitignore
    ┣ 📜app.json
    ┣ 📜babel.config.js
    ┣ 📜eas.json
    ┣ 📜package-lock.json
    ┣ 📜package.json
    ┣ 📜README.md
    ┗ 📜tsconfig.json
    ```
- **Backend**(`/server`)

    ```
    📦server
    ┣ 📂src
    ┃ ┣ 📂auth                      # 인증 API
    ┃ ┃ ┣ 📂decorators
    ┃ ┃ ┃ ┗ 📜roles.decorator.ts    # 역할 명시 데코레이터
    ┃ ┃ ┣ 📂dtos
    ┃ ┃ ┃ ┣ 📜google-auth.dto.ts
    ┃ ┃ ┃ ┣ 📜kakao-auth.dto.ts
    ┃ ┃ ┃ ┣ 📜sign-in.dto.ts
    ┃ ┃ ┃ ┗ 📜verify-email.dto.ts
    ┃ ┃ ┣ 📂enums
    ┃ ┃ ┃ ┗ 📜roles.enum.ts
    ┃ ┃ ┣ 📂guard
    ┃ ┃ ┃ ┣ 📜jwt.guard.ts          # JWT Token 검사 수행
    ┃ ┃ ┃ ┣ 📜owner.guard.ts        # 소유자 검증 수행
    ┃ ┃ ┃ ┣ 📜roles.guard.ts        # 역할 검증 수행
    ┃ ┃ ┃ ┗ 📜verification.guard.ts # 이메일 인증 여부 검사 수행
    ┃ ┃ ┣ 📂interfaces
    ┃ ┃ ┃ ┣ 📜google-error.interface.ts
    ┃ ┃ ┃ ┣ 📜google-user.interface.ts
    ┃ ┃ ┃ ┣ 📜kakao-error.interface.ts
    ┃ ┃ ┃ ┣ 📜kakao-user.interface.ts
    ┃ ┃ ┃ ┣ 📜payload.interface.ts
    ┃ ┃ ┃ ┣ 📜token.interface.ts
    ┃ ┃ ┃ ┗ 📜verification.interface.ts
    ┃ ┃ ┣ 📂strategy
    ┃ ┃ ┃ ┗ 📜jwt.strategy.ts       # 추가 검증 수행
    ┃ ┃ ┣ 📜auth.controller.ts
    ┃ ┃ ┣ 📜auth.module.ts
    ┃ ┃ ┗ 📜auth.service.ts         # 비밀번호 검증, 토큰 발급, OAuth, 이메일 인증
    ┃ ┣ 📂course                    # 수업 API
    ┃ ┃ ┣ 📂commands
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜create-course.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜delete-course-handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-course.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜create-course.command.ts
    ┃ ┃ ┃ ┃ ┣ 📜delete-course.command.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-course.command.ts
    ┃ ┃ ┣ 📂dtos
    ┃ ┃ ┃ ┣ 📜create-course.dto.ts
    ┃ ┃ ┃ ┗ 📜update-course.dto.ts
    ┃ ┃ ┣ 📂events
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜course-created.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜course-deleted.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜course-updated.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜course-created.event.ts
    ┃ ┃ ┃ ┃ ┣ 📜course-deleted.event.ts
    ┃ ┃ ┃ ┃ ┗ 📜course-updated.event.ts
    ┃ ┃ ┣ 📂interfaces
    ┃ ┃ ┃ ┗ 📜coordinate.interface.ts
    ┃ ┃ ┣ 📂models
    ┃ ┃ ┃ ┗ 📜course.model.ts
    ┃ ┃ ┣ 📂queries
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜get-course-by-title.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-course-by-user.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-course.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜list-courses.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜get-course-by-title.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-course-by-user.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-course.query.ts
    ┃ ┃ ┃ ┃ ┗ 📜list-courses.query.ts
    ┃ ┃ ┣ 📂repositories
    ┃ ┃ ┃ ┗ 📜course.repository.ts
    ┃ ┃ ┣ 📜course.controller.ts
    ┃ ┃ ┣ 📜course.module.ts
    ┃ ┃ ┗ 📜course.service.ts       # 수업 CRUD
    ┃ ┣ 📂entry                     # 출석 API
    ┃ ┃ ┣ 📂commands
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜create-entry.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-entry.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜create-entry.command.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-entry.command.ts
    ┃ ┃ ┣ 📂dtos
    ┃ ┃ ┃ ┣ 📜create-entry.dto.ts
    ┃ ┃ ┃ ┗ 📜update-entry.dto.ts
    ┃ ┃ ┣ 📂events
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜entry-created.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜entry-updated.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜entry-created.event.ts
    ┃ ┃ ┃ ┃ ┗ 📜entry-updated.event.ts
    ┃ ┃ ┣ 📂interfaces
    ┃ ┃ ┃ ┗ 📜entry-filter.interface.ts
    ┃ ┃ ┣ 📂models
    ┃ ┃ ┃ ┗ 📜entry.model.ts
    ┃ ┃ ┣ 📂queries
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜get-entry-by-course-id.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-entry-by-user-id.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-entry.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜list-entries.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜get-entry-by-course-id.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-entry-by-user-id.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-entry.query.ts
    ┃ ┃ ┃ ┃ ┗ 📜list-entries.query.ts
    ┃ ┃ ┣ 📂repositories
    ┃ ┃ ┃ ┗ 📜entry.repository.ts
    ┃ ┃ ┣ 📜entry.controller.ts
    ┃ ┃ ┣ 📜entry.module.ts
    ┃ ┃ ┗ 📜entry.service.ts     # 출석 CRUD, 요청 검증(위치, 디바이스 ID 등)
    ┃ ┣ 📂health                 # 서버 상태 API
    ┃ ┃ ┣ 📜health.controller.ts
    ┃ ┃ ┗ 📜health.module.ts
    ┃ ┣ 📂templates
    ┃ ┃ ┗ 📜email.pug            # 인증 이메일 템플릿
    ┃ ┣ 📂user                   # 유저 API
    ┃ ┃ ┣ 📂commands
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜create-oauth.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜create-user.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-user.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜create-oauth.command.ts
    ┃ ┃ ┃ ┃ ┣ 📜create-user.command.ts
    ┃ ┃ ┃ ┃ ┗ 📜update-user.command.ts
    ┃ ┃ ┣ 📂dtos
    ┃ ┃ ┃ ┣ 📜check-email-response.dto.ts
    ┃ ┃ ┃ ┣ 📜create-user.dto.ts
    ┃ ┃ ┃ ┗ 📜update-user.dto.ts
    ┃ ┃ ┣ 📂events
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜user-created.handler.ts
    ┃ ┃ ┃ ┃ ┗ 📜user-updated.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜user-created.event.ts
    ┃ ┃ ┃ ┃ ┗ 📜user-updated.event.ts
    ┃ ┃ ┣ 📂models
    ┃ ┃ ┃ ┗ 📜user.model.ts
    ┃ ┃ ┣ 📂queries
    ┃ ┃ ┃ ┣ 📂handlers
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-email.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-oid.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-student-id.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user.handler.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-verification.handler.ts # 인증 코드 취득
    ┃ ┃ ┃ ┃ ┗ 📜list-users.handler.ts
    ┃ ┃ ┃ ┗ 📂impl
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-email.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-oid.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user-by-student-id.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-user.query.ts
    ┃ ┃ ┃ ┃ ┣ 📜get-verification.query.ts
    ┃ ┃ ┃ ┃ ┗ 📜list-users.query.ts
    ┃ ┃ ┣ 📂repositories
    ┃ ┃ ┃ ┗ 📜user.repository.ts
    ┃ ┃ ┣ 📜user.controller.ts
    ┃ ┃ ┣ 📜user.module.ts
    ┃ ┃ ┗ 📜user.service.ts         # 유저 CRUD
    ┃ ┣ 📜app.controller.ts
    ┃ ┣ 📜app.module.ts
    ┃ ┣ 📜app.service.ts
    ┃ ┗ 📜main.ts
    ┣ 📂test
    ┃ ┣ 📜app.e2e-spec.ts
    ┃ ┗ 📜jest-e2e.json
    ┣ 📜.eslintrc.js
    ┣ 📜.gitignore
    ┣ 📜.prettierrc
    ┣ 📜nest-cli.json
    ┣ 📜package-lock.json
    ┣ 📜package.json
    ┣ 📜README.md
    ┣ 📜tsconfig.build.json
    ┗ 📜tsconfig.json
    ```
