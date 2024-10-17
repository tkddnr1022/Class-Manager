# Class-Manager
위치기반 QR 출석 체크 애플리케이션

## Documents
- [개요](https://powerful-aries-478.notion.site/1f3f47f8875b43efacaa9a9911d10944?pvs=4)<br>
- [개발일지](https://powerful-aries-478.notion.site/8f9462fd3f6641c2b224bc0a5b3a12de?pvs=4)<br>
- Swagger API Docs: {BACKEND_URL}/api-docs

## Stacks
- **Frontend**: React Native, Expo
- **Backend**: Nest.js
- **Database**: MongoDB

## Packages
- **Frontend**: react-native-paper, react-native-qrcode-svg, react-native-toast-message, react-native-barcode-mask, loadash, axios, eventemitter3
- **Backend**: mongoose, cqrs, class-validator, passport, jwt, bcrypt, haversine-distance, terminus, swagger

## Screenshots
<img src="https://github.com/user-attachments/assets/c65a4707-7ee3-4bb2-a8e4-cccd9a638191" alt="signup" width="200" />
<img src="https://github.com/user-attachments/assets/724cca25-c5d8-4c5e-be01-b2531a604600" alt="mypage" width="200" />
<img src="https://github.com/user-attachments/assets/c1c947e1-e117-4633-8d32-c56e0dd6b456" alt="Screenshot_1728945502" width="200" />
<img src="https://github.com/user-attachments/assets/a37249d1-ef3b-4274-a5e4-5bd2e60285ee" width="200" />
<img src="https://github.com/user-attachments/assets/c6640eab-8785-40cc-abc2-0e60c6ee5dd3" alt="Screenshot_1728944722" width="200" />
<img src="https://github.com/user-attachments/assets/84fa261a-717a-4a08-9fb5-32d8ad80348e" alt="Screenshot_1728944567" width="200" />
<img src="https://github.com/user-attachments/assets/2fe60546-0b88-466d-b1ee-18fa46a2348c" alt="Screenshot_1728945456" width="200" />
<img src="https://github.com/user-attachments/assets/b255eaa6-c3d2-43e8-83a6-79e9403dd3a0" alt="Screenshot_1728944864" width="200" />
<img src="https://github.com/user-attachments/assets/321216b4-8164-499b-b1a5-732a52ca72af" alt="Screenshot_1728945072" width="200" />
<img src="https://github.com/user-attachments/assets/87a9e44b-03d6-483b-b5c9-660c67aa21e3" alt="Screenshot_1728945088" width="200" />

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

## Configuration
애플리케이션 실행을 위해 환경변수 설정 필요
### Frontend
`/client/.env` 생성 후 아래와 같이 작성
```
API_URL = {BACKEND_URL}
```
`/client/eas.json` 에 아래와 같이 작성
<br>(작성 예정)
### Backend
`/server/.env` 생성 후 아래와 같이 작성
```
MONGO_URI = {MongoDB URI}
MONGO_USERNAME = {MongoDB Username}
MONGO_PASSWORD = {MongoDB Password}
JWT_SECRET = {JWT Secret Key}
JWT_ACCESS_EXP = '30m'
JWT_REFRESH_EXP = '7d'
LOCATION_RANGE = 100
```

## Build and run
프로덕션 빌드 혹은 개발 환경 실행 방법
### Frontend
- 개발 환경에서 실행
```
$ cd client
$ npm run start
```
> - 웹 실행 시 `w` 키 입력<br>
> - 안드로이드 실행 시 `s` 키 입력으로 expo go 진입 후 `a` 키 입력
- 프로덕션 빌드
<br>(작성 예정)
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
