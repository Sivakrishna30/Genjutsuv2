import { Link } from "react-router-dom";
import logoImg from "../assets/images/IMG_1281.jpeg";

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-md border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Genjutsu Game Arena Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain mix-blend-screen"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-widest text-white uppercase">Genjutsu</span>
              <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Game Arena</span>
            </div>
          </div>
          <p className="text-pink-400 font-medium pt-2">Wake up to Reality!</p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Links</h4>
          <ul className="space-y-4">
            <li><a href="/#games" className="text-white/60 hover:text-white transition-colors">Games</a></li>
            <li><a href="/#pricing" className="text-white/60 hover:text-white transition-colors">Pricing</a></li>
            <li><a href="/#faq" className="text-white/60 hover:text-white transition-colors">FAQ</a></li>
            <li><a href="mailto:support@genjutsu.com" className="text-white/60 hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Account</h4>
          <ul className="space-y-4">
            <li><Link to="/login" className="text-white/60 hover:text-white transition-colors">Sign In</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms and Conditions</Link></li>
            <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center text-white/40 text-sm">
        &copy; {new Date().getFullYear()} Genjutsu Game Arena. All rights reserved.
      </div>
    </footer>
  );
}
