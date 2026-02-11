# directives/ - Directive Layer (지시 계층)

이 디렉토리는 **Markdown 형식의 SOP (표준 작업 절차)**를 저장합니다.

## 역할 (Layer 1: Directive)
"무엇을 할 것인가"를 정의하는 계층입니다.

## 구성 요소
각 디렉티브는 다음을 포함해야 합니다:
- 📋 **목표 (Goals)**: 무엇을 달성하려는가?
- 📥 **입력 (Inputs)**: 어떤 데이터가 필요한가?
- 🛠️ **도구/스크립트 (Tools)**: `execution/`에 있는 어떤 스크립트를 사용하는가?
- 📤 **출력 (Outputs)**: 결과물은 무엇인가?
- ⚠️ **엣지 케이스 (Edge Cases)**: 주의해야 할 예외 상황은?

## 예시 디렉티브 구조

```markdown
# 웹사이트 스크래핑 SOP

## 목표
특정 웹사이트에서 데이터를 추출하여 Google Sheets에 저장

## 입력
- 대상 URL 리스트
- 추출할 데이터 필드

## 도구
- `execution/scrape_single_site.py`
- Google Sheets API

## 출력
- Google Sheets (공유 가능한 링크)

## 엣지 케이스
- API 속도 제한: 요청 간 2초 대기
- 타임아웃: 10초 후 재시도
```

## 중요 원칙
- ✅ **Living Document**: 학습 내용을 지속적으로 업데이트
- ✅ **자연어 작성**: 중급 직원에게 설명하듯 작성
- ✅ **명확하고 구체적**: 모호함 없이

