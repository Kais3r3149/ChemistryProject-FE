# ChemistryProject-FE

Frontend cho Drug Interaction Checker — ứng dụng tra cứu tương tác thuốc sử dụng dữ liệu từ DrugBank.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React

## Yêu cầu

- Node.js >= 18
- npm >= 9
- Backend API đang chạy (xem [ChemistryProject-BE](https://github.com/Kais3r3149/ChemistryProject-BE))

## Cài đặt & Chạy

```bash
# 1. Clone repo
git clone https://github.com/Kais3r3149/ChemistryProject-FE.git
cd ChemistryProject-FE/drug-interaction-checker

# 2. Cài dependencies
npm install

# 3. Tạo file môi trường
cp .env.example .env.local
```

Chỉnh `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
# 4. Chạy dev server
npm run dev
```

Mở trình duyệt tại **http://localhost:3000**

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production build |
| `npm run lint` | Kiểm tra lint |

## Cấu trúc thư mục

```
drug-interaction-checker/
├── app/
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Dashboard, History, Interactions
│   └── globals.css
├── components/
│   ├── dashboard/       # Stats, RecentSearches, ResultCard
│   ├── interactions/    # DDI, DTI, Drug-Food, Drug-Condition forms
│   ├── landing/         # Hero, Features, HowItWorks, CTA
│   ├── layout/          # Sidebar, Topbar, Footer
│   └── ui/              # Base components
├── hooks/
├── lib/
│   ├── api.ts           # API client
│   ├── constants.ts
│   └── utils.ts
├── PRODUCT.md           # Product design context
└── DESIGN.md            # Design system documentation
```

## Tính năng

- **Drug-Drug Interaction (DDI):** Kiểm tra tương tác giữa 2 thuốc, phân loại Major / Moderate / Minor
- **Drug-Target Interaction (DTI):** Xem các protein/enzyme target của thuốc, liên kết UniProt
- **Drug-Food Interaction:** Tương tác với thực phẩm, đồ uống, thảo dược
- **Drug Condition:** Chỉ định điều trị và thông tin độc tính
- **Search History:** Lưu và hiển thị lịch sử tìm kiếm theo loại
- **JWT Authentication:** Đăng nhập / đăng ký, hiển thị tên user từ token
