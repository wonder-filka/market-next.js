"use client"

import { useI18n } from "@/locales/client"

export function ContactDetails() {
  const t = useI18n()

  return (
    <div className="space-y-12 text-base md:text-lg bg-black/70 rounded-3xl shadow-xl p-10">
      {/* Email */}
      <div className="transition hover:scale-[1.01] duration-200">
        <h2 className="text-xl font-semibold text-green-400 mb-3">
          {t("contactsBlock.emailTitle")}
        </h2>
        <p>
          <a
            href="mailto:support@example.com"
            className="text-blue-300 hover:underline break-words"
          >
            support@example.com
          </a>
        </p>
      </div>

      {/* Social */}
      <div className="transition hover:scale-[1.01] duration-200">
        <h2 className="text-xl font-semibold text-green-400 mb-3">
          {t("contactsBlock.socialTitle")}
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://t.me/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Telegram
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Twitter / X
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Instagram
            </a>
          </li>
        </ul>
      </div>

      {/* Address */}
      <div className="transition hover:scale-[1.01] duration-200">
        <h2 className="text-xl font-semibold text-green-400 mb-3">
          {t("contactsBlock.addressTitle")}
        </h2>
        <p className="text-gray-300">{t("contactsBlock.address")}</p>
      </div>
    </div>
  )
}