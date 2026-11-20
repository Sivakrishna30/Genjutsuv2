import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Privacy() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-12">Privacy Policy</h1>
          
          <div className="space-y-8 text-white/70 leading-relaxed">
            <div className="p-6 bg-pink-500/10 border border-pink-500/20 rounded-xl mb-8">
              <p className="text-pink-100">
                <strong>Why do we have a Privacy Policy?</strong> 
                Because we allow you to securely log in using your Google Account (via Firebase Auth), Google requires us to display a Privacy Policy explaining that we only use your email address to create your account and save your game library. We do not sell your data.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Information We Collect</h2>
              <p>
                When you sign in using Google, we collect your email address and a unique user ID to securely create your Genjutsu Game Arena profile. We also store data regarding which third-party game libraries (e.g., Steam, Epic, Xbox) you link to your account to facilitate the "Bring Your Own Game" feature.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">How We Use Your Data</h2>
              <p>
                Your data is strictly used to provide the cloud gaming service. Your email is used for account identification and billing receipts. Your linked library data is used solely to launch your owned games on our cloud infrastructure.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
