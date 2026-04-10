"use client";

import { useState, useEffect } from "react";

type CookieConsentProps = {
  dict: {
    cookie: {
      message: string;
      accept: string;
      decline: string;
    };
  };
};

const STORAGE_KEY = "chilloutsurf_cookie_consent";

export default function CookieConsent({ dict }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner after 2s if no preference stored
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return;

    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Cookie icon */}
          <div className="flex-shrink-0" aria-hidden="true">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
            </svg>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-300 leading-relaxed flex-1">
            {dict.cookie.message}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl border border-gray-600 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              {dict.cookie.decline}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-gray-900 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              {dict.cookie.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
