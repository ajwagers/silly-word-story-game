import { useState } from "react";
import {
  Sparkles,
  Gamepad2,
  BookOpen,
  Bot,
  FileText,
  PenLine,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function StoryGameApp() {
  const [mode, setMode] = useState("interactive");
  const [story, setStory] = useState("");
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: "Write" },
    { id: 2, label: "Find Words" },
    { id: 3, label: "Add Silly" },
    { id: 4, label: "Enjoy" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 text-slate-800 font-['Quicksand',sans-serif] flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Characters */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-repeat opacity-20" style={{ backgroundImage: "url('/mascot-pattern.svg')" }}></div>

      <header className="text-center mb-10 space-y-3 z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-700 tracking-tight">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-yellow-400 animate-bounce" />
            Silly Word Story Game
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-xl md:text-2xl text-indigo-500">
          Let your imagination run wild with delightfully silly stories!
        </p>
      </header>

      <Progress className="w-full max-w-2xl h-2 rounded-full bg-indigo-100 z-10" value={(step / steps.length) * 100} />
      <div className="flex justify-between w-full max-w-2xl px-1 mt-2 text-xs md:text-sm z-10">
        {steps.map(({ id, label }) => (
          <span
            key={id}
            className={`uppercase tracking-wider ${
              id <= step ? "text-indigo-700 font-semibold" : "text-slate-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <section className="w-full max-w-4xl mt-12 z-10">
        <Tabs value={mode} onValueChange={setMode} className="w-full">
          <TabsList className="grid grid-cols-3 bg-yellow-200 rounded-full p-1 shadow-md">
            <TabsTrigger value="interactive" className="rounded-full px-4 py-2 text-indigo-700 font-semibold hover:bg-yellow-300">
              <Gamepad2 className="inline w-5 h-5 mr-1" /> Interactive
            </TabsTrigger>
            <TabsTrigger value="static" className="rounded-full px-4 py-2 text-indigo-700 font-semibold hover:bg-yellow-300">
              <FileText className="inline w-5 h-5 mr-1" /> Static
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-full px-4 py-2 text-indigo-700 font-semibold hover:bg-yellow-300">
              <Bot className="inline w-5 h-5 mr-1" /> Chatbot
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <section className="w-full max-w-5xl mt-12 grid md:grid-cols-2 gap-10 z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-indigo-600 mb-4">
            <BookOpen className="w-6 h-6 text-yellow-400" /> Your Story
          </h2>
          <Textarea
            rows={8}
            placeholder="Once upon a time in a far‑away land…"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="resize-none bg-yellow-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 rounded-xl border-2 border-yellow-200 text-lg"
          />
          <div className="flex justify-end mt-4">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full hover:scale-105 transition-all duration-200"
              disabled={!story.trim()}
              onClick={() => setStep((prev) => Math.min(prev + 1, 4))}
            >
              <PenLine className="w-4 h-4 mr-2" /> Analyze Story
            </Button>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-3xl p-6 shadow-inner flex items-center justify-center min-h-[14rem] text-indigo-500 text-lg italic hover:bg-indigo-100 transition-all duration-300">
          {step === 1 ? (
            <span>Your silly preview will appear here…</span>
          ) : (
            <span>[TODO: Interactive blank replacement UI]</span>
          )}
        </div>
      </section>

      <section className="w-full max-w-4xl mt-14 z-10">
        <Accordion type="single" collapsible defaultValue="how">
          <AccordionItem value="how">
            <AccordionTrigger className="text-xl font-semibold text-indigo-700 hover:text-indigo-800 transition-colors duration-200">
              How to Play This Awesome Game
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-indigo-600 text-md">
              <ul className="list-decimal list-inside space-y-2">
                <li className="hover:text-indigo-800 transition-colors duration-200">Write or paste a story in the text area.</li>
                <li className="hover:text-indigo-800 transition-colors duration-200">Choose a fun mode to play in.</li>
                <li className="hover:text-indigo-800 transition-colors duration-200">Let AI pick the perfect words to swap.</li>
                <li className="hover:text-indigo-800 transition-colors duration-200">Add your wacky replacements.</li>
                <li className="hover:text-indigo-800 transition-colors duration-200">Download or share your hilarious creation!</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {step === 4 && (
        <Button className="mt-12 bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded-full shadow-lg z-10 hover:scale-105 transition-all duration-200">
          <Download className="w-5 h-5 mr-2" /> Download Story
        </Button>
      )}
    </main>
  );
}