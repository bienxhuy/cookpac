import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function App() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance for seamless user experience'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Clean and modern interface that users love'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Enterprise-grade security for your peace of mind'
    },
    {
      icon: '🚀',
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone'
    },
    {
      icon: '🌟',
      title: 'Premium Quality',
      description: 'Crafted with attention to every detail'
    },
    {
      icon: '💎',
      title: 'Value for Money',
      description: 'Get more features for less investment'
    }
  ]

  const testimonials = [
    {
      name: 'Emily Rodriguez',
      role: 'Product Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      initials: 'ER',
      text: 'This platform has transformed how we work. The clean design makes everything so intuitive!'
    },
    {
      name: 'James Chen',
      role: 'Tech Lead',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      initials: 'JC',
      text: 'Amazing performance and reliability. Our team productivity increased by 40%!'
    },
    {
      name: 'Sophia Williams',
      role: 'CEO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      initials: 'SW',
      text: 'Best investment we made this year. The ROI has been incredible.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <span className="text-xl font-bold text-primary">CookPac</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-accent transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-accent transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium hover:text-accent transition-colors">Pricing</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full">
              <span className="text-sm font-medium text-primary">✨ New: AI-Powered Features</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
              Cook Up Something
              <span className="block text-accent mt-2">Amazing Today</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              The modern platform that helps you create, collaborate, and succeed.
              Built with cutting-edge technology and designed for excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you achieve more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex gap-1 mt-4 text-accent">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful teams using CookPac today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-accent hover:bg-accent/90 text-primary">
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white text-primary hover:bg-white/90">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-primary mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-primary">CookPac</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CookPac. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;