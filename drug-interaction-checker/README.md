# Drug Interaction Checker — Frontend

Ứng dụng tra cứu tương tác thuốc và dữ liệu dược học, xây dựng bằng Next.js 16 App Router.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **i18n:** next-intl (Tiếng Việt / English)
- **Auth:** JWT (lưu localStorage)

## Tính năng

| Module | Mô tả |
|--------|-------|
| **Drug-Drug** | Kiểm tra tương tác giữa nhiều thuốc cùng lúc |
| **Drug-Food** | Tương tác thuốc với thực phẩm |
| **Drug-Target** | Targets protein của thuốc (DrugBank) |
| **Drug-Condition** | Chỉ định và bệnh lý liên quan |
| **Drug Response** | Độ nhạy cảm tế bào ung thư với thuốc (GDSC2) |
| **References** | Nguồn dữ liệu và thống kê |
| **Settings** | Đổi mật khẩu |

## Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

> **Yêu cầu:** Backend API đang chạy tại `http://localhost:3001`

## Cấu trúc thư mục

```
app/
├── [locale]/
│   ├── (auth)/          # Login, Register, Forgot/Reset Password
│   └── (dashboard)/     # Các trang chính sau khi đăng nhập
│       ├── drug-drug/
│       ├── drug-food/
│       ├── drug-target/
│       ├── drug-condition/
│       ├── drug-response/
│       ├── references/
│       └── settings/
components/
├── interactions/        # Form components cho từng module
├── layout/              # Sidebar, Header, DisclaimerBanner
└── ui/                  # shadcn/ui components
lib/
├── api.ts               # Tất cả API calls đến backend
├── openfda.ts           # OpenFDA label fetching & parsing
└── constants.ts         # Nav config, constants
messages/
├── en.json              # English translations
└── vi.json              # Vietnamese translations
```

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Dev server với Turbopack |
| `npm run build` | Production build |
| `npm run start` | Chạy production build |
| `npm run lint` | Kiểm tra lint |
