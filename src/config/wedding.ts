export const wedding = {
  groomName: "Thái Ngọc",
  brideName: "Ngọc Linh",
  weddingDate: "2026-10-12",
  weddingDateHeroDisplay: "12.10.2026",
  weddingDateDisplay: "12.10.2026 (dương lịch)",
  weddingDateLong: "12 tháng 10 năm 2026 (dương lịch)",
  weekday: "Thứ Hai",
  receptionTime: "14:30",
  banquetTimes: ["15:00", "17:00"],
  venueName: "Tại nhà cô dâu",
  venueAddress:
    "Địa chỉ: Đội 9, Cẩm Đội, phường Nông Trang, tỉnh Phú Thọ",
  venuePhone: "",
  googleMapsUrl:
    "https://www.google.com/maps?q=21.33199519890027,105.35638231689768",
  replyDeadline: "2026-09-30",
  replyDeadlineDisplay: "30.09.2026 (dương lịch)",
  coverImage: "/wedding-cover-mobile.jpg",
  ogImage: "/og-wedding-vi.png",
  publicUrl: "https://wedding-invitation.vercel.app",
  showTimeline: false,
  timeline: [
    { time: "14:30", label: "Đón khách" },
    { time: "15:00", label: "Nhập tiệc – khung giờ 1" },
    { time: "17:00", label: "Nhập tiệc – khung giờ 2" },
  ],
  heroMessage:
    "Chúng tôi rất mong được gặp mọi người\ntrong ngày đặc biệt này.",
  greeting: {
    intro: "Với tất cả niềm hân hoan,",
    announcement:
      "xin được báo tin lễ thành hôn của chúng tôi sẽ được cử hành vào ngày",
    invitation:
      "Chúng tôi cùng hai gia đình chân thành kính mời quý vị đến chung vui và chia sẻ khoảnh khắc đặc biệt này.",
    closing:
      "Sự hiện diện của quý vị sẽ là niềm vinh hạnh và hạnh phúc lớn lao đối với chúng tôi.",
  },
  footerMessage:
    "Ngày đặc biệt sẽ trở nên trọn vẹn hơn khi có sự hiện diện của quý vị.",
} as const;
