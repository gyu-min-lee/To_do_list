# TodoList 웹 애플리케이션

**Node.js, Express, MySQL**을 기반으로 구축된 풀스택 TodoList 웹 애플리케이션입니다.  
이 프로젝트는 **REST API 설계, 데이터베이스 연동, 그리고 프론트엔드와 백엔드 간의 통신**을 포함하여 웹 서비스의 기본 구조를 이해하기 위해 제작되었습니다.

이 애플리케이션을 통해 사용자는 할일을 관리할 수 있을 뿐만 아니라, **할일 목록의 스냅샷을 저장**하여 과거의 작업 상태를 조회할 수 있습니다.

---

## 주요 기능 (Features)

- 할일 생성, 조회, 수정 및 삭제 (CRUD)
- 할일 완료 상태 표시
- 현재 할일 목록의 스냅샷 저장
- 이전에 저장된 스냅샷 조회
- 스냅샷 삭제
- 스냅샷 기록 탐색을 위한 수평 드래그 UI

---

## 기술 스택 (Tech Stack)

프론트엔드
- HTML
- CSS
- 바닐라 자바스크립트 (Vanilla JavaScript)

백엔드
- Node.js
- Express

데이터베이스
- MySQL

---

## API 엔드포인트 (API Endpoints)

### Todo

- `POST /todos`
- `GET /todos`
- `PUT /todos/:id`
- `DELETE /todos/:id`

### Snapshots

- `POST /snapshots`
- `GET /snapshots`
- `DELETE /snapshots/:id`

---

## 배운 점 (What I Learned)

- Express를 활용한 RESTful API 설계
- Node.js 서버와 MySQL 연동
- fetch와 async/await를 이용한 비동기 요청 처리
- 프론트엔드-백엔드 데이터 흐름 관리
- 기본 CRUD 기능을 넘어선 추가 기능 구현
