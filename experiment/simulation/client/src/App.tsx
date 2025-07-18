import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimulationPage from "@/pages/simulation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimulationPage}/>
      <Route path="/simulation" component={SimulationPage}/>
      <Route component={SimulationPage} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
