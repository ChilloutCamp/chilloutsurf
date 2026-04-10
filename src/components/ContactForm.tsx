"use client";

import { useState } from "react";
import { z } from "zod";

type ContactFormDict = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  required: string;
  invalidEmail: string;
  messageTooShort: string;
  consent: string;
  termsLink: string;
  consentRequired: string;
};

type ContactFormProps = {
  dict: { form: ContactFormDict };
};

const createSchema = (dict: ContactFormDict) =>
  z.object({
    firstName: z.string().min(1, dict.required),
    lastName: z.string().min(1, dict.required),
    email: z.string().email(dict.invalidEmail),
    phone: z.string().optional(),
    message: z.string().min(10, dict.messageTooShort),
    honeypot: z.string().max(0),
    consent: z.literal(true, { error: dict.consentRequired }),
  });

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  honeypot: "",
  consent: false,
};

export default function ContactForm({ dict }: ContactFormProps) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  const schema = createSchema(dict.form);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      setStatus("success");
      setForm(INITIAL);
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";

  const inputError = "border-red-400 focus:ring-red-500";

  if (status === "success") {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center"
      >
        <svg
          className="w-12 h-12 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-green-800 font-semibold text-lg">{dict.form.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {/* Honeypot — hidden from real users */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="honeypot">Leave this empty</label>
        <input
          id="honeypot"
          name="honeypot"
          type="text"
          value={form.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* First + Last name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {dict.form.firstName}
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={`${inputBase} ${errors.firstName ? inputError : ""}`}
          />
          {errors.firstName && (
            <p
              id="firstName-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600"
            >
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {dict.form.lastName}
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={`${inputBase} ${errors.lastName ? inputError : ""}`}
          />
          {errors.lastName && (
            <p
              id="lastName-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600"
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {dict.form.email}
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${inputBase} ${errors.email ? inputError : ""}`}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {dict.form.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
          className={inputBase}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {dict.form.message}
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputBase} resize-y min-h-[120px]`}
          style={errors.message ? { borderColor: "#f87171" } : {}}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* GDPR Consent */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={form.consent}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 min-w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
          />
          <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
            {dict.form.consent}{" "}
            <a
              href="#terms"
              className="text-blue-600 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              {dict.form.termsLink}
            </a>
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
        </div>
        {errors.consent && (
          <p
            id="consent-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.consent}
          </p>
        )}
      </div>

      {/* Error state */}
      {status === "error" && (
        <div role="alert" aria-live="assertive" className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-red-700 text-sm">{dict.form.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full min-h-[48px] px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex items-center justify-center gap-2"
        aria-busy={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {dict.form.sending}
          </>
        ) : (
          dict.form.submit
        )}
      </button>
    </form>
  );
}
