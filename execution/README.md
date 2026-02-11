# execution/ - Execution Layer (실행 계층)

이 디렉토리는 **결정적(deterministic) Python 스크립트**들을 저장합니다.

## 역할 (Layer 3: Execution)
- API 호출 처리
- 데이터 처리 로직
- 파일 작업
- 데이터베이스 상호작용

## 설계 원칙
- ✅ **결정적(Deterministic)**: 같은 입력 → 같은 출력
- ✅ **테스트 가능**: 단위 테스트 작성 용이
- ✅ **빠르고 신뢰성 높음**
- ✅ **잘 주석 처리됨**: 코드 의도가 명확해야 함

## 환경 변수
- `.env` 파일에서 API 토큰, 자격증명 등을 로드
- `python-dotenv` 라이브러리 사용 권장

## 예시 스크립트
```python
# execution/scrape_single_site.py
import os
from dotenv import load_dotenv

load_dotenv()

def scrape_website(url):
    """웹사이트를 스크래핑하는 결정적 함수"""
    # 실제 스크래핑 로직
    pass
```

