# Drug Interaction Checker — Frontend

Ứng dụng tra cứu tương tác thuốc toàn diện sử dụng dữ liệu từ DrugBank, openFDA, SIDER và GDSC2.

> **Disclaimer:** Ứng dụng dành cho mục đích học thuật và nghiên cứu. Không thay thế tư vấn y tế chuyên nghiệp.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **i18n:** next-intl (EN / VI)

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

| Module | Mô tả | Dữ liệu |
|--------|--------|---------|
| **Drug-Drug (DDI)** | Kiểm tra tương tác ≥2 thuốc, severity Major/Moderate/Minor/Unknown, FDA Label 22 sections | DrugBank 5.1 · 1.4M pairs |
| **Drug-Food** | Tương tác thực phẩm, đồ uống, thảo dược | DrugBank · 2,558 records |
| **Drug-Target (DTI)** | Protein/enzyme target của thuốc, liên kết UniProt | DrugBank · 24K records |
| **Drug-Condition** | Chỉ định điều trị và thông tin độc tính | DrugBank · 7K records |
| **Side Effects** | Tác dụng phụ từ SIDER | SIDER 4.1 · 77K records |
| **FDA Label** | Nhãn thuốc FDA đầy đủ 22 sections (live API) | openFDA |
| **Drug Response** | IC50/AUC sensitivity trên dòng tế bào ung thư | GDSC2 · 93K records |
| **Search History** | Lưu lịch sử tìm kiếm theo loại | Local |
| **i18n** | Giao diện song ngữ Tiếng Anh / Tiếng Việt | next-intl |
| **JWT Auth** | Đăng nhập / đăng ký, bảo vệ route | — |
