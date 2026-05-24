"use client";

import { useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { useLocale } from "next-intl";

const MESSAGES = {
  en: {
    label: "Disclaimer:",
    text: "This tool is for educational and research purposes only. It does not constitute medical advice. Always consult a qualified healthcare professional before making decisions about medications.",
    lang: "Drug interaction data is in English (DrugBank/FDA source data).",
  },
  vi: {
    label: "Lưu ý:",
    text: "Công cụ này chỉ dành cho mục đích học tập và nghiên cứu. Không thay thế tư vấn y tế. Hãy hỏi ý kiến bác sĩ hoặc dược sĩ trước khi quyết định về thuốc.",
    lang: "Nội dung tương tác thuốc hiển thị bằng tiếng Anh (theo dữ liệu gốc DrugBank/FDA).",
  },
};

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  const locale = useLocale();
  const msg = MESSAGES[locale as keyof typeof MESSAGES] ?? MESSAGES.en;

  if (dismissed) return null;

  return (
    <div className="relative flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <div className="flex-1 leading-relaxed space-y-0.5">
        <p>
          <span className="font-semibold">{msg.label} </span>
          {msg.text}
        </p>
        <p className="text-xs text-amber-600/80 dark:text-amber-400/70 italic">{msg.lang}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss disclaimer"
        className="shrink-0 rounded p-0.5 hover:bg-amber-200/60 dark:hover:bg-amber-800/40 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
