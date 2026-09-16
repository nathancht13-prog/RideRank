import { Route, Switch } from 'wouter';
import { BikeRankProvider } from './BikeRankContext';
import { Header, Footer, Toast } from './components/Layout';
import { Modals } from './components/Modals';
import LandingPage from './pages/LandingPage';
import LegalPage from './pages/LegalPage';

export default function App() {
  return (
    <BikeRankProvider>
      <div className="site-shell bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary selection:text-black">
        <Header />
        
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/legal" component={LegalPage} />
          <Route>
            <main className="min-h-screen pt-32 pb-24 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
                <p className="text-zinc-400">Trace introuvable.</p>
              </div>
            </main>
          </Route>
        </Switch>
        
        <Footer />
        <Modals />
        <Toast />
      </div>
    </BikeRankProvider>
  );
}