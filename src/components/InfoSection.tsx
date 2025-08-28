import { forwardRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info, ShieldCheck, Gavel } from 'lucide-react';

const InfoSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
        <Accordion type="single" collapsible className="w-full">
          {/* About Us Item */}
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
                Fill-in-Fables was created by <strong className="text-purple-600">[Your Name]</strong>, a storyteller and software developer who loves word games, learning through play, and building tools that spark imagination. We also welcome community contributions — from teachers, parents, and anyone who enjoys a good laugh while learning.
              </p>
              <p>
                So whether you’re here to write the <strong className="text-pink-600">funny adjective</strong> <strong className="text-blue-600">animal</strong> who went to <strong className="text-green-600">place</strong>, or you’re a parent/teacher looking for a creative language-learning tool, you’re in the right spot.
              </p>
              <p className="font-semibold">
                Because here at Fill-in-Fables, we’re not just making stories — we’re building a love of words, one laugh at a time.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Privacy Policy Item */}
          <AccordionItem value="privacy-policy">
            <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <span>Privacy Policy</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-gray-700 space-y-4">
              <p className="text-sm text-gray-500">Effective Date: 08/27/2025</p>
              <p>At Fill-in-Fables.com, we respect your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have.</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Information We Collect</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Personal Information:</strong> We do not require users to create an account to use our story generator. However, if you choose to create an account or subscribe to premium features in the future, we may collect information such as your name, email address, and payment details. Payment processing will be handled securely by trusted third-party providers (e.g., Stripe, PayPal) and we will not store your full payment information on our servers. Also, if you contact us (for support, feedback, or submissions), we may collect your email address and any information you provide.</li>
                <li><strong>Non-Personal Information:</strong> Like most websites, we collect basic usage data such as browser type, pages visited, and time spent on the site. This helps us improve the website.</li>
                <li><strong>Cookies & Third-Party Services:</strong> We use cookies to improve your experience and may allow third-party vendors, including Google, to use cookies and web beacons to serve ads based on your interests.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">How We Use Information</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>To operate and improve the Fill-in-Fables website.</li>
                <li>To respond to questions or feedback.</li>
                <li>To provide relevant advertising through Google AdSense.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Your Choices</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You can disable cookies in your browser settings, though some features may not work properly.</li>
                <li>You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ad Settings</a>.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Children’s Privacy</h4>
              <p>Fill-in-Fables is designed to be family-friendly. We do not knowingly collect personal information from children under 13. If we learn that we have accidentally collected such information, we will delete it promptly.</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Contact Us</h4>
              <p>If you have questions about this Privacy Policy, please contact us at:<br />📧 <a href="mailto:fill-in-fables@proton.me" className="text-blue-600 hover:underline">fill-in-fables@proton.me</a></p>
            </AccordionContent>
          </AccordionItem>

          {/* Terms of Service Item */}
          <AccordionItem value="terms-of-service" className="border-b-0">
            <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <Gavel className="w-6 h-6" />
                <span>Terms of Service</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-gray-700 space-y-4">
              <p className="text-sm text-gray-500">Effective Date: [Insert Date]</p>
              <p>Welcome to Fill-in-Fables.com! By using this website, you agree to the following terms:</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Use of the Website</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Fill-in-Fables is for entertainment and educational purposes only.</li>
                <li>You may not use the site in any way that is harmful, unlawful, or interferes with others’ enjoyment of the site.</li>
                <li>You are responsible for any content you create or share using our tools.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">User-Generated Content</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>By submitting or sharing a story, you grant Fill-in-Fables the right to display it on the site in a fun, family-friendly way.</li>
                <li>We reserve the right to moderate, edit, or remove any content that is inappropriate.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Intellectual Property</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>The Fill-in-Fables website design, story templates, and educational content are owned by Fill-in-Fables.com.</li>
                <li>You may use the site for personal, classroom, or entertainment purposes. Commercial use requires written permission.</li>
              </ul>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Disclaimer of Warranties</h4>
              <p>Fill-in-Fables is provided “as is” without warranties of any kind. We do our best to keep the site safe, fun, and bug-free, but we cannot guarantee uninterrupted service.</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Limitation of Liability</h4>
              <p>Fill-in-Fables.com is not liable for any damages resulting from your use of the site.</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Changes to These Terms</h4>
              <p>We may update these Terms of Service from time to time. By continuing to use the site, you agree to the updated terms.</p>
              <h4 className="text-lg font-bold text-gray-800 pt-2">Contact Us</h4>
              <p>If you have any questions about these Terms, please contact us at:<br />📧 <a href="mailto:fill-in-fables@proton.me" className="text-blue-600 hover:underline">fill-in-fables@proton.me</a></p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
});

InfoSection.displayName = 'InfoSection';

export default InfoSection;