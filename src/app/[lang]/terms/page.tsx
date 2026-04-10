import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { makeMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }, { lang: "es" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return makeMetadata({
    title: "Terms and Conditions | Chillout Surf Camp",
    description: "Read the full terms and conditions for bookings, cancellations, payments, and liability at Chillout Surf Camp Taghazout, Morocco.",
    path: "/terms",
    lang,
  });
}

const TERMS_SECTIONS = [
  {
    id: "security",
    heading: "1. Security",
    content:
      "All payments made through our website are processed through a secure, encrypted payment gateway. ChilloutSurf, SARL uses industry-standard SSL encryption to protect your personal and financial information. Your credit card details are never stored on our servers.",
  },
  {
    id: "contract",
    heading: "2. Contract",
    content:
      "A booking becomes definite and a contract between you and ChilloutSurf, SARL is formed once you have paid your deposit and we have sent you a booking confirmation by email. By making a booking, you confirm that you have read, understood, and agree to these Terms and Conditions. The person making the booking accepts these conditions on behalf of all members of their party.",
  },
  {
    id: "payment",
    heading: "3. Payment",
    content:
      "A deposit of 20% of the total package price is required to secure your booking. The remaining balance is due upon arrival at the camp. Payment can be made by credit/debit card, bank transfer, or cash. Please ensure that you have the full balance ready on the day of arrival. Failure to pay the remaining balance may result in cancellation of your booking without a refund of the deposit.",
  },
  {
    id: "cancellation",
    heading: "4. Cancellation",
    content:
      "If you need to cancel your booking, the following cancellation policy applies:\n\n• Cancellations made 30 or more days before the arrival date: 75% of the total booking amount will be refunded.\n• Cancellations made between 15 and 29 days before the arrival date: 50% of the total booking amount will be refunded.\n• Cancellations made fewer than 15 days before the arrival date: No refund will be issued.\n\nAll cancellations must be submitted in writing via email to booking@chilloutsurf.com. The date of cancellation is the date we receive your written notice.",
  },
  {
    id: "substitution",
    heading: "5. Substitution",
    content:
      "If you are unable to travel, you may transfer your booking to another person, provided that the person meets all requirements of the package. You must notify us in writing no later than 14 days before the arrival date. The transferee must agree to these Terms and Conditions. An administration fee may apply.",
  },
  {
    id: "surcharges",
    heading: "6. Surcharges",
    content:
      "ChilloutSurf, SARL reserves the right to impose surcharges on confirmed bookings in cases of significant currency fluctuation, increased taxes, or other cost increases beyond our control. We will notify you of any surcharges as soon as possible. If a surcharge increases the price of your package by more than 10%, you have the right to cancel and receive a full refund.",
  },
  {
    id: "insurance",
    heading: "7. Insurance",
    content:
      "Comprehensive travel insurance is mandatory for all guests. Your insurance policy must cover medical expenses, personal accident, evacuation, cancellation, and loss of personal belongings. You must provide proof of valid insurance upon check-in. ChilloutSurf, SARL accepts no liability for any costs arising from a lack of adequate insurance coverage.",
  },
  {
    id: "passport-visa",
    heading: "8. Passport and Visa",
    content:
      "It is your sole responsibility to ensure that you hold a valid passport and any visas or travel documents required to enter Morocco and any countries transited during your journey. ChilloutSurf, SARL accepts no responsibility for any costs, delays, or consequences arising from your failure to hold the correct documentation.",
  },
  {
    id: "responsibility",
    heading: "9. Responsibility",
    content:
      "ChilloutSurf, SARL will make every effort to deliver all elements of your booked package as described. However, we reserve the right to amend, substitute, or cancel any element of the itinerary where necessary due to weather conditions, force majeure, government restrictions, or other circumstances beyond our control. In such cases, we will endeavour to offer a suitable alternative of equivalent value.",
  },
  {
    id: "expectations",
    heading: "10. Expectations",
    content:
      "Surfing is entirely dependent on natural conditions. ChilloutSurf, SARL makes no guarantees regarding wave quality, swell size, wind conditions, or the suitability of surf conditions during your stay. Surf spots may be changed at the discretion of our instructors based on conditions and guest safety. No refunds will be issued due to unfavourable surf conditions.",
  },
  {
    id: "dangers",
    heading: "11. Dangers",
    content:
      "Surfing and all water activities involve inherent risks including, but not limited to: drowning, collision with surfboards or other objects, injury from rocks or reef, rip currents, and sunburn. By participating in any activity organised by ChilloutSurf, SARL, you acknowledge that you are aware of these risks and voluntarily accept them. You are responsible for assessing your own physical fitness and swimming ability before participating.",
  },
  {
    id: "release-of-liability",
    heading: "12. Release of Liability",
    content:
      "By making a booking with ChilloutSurf, SARL, you agree to release, discharge, and hold harmless ChilloutSurf, SARL, its owners, employees, instructors, and agents from any and all claims, liabilities, damages, or expenses arising from your participation in any activity, including surfing, yoga, excursions, and any other activity offered. This waiver applies to all risks, whether known or unknown, foreseeable or unforeseeable, including risks resulting from the negligence of ChilloutSurf, SARL or its representatives. You voluntarily assume full responsibility for any injuries, losses, or damages incurred during your stay.",
  },
];

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-white border-b border-gray-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {dict.terms.title}
          </h1>
          <p className="mt-4 text-sm text-gray-400">ChilloutSurf, SARL</p>
        </div>
      </section>

      {/* Terms content */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-10">
          {TERMS_SECTIONS.map((section) => (
            <article key={section.id} id={section.id}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {section.heading}
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm space-y-2">
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}

          {/* Footer note */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              These terms and conditions are governed by the laws of Morocco.
              Any disputes shall be subject to the exclusive jurisdiction of the
              courts of Agadir, Morocco. ChilloutSurf, SARL reserves the right
              to update these terms at any time. The version published on our
              website at the time of booking shall apply.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
