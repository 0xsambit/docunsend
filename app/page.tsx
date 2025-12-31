import Link from "next/link";
import {
  ArrowUpRight,
  Lock,
  Eye,
  Fingerprint,
  Activity,
  Clock,
  Globe2,
  Shield,
  FileText,
  Send,
  BarChart3,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Compare", href: "#compare" },
  { label: "Docs", href: "#docs" },
];

const floatingCards = [
  {
    title: "SECURITY",
    items: [
      { icon: "🔐", name: "Passcodes" },
      { icon: "👁️", name: "View-once" },
      { icon: "🔒", name: "Encryption" },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { icon: "📊", name: "Real-time" },
      { icon: "🌍", name: "Geo-tracking" },
      { icon: "📱", name: "Device info" },
    ],
  },
  {
    title: "CONTROLS",
    items: [
      { icon: "⏰", name: "Expiry" },
      { icon: "🚫", name: "Revoke" },
      { icon: "🔗", name: "Custom links" },
    ],
  },
  {
    title: "BRANDING",
    items: [
      { icon: "🌐", name: "Domains" },
      { icon: "🎨", name: "Themes" },
      { icon: "✉️", name: "Emails" },
    ],
  },
];

const features = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Password Protection",
    description: "Add passcodes to any file. Enterprise security, zero cost.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "View-Once Mode",
    description: "Files disappear after viewing. Like they never existed.",
  },
  {
    icon: <Fingerprint className="w-5 h-5" />,
    title: "Device Locking",
    description: "Whitelist or blacklist specific devices from accessing files.",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Real-Time Analytics",
    description: "See who opened what, when, and where. Every single time.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Expiring Links",
    description: "Set time limits. After expiry, the link is dead forever.",
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: "Custom Domains",
    description: "Use your own domain. share.yourcompany.com looks better.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Instant Revoke",
    description: "One click to kill any link. No questions, no delays.",
  },
  {
    icon: <Send className="w-5 h-5" />,
    title: "Scheduled Drops",
    description: "Set files to go live at a specific time. Automate everything.",
  },
];

const logos = ["Startups", "Agencies", "Freelancers", "Enterprise", "Legal", "Finance"];

export default function Home() {
  return (
    <div className="app-shell">
      {/* Grid Background */}
      <div className="grid-bg" aria-hidden />
      <div className="hero-gradient" aria-hidden />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold text-lg hidden sm:block">DocuNsend</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="btn btn-ghost">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard" className="btn btn-ghost hidden sm:flex">
              Log in
            </Link>
            <Link href="/dashboard" className="btn btn-primary">
              Try DocuNsend free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <Link href="#features" className="badge inline-flex group">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              ALL PREMIUM FEATURES — FREE FOREVER
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight">
              Share files with
              <br />
              <span className="text-[var(--muted)]">total control</span>
            </h1>

            <p className="text-lg text-[var(--muted)] max-w-lg leading-relaxed">
              DocuNsend gives you everything DocSend charges $45/month for — 
              password protection, analytics, device locking, custom domains — 
              completely free. Forever.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className="btn btn-primary px-6 py-3">
                Start sharing free
              </Link>
              <Link href="#compare" className="btn btn-secondary px-6 py-3">
                Compare to DocSend
              </Link>
            </div>
          </div>

          {/* Right - Floating Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {floatingCards.map((card, i) => (
                <div
                  key={card.title}
                  className="card p-4 space-y-3"
                  style={{
                    transform: `translateY(${i % 2 === 0 ? '0' : '20px'})`,
                  }}
                >
                  <p className="text-xs font-medium text-[var(--muted)] tracking-wider">
                    {card.title}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {card.items.map((item) => (
                      <div
                        key={item.name}
                        className="aspect-square rounded-lg bg-[var(--bg-strong)] flex items-center justify-center text-xl"
                        title={item.name}
                      >
                        {item.icon}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-[var(--muted)]">
            <span>Trusted by teams at:</span>
            {logos.map((logo) => (
              <span key={logo} className="font-medium text-[var(--fg)]">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-4">
            Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-medium mb-4">
            Everything you need.
            <br />
            <span className="text-[var(--muted)]">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card p-6 space-y-4 hover:bg-[var(--card-strong)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-strong)] flex items-center justify-center text-[var(--muted)]">
                {feature.icon}
              </div>
              <h3 className="font-medium text-lg">{feature.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-4">
                Why switch?
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium mb-6">
                DocSend is $45/mo.
                <br />
                <span className="text-[var(--muted)]">We're $0.</span>
              </h2>
              <p className="text-[var(--muted)] mb-8 leading-relaxed">
                DocSend locks basic security features behind expensive paywalls. 
                We believe password protection and analytics should be free for everyone.
              </p>
              <Link href="/dashboard" className="btn btn-primary">
                Switch to DocuNsend
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { feature: "Password protection", them: "$15/mo", us: "Free" },
                { feature: "Analytics", them: "$25/mo", us: "Free" },
                { feature: "Custom domains", them: "Enterprise", us: "Free" },
                { feature: "Device locking", them: "N/A", us: "Free" },
                { feature: "View-once mode", them: "N/A", us: "Free" },
              ].map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-[var(--border)] last:border-0"
                >
                  <span className="font-medium">{row.feature}</span>
                  <span className="text-center text-[var(--muted)]">{row.them}</span>
                  <span className="text-center text-green-500 font-medium">{row.us}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-medium mb-6">
            Ready to stop overpaying?
          </h2>
          <p className="text-lg text-[var(--muted)] mb-8 max-w-xl mx-auto">
            Join thousands of teams who switched to DocuNsend.
            Same features. Zero cost.
          </p>
          <Link href="/dashboard" className="btn btn-primary px-8 py-4 text-base">
            Get started — it's free
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                <Zap className="w-3 h-3 text-black" />
              </div>
              <span className="font-medium text-[var(--fg)]">DocuNsend</span>
              <span>· Built different</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-[var(--fg)] transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-[var(--fg)] transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-[var(--fg)] transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
