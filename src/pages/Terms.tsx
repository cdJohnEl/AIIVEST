import { FileText, AlertTriangle, Scale } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F6FF] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#A7B1C8]">
            Last updated: December 2024
          </p>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-6 mb-8 border-l-4 border-[#F59E0B]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-[#F4F6FF] mb-2">
                Important Notice
              </h2>
              <p className="text-[#A7B1C8] text-sm leading-relaxed">
                By accessing or using AI Invest Pro, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our platform. Investing involves 
                risk, including the possible loss of principal.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">1. Account Registration</h2>
            <p className="text-[#A7B1C8] mb-4">
              To use our services, you must create an account. You agree to:
            </p>
            <ul className="space-y-2 text-[#A7B1C8]">
              <li>• Provide accurate and complete information</li>
              <li>• Maintain the security of your account credentials</li>
              <li>• Notify us immediately of any unauthorized access</li>
              <li>• Be at least 18 years old or the legal age in your jurisdiction</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">2. Investment Services</h2>
            <p className="text-[#A7B1C8] mb-4">
              AI Invest Pro provides AI-powered portfolio management services. You acknowledge that:
            </p>
            <ul className="space-y-2 text-[#A7B1C8]">
              <li>• All investments carry risk and may result in loss</li>
              <li>• Past performance does not guarantee future results</li>
              <li>• ROI figures are historical averages, not guarantees</li>
              <li>• You should only invest what you can afford to lose</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">3. Fees and Charges</h2>
            <p className="text-[#A7B1C8] mb-4">
              Our fee structure is as follows:
            </p>
            <ul className="space-y-2 text-[#A7B1C8]">
              <li>• Starter Plan: Free</li>
              <li>• Growth Plan: 0.75% annually on assets under management</li>
              <li>• Pro Plan: 0.50% annually (minimum balance requirements apply)</li>
              <li>• Network fees for crypto transactions are passed through</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">4. Prohibited Activities</h2>
            <p className="text-[#A7B1C8] mb-4">
              You agree not to:
            </p>
            <ul className="space-y-2 text-[#A7B1C8]">
              <li>• Use the platform for illegal activities</li>
              <li>• Attempt to breach security measures</li>
              <li>• Provide false or misleading information</li>
              <li>• Use automated systems without authorization</li>
              <li>• Engage in market manipulation</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">5. Limitation of Liability</h2>
            <p className="text-[#A7B1C8] leading-relaxed">
              AI Invest Pro and its affiliates shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including loss of profits, data, or use, arising out of 
              or in connection with your use of the platform.
            </p>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">6. Termination</h2>
            <p className="text-[#A7B1C8] leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of 
              these terms. You may close your account at any time by contacting support.
            </p>
          </section>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 mt-8 text-center">
          <Scale className="w-8 h-8 text-[#2D6BFF] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-2">
            Questions About Our Terms?
          </h2>
          <p className="text-[#A7B1C8] mb-4">
            Contact our legal team for clarification on any terms.
          </p>
          <a 
            href="mailto:legal@aiinvestpro.com" 
            className="text-[#2D6BFF] hover:underline"
          >
            legal@aiinvestpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
