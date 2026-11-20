import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Terms() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-12">Terms and Conditions</h1>
          
          <div className="space-y-8 text-white/70 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Genjutsu Game Arena, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Cloud Gaming Service</h2>
              <p>
                We provide a cloud gaming service that allows you to stream games you already own on supported third-party platforms (like Steam, Epic Games, Xbox). We do not sell games; we rent high-performance cloud compute time on an hourly basis.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Payments & Refund Policy</h2>
              <p className="mb-4">
                <strong>Payments:</strong> All services are billed on a prepaid, hourly basis. When you initiate a gaming session, time is deducted from your prepaid balance.
              </p>
              <p>
                <strong>Refunds:</strong> Due to the nature of cloud infrastructure provisioning, we do not offer refunds for time already consumed. If you experience technical issues caused by our servers that prevent you from playing for a continuous 15-minute period, you may be eligible for a credit to your account.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
