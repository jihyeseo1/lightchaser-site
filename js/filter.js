// js/filter.js

window.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".btn-filter");
  const items = document.querySelectorAll(".proj-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. 버튼 활성화 스타일 변경
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 2. 필터 값 가져오기 (all, mf, pf)
      const filterValue = btn.getAttribute("data-filter");

      // 3. 아이템 보여주기/숨기기
      items.forEach((item) => {
        if (filterValue === "all") {
          item.classList.remove("hide");
        } else {
          if (item.classList.contains(filterValue)) {
            item.classList.remove("hide");
          } else {
            item.classList.add("hide");
          }
        }
      });
    });
  });
});
