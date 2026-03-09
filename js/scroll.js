// js/scroll.js

window.addEventListener("scroll", function () {
  const stickyContainer = document.querySelector(".sticky-container");
  const scenes = document.querySelectorAll(".scene");
  const dots = document.querySelectorAll(".dot");

  if (!stickyContainer) return; // 페이지에 스티키 영역 없으면 실행 안 함

  // 1. 전체 스크롤 진행률 계산
  const containerTop = stickyContainer.offsetTop; // 컨테이너 시작 위치
  const containerHeight = stickyContainer.offsetHeight - window.innerHeight; // 실제 스크롤 가능한 거리
  const scrollPosition = window.scrollY - containerTop; // 컨테이너 내부에서의 스크롤 위치

  // 2. 진행률 (0% ~ 100%)
  let progress = scrollPosition / containerHeight;

  // 범위 제한 (0보다 작거나 1보다 크지 않게)
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  // 3. 현재 몇 번째 장면인지 계산 (총 4장면)
  // 0~0.25: 1번, 0.25~0.5: 2번...
  let currentScene = Math.floor(progress * scenes.length);

  // 마지막 장면 처리 (끝까지 갔을 때 인덱스 오버 방지)
  if (currentScene >= scenes.length) currentScene = scenes.length - 1;

  // 4. 장면 교체 (Active 클래스 부여)
  scenes.forEach((scene) => scene.classList.remove("active"));
  scenes[currentScene].classList.add("active");

  // 5. 점(Dot) 교체
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentScene].classList.add("active");
});
