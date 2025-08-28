import { forwardRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from 'lucide-react';

const AboutUs = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
        <Accordion type="single" collapsible>
          <AccordionItem value="about-us">
            <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6" />
                <span>About Fill-in-Fables</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-gray-700 space-y-4">
              <p>
                At Fill-in-Fables, we believe that learning can be as <strong className="text-pink-600">adjective</strong> as a <strong className="text-blue-600">silly noun</strong> on a <strong className="text-green-600">unexpected place</strong>! Our site is built around the idea that kids (and grown-ups, too) learn best when they’re laughing, imagining, and creating together.
              </p>
              <p>But underneath the silly stories, there’s something serious going on:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>We help kids grow vocabulary by showing fun examples of words like adjectives, verbs, and nouns.</li>
                <li>We encourage creativity and storytelling, giving every visitor the chance to be the author.</li>
                <li>We add educational tips and challenges so players pick up grammar and word skills without even noticing.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Our Mission</h4>
              <p>
                To make language learning playful, accessible, and a little bit goofy — so that every story is both fun and a chance to learn.
              </p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Who We Are</h4>
              <p>
                Fill-in-Fables was created by <strong className="text-purple-600">Andy J. Wagers, PhD</strong>, a storyteller and programmer who loves word games, learning through play, and building tools that spark imagination. We also welcome community contributions — from teachers, parents, and anyone who enjoys a good laugh while learning.
              </p>
              <p>
                So whether you’re here to write the <strong className="text-pink-600">funny adjective</strong> <strong className="text-blue-600">animal</strong> who went to <strong className="text-green-600">place</strong>, or you’re a parent/teacher looking for a creative language-learning tool, you’re in the right spot.
              </p>
              <p className="font-semibold">
                Because here at Fill-in-Fables, we’re not just making stories — we’re building a love of words, one laugh at a time.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;