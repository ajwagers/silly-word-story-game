import { forwardRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border">
        <Accordion type="single" collapsible>
          <AccordionItem value="privacy-policy">
            <AccordionTrigger className="text-xl font-bold text-gray-900 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                <span>Privacy Policy</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-base text-gray-700 space-y-4">
              <p className="text-sm text-gray-500">Effective Date: 08/27/2025</p>
              <p>
                At Fill-in-Fables.com, we respect your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have.
              </p>
              
              <h4 className="text-lg font-bold text-gray-800 pt-2">Information We Collect</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                  <strong>Personal Information:</strong> We do not require users to create an account to use our story generator. However, if you choose to create an account or subscribe to premium features in the future, we may collect information such as your name, email address, and payment details. Payment processing will be handled securely by trusted third-party providers (e.g., Stripe, PayPal) and we will not store your full payment information on our servers. Also, if you contact us (for support, feedback, or submissions), we may collect your email address and any information you provide.
                </li>
                <li>
                  <strong>Non-Personal Information:</strong> Like most websites, we collect basic usage data such as browser type, pages visited, and time spent on the site. This helps us improve the website.
                </li>
                <li>
                  <strong>Cookies & Third-Party Services:</strong> We use cookies to improve your experience and may allow third-party vendors, including Google, to use cookies and web beacons to serve ads based on your interests.
                </li>
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
              <p>
                Fill-in-Fables is designed to be family-friendly. We do not knowingly collect personal information from children under 13. If we learn that we have accidentally collected such information, we will delete it promptly.
              </p>

              <h4 className="text-lg font-bold text-gray-800 pt-2">Contact Us</h4>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                📧 <a className="text-blue-600 hover:underline">fill-in-fables(at)proton.me</a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
});

PrivacyPolicy.displayName = 'PrivacyPolicy';

export default PrivacyPolicy;