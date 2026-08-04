# Thiệp mời đám cưới tiếng Việt

Landing page thiệp cưới của Thái Ngọc và Ngọc Linh. Trang chỉ hiển thị tiếng Việt, có hai khung giờ nhập tiệc 15:00 và 17:00, cùng biểu mẫu RSVP có lựa chọn khung giờ dành cho khách tham dự.

## Chạy trên máy

Yêu cầu Node.js 22.13 trở lên.

```powershell
npm install
npm run dev
```

Kiểm tra bản dựng Vercel:

```powershell
npm run build:vercel
```

Thông tin đám cưới nằm trong `src/config/wedding.ts`.

## Kết nối với Google Form thuộc email mới

Mã nguồn không còn chứa URL hay mã trường của Google Form cũ. Khi chưa cấu hình form mới, trang hoạt động ở chế độ thử nghiệm và không gửi dữ liệu đi.

1. Đăng nhập bằng tài khoản Google mới và tạo một Google Form trống.
2. Tạo đúng 7 câu hỏi sau:
   - **Họ và tên** — trả lời ngắn.
   - **Xác nhận tham dự** — trắc nghiệm, gồm `Tôi sẽ tham dự` và `Tôi không thể tham dự`.
   - **Khung giờ nhập tiệc** — trắc nghiệm, gồm `15:00` và `17:00`.
   - **Số người tham dự** — danh sách thả xuống hoặc trả lời ngắn.
   - **Tên người đi cùng** — trả lời ngắn.
   - **Lời nhắn cho cô dâu chú rể** — đoạn văn.
   - **Số điện thoại hoặc email** — trả lời ngắn.
3. Trong Google Form, liên kết form với một Google Sheet mới thuộc cùng tài khoản mới.
4. Chọn menu ba chấm, chọn **Nhận đường liên kết điền sẵn**, điền dữ liệu mẫu khác nhau vào từng câu hỏi rồi lấy liên kết. Trong URL đó, mỗi câu hỏi có mã dạng `entry.123456789`.
5. URL gửi dữ liệu được tạo từ URL công khai của form: đổi phần cuối `/viewform` thành `/formResponse`.
6. Sao chép `.env.example` thành `.env`, rồi điền URL và các mã trường tương ứng:

```env
VITE_RSVP_ENDPOINT=https://docs.google.com/forms/d/e/FORM_ID/formResponse
VITE_RSVP_ENTRY_NAME=entry.111111111
VITE_RSVP_ENTRY_ATTENDANCE=entry.222222222
VITE_RSVP_ENTRY_BANQUET_TIME=entry.333333333
VITE_RSVP_ENTRY_GUEST_COUNT=entry.444444444
VITE_RSVP_ENTRY_COMPANIONS=entry.555555555
VITE_RSVP_ENTRY_MESSAGE=entry.666666666
VITE_RSVP_ENTRY_CONTACT=entry.777777777
```

Các mã trên chỉ là ví dụ. Phải dùng mã thật lấy từ Google Form mới. Trước khi gửi thiệp, hãy gửi thử một phản hồi cho cả 15:00 và 17:00 rồi kiểm tra hai dòng tương ứng trong Google Sheet.

## Tạo GitHub repository hoàn toàn mới

Không khởi tạo lại Git ngay trong thư mục hiện tại vì thư mục này đang có lịch sử và remote cũ. Hãy tạo một bản sao mã nguồn không có thư mục `.git`:

```powershell
cd "C:\Users\thai ngoc\Desktop"
robocopy "PAGE WEDDING CARD (tieng viet)" "WEDDING-CARD-MOI" /E /XD .git node_modules dist dist-vercel build .vinext .wrangler
cd "WEDDING-CARD-MOI"
git init -b main
git add .
git commit -m "Initial Vietnamese wedding invitation"
```

Sau đó:

1. Đăng nhập GitHub bằng tài khoản mới cần sử dụng.
2. Chọn **New repository**, đặt tên mới, để repository trống — không tạo README, `.gitignore` hoặc license trên GitHub.
3. Sao chép URL HTTPS của repository mới và chạy:

```powershell
git remote add origin https://github.com/TAI_KHOAN_MOI/TEN_REPOSITORY_MOI.git
git remote -v
git push -u origin main
```

Trước khi push, kết quả `git remote -v` phải chỉ hiển thị repository mới. Nếu Git yêu cầu đăng nhập, chọn đúng tài khoản GitHub mới.

## Tạo project Vercel mới

1. Đăng xuất tài khoản Vercel cũ hoặc mở cửa sổ riêng tư, rồi đăng nhập bằng email/tài khoản mới.
2. Chọn **Add New → Project** và import repository GitHub mới.
3. Dự án đã có `vercel.json`; Build Command là `npm run build:vercel`, Output Directory là `dist-vercel`.
4. Trong **Environment Variables**, thêm toàn bộ biến `VITE_RSVP_*` của Google Form mới và `VITE_SITE_URL`.
5. Deploy, lấy URL Vercel mới, cập nhật `VITE_SITE_URL`, rồi redeploy.
6. Gửi thử RSVP trên URL thật và kiểm tra Google Sheet trước khi chia sẻ cho khách.

Không cần kết nối repository hoặc project Vercel mới với tài khoản cũ.
