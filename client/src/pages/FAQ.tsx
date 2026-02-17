/*
 * FAQ PAGE
 * Design: Stadium Noir
 */
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FAQ_DATA } from "@/lib/data";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="pt-24 pb-20 flex-1">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                FREQUENTLY ASKED QUESTIONS
              </h1>
            </div>
            <p className="text-muted-foreground mb-10">
              Everything you need to know about Cricket Watch Party.
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_DATA.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card border border-border/60 rounded-xl px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5 text-sm">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
