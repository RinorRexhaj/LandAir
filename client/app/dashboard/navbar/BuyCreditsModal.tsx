import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { loadStripe } from "@stripe/stripe-js";
import useApi from "@/app/hooks/useApi";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { darkMode } = useThemeStore();
  const { post } = useApi();
  const [redirecting, setRedirecting] = useState(false);

  if (!isOpen) return null;

  const creditPlans = [
    {
      name: "Growth",
      credits: "15 Credits",
      price: "$4.99",
      features: [
        "More customization",
        "Premium Templates",
        "Valid for 90 days",
      ],
      isPremium: "Popular",
    },
    {
      name: "Scale",
      credits: "35 Credits",
      price: "$10.99",
      features: ["All in one", "All Premium Templates", "Valid for 180 days"],
      isPremium: "Premium",
    },
  ];

  const buyNow = async (type: string) => {
    setRedirecting(true);
    let priceId;
    if (type === "growth") {
      priceId = process.env.NEXT_PUBLIC_STRIPE_GROWTH;
    } else if (type === "scale") {
      priceId = process.env.NEXT_PUBLIC_STRIPE_SCALE;
    }
    const { sessionId }: { sessionId: string } = await post(`/api/payment`, {
      priceId,
    });
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
    setRedirecting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/50" : "bg-white/5"
        } backdrop-blur-sm`}
        onClick={() => {
          if (!redirecting) onClose();
        }}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-xl md:w-10/12 p-6 rounded-xl border ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-700/20"
        } shadow-2xl ${redirecting && "animate-glow"}`}
      >
        {/* Close button */}
        <button
          onClick={() => {
            if (!redirecting) onClose();
          }}
          className={`absolute top-4 right-4 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-zinc-700 hover:text-zinc-900"
          } transition-colors`}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            {redirecting ? "Redirecting..." : "Buy Credits"}
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-zinc-600"}`}>
            Choose a credit bundle that fits your needs
          </p>
        </div>

        {/* Credit Plans */}
        <div className="w-full flex md:flex-col gap-4">
          {creditPlans.map((plan, index) => (
            <div
              key={index}
              className={`w-full relative p-6 rounded-xl backdrop-blur-md ${
                index === 0
                  ? darkMode
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "bg-blue-600/60"
                  : darkMode
                  ? "bg-violet-700/20 border border-violet-500/30"
                  : "bg-violet-700/60"
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                {plan.isPremium && (
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "bg-violet-700 text-white"
                    }`}
                  >
                    {plan.isPremium}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium mb-1 text-white/80">
                {plan.credits}
              </p>
              <p className="text-3xl font-bold mb-6 text-white">
                {plan.price}
                <span className="text-sm font-normal">/bundle</span>
              </p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-white/80">
                    <svg
                      className="w-5 h-5 mr-2 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  buyNow(plan.name.toLowerCase());
                }}
                className={`w-full py-3 rounded-full font-semibold backdrop-blur-sm ${
                  index === 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white transition-all duration-300`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
