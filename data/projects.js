// data/projects.js
window.PROJECTS = {
  gwanghwa: {
    id: "gwanghwa",
    title: "그르릉, 와르르, 우르릉",
    kicker: "Media Facade",
    sub: "도시의 서사를 빛으로 기록하다",
    info: {
      place: "아뜰리에 광화",
      year: "2025",
      client: "커스텀엑스, 미디어아트 서울",
    },
    hero: {
      type: "video", // "image" 가능
      src: "assets/videos/gwanghwa-main.mp4",
    },
    output: [
      "assets/images/project/gwanghwa-2025/output/out-01.png",
      "assets/images/project/gwanghwa-2025/output/out-02.png",
      "assets/images/project/gwanghwa-2025/output/out-03.png",
      "assets/images/project/gwanghwa-2025/output/out-04.png",
      "assets/images/project/gwanghwa-2025/output/out-05.png",
      "assets/images/project/gwanghwa-2025/output/out-06.png",
      "assets/images/project/gwanghwa-2025/output/out-07.png",
      "assets/images/project/gwanghwa-2025/output/out-08.png",
    ],
    youtubeId: "yN3ZeNAn8qA",
    next: {
      href: "project-detail.html?id=shinsegae",
      label: "신세계 미디어 파사드 →",
    },
  },

  shinsegae: {
    id: "shinsegae",
    title: "신세계 미디어 파사드",
    kicker: "Media Facade",
    sub: "—",
    info: { place: "—", year: "2025", client: "—" },
    hero: {
      type: "image",
      src: "assets/images/project/mf/proj-mf-shinsegae.jpg",
    },
    output: [],
    youtubeId: "",
    next: { href: "project-detail.html?id=gwanghwa", label: "아뜰리에 광화 →" },
  },
};
