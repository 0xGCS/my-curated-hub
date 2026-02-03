import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Users, Layers, TrendingUp, Bitcoin, Cpu, MessageCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "AI",
    description: "Artificial intelligence resources, researchers, and platforms",
    icon: Cpu,
    href: "/category/ai",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Crypto",
    description: "Cryptocurrency analysts, projects, and communities",
    icon: Bitcoin,
    href: "/category/crypto",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Investing",
    description: "Finance experts, market analysts, and investment resources",
    icon: TrendingUp,
    href: "/category/investing",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

const types = [
  {
    title: "People",
    description: "Individual accounts across all categories",
    icon: Users,
    href: "/type/people",
    count: "573+",
  },
  {
    title: "Platforms",
    description: "Applications, websites, and tools",
    icon: Layers,
    href: "/type/platforms",
    count: "407+",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 animate-fade-in">
              A Personal Compendium of{" "}
              <span className="text-primary italic">Interesting Things</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Welcome to my overly-engineered side project. This is my own personal compendium of people, 
              sites, and apps I find to be interesting or useful.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link
                to="/type/people"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Explore People
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/type/platforms"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card font-medium hover:bg-muted transition-colors"
              >
                Browse Platforms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-center mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Explore curated collections organized by topic
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.href}
                to={category.href}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border bg-card p-6",
                  "transition-all duration-300 hover:shadow-warm hover:border-primary/30 hover:-translate-y-1"
                )}
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "bg-gradient-to-br",
                  category.gradient
                )} />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-center mb-4">
            Browse by Type
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            View all entries organized by their type
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {types.map((type) => (
              <Link
                key={type.href}
                to={type.href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-warm hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <type.icon className="h-7 w-7 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-xl font-medium">{type.title}</h3>
                    <span className="text-sm font-medium text-primary">{type.count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">
              Have a suggestion?
            </h2>
            <p className="text-muted-foreground mb-6">
              If you have any suggestions on things to add, shoot me a message on Telegram.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://t.me/OxGCS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border font-medium hover:bg-muted transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Contact on Telegram
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Support this project</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-xs font-mono">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  0x0024E8728351E5FE888DBe61AFbc0010B9B0300d
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
