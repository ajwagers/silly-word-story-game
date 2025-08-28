import { forwardRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gavel } from 'lucide-react';

const TermsOfService = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
        <Accordion type="single" collapsible>
          <AccordionItem value="terms-of-service">
            <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <Gavel className="w-6 h-6" />
                <span>Terms of Service</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-gray-700 space-y-4">
              <p className="text-sm text-gray-500">Effective Date: [Insert Date]</p>
              <p>
                Welcome to Fill-in-Fables.com! By using this website, you agree to the following terms:
              </p>

              <h4 className="text-lg font-bold text-gray-800 pt-2">Use of the Website</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Fill-in-Fables is for entertainment and educational purposes only.</li>
                <li>You may not use the site in any way that is harmful, unlawful, or interferes with others’ enjoyment of the site.</li>
                <li>You are responsible for any content you create or share using our tools.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-800 pt-2">User Accounts</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Creating an account is optional, however certain features may require you to create an account. If you do create one, you are responsible for keeping your login information secure and for any activity under your account. </li>
                <li>You must be at least 13 years old to create an account.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-800 pt-2">User-Generated Content</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>By submitting or sharing a story, you grant Fill-in-Fables the right to display it on the site in a fun, family-friendly way.</li>
                <li>We reserve the right to moderate, edit, or remove any content that is inappropriate.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-800 pt-2">Payments & Subscriptions</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>If we introduce paid subscription services, by subscribing you agree to pay the applicable fees. Subscription terms, renewal dates, and cancellation options will be disclosed before you complete any purchase. Unless otherwise stated, subscription payments are non-refundable once the billing period has started.</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-800 pt-2">Intellectual Property</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Fill-in-Fables is free to use for basic features. Some features may be offered as part of a paid subscription plan in the future. Details, pricing, and cancellation terms will be clearly provided at the time of purchase.</li>
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
              <p>If you have any questions about these Terms, please contact us at:<br />
                📧 <a className="text-blue-600 hover:underline">fill-in-fables(at)proton.me</a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
});

TermsOfService.displayName = 'TermsOfService';

export default TermsOfService;