News 게시물에 넣을 사진을 이 폴더에 저장하세요.
예: sbs-2024.jpg

maintenance/content.json의 해당 News 항목에 다음처럼 추가합니다.
"images": [{"file": "news/sbs-2024.jpg", "alt": "사진 설명", "caption": "선택 사항인 사진 캡션"}]

body에는 본문을 문단별로, links에는 관련 링크를 추가한 뒤 maintenance/build.py를 실행합니다.
사진은 원본 가로세로 비율을 유지하며 표시되고, 단일 HTML 미리보기에도 자동으로 포함됩니다.
