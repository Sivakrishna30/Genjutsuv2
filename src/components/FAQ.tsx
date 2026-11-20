import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "What is cloud gaming?",
    answer: "Cloud gaming lets you play games running on powerful remote hardware while the gameplay is streamed to your device."
  },
  {
    question: "How does Genjutsu work?",
    answer: "Genjutsu runs your game on a cloud GPU and streams the gameplay directly to your device."
  },
  {
    question: "Do I need a gaming PC?",
    answer: "No. You only need a supported device and a suitable internet connection."
  },
  {
    question: "Can I use my Steam, Epic Games, or Xbox account?",
    answer: "Yes. For supported titles, you can connect your own Steam, Epic Games, or Xbox account to stream the games you already own directly on our cloud GPUs."
  },
  {
    question: "How fast should my internet be?",
    answer: "Your connection should meet the minimum requirement for the selected gaming quality. Higher resolutions require more bandwidth and stability."
  },
  {
    question: "What devices can I use?",
    answer: "Genjutsu is designed for phones, tablets, laptops and desktops."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              className="border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-white/50" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-white/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
