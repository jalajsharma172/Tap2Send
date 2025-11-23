import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import RegisterPhonePage from "@/pages/registerPhoneNumber"
// import 

import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "ed4bcdc6d450e0296557ec799c7ab19b", // required
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={RegisterPhonePage}></Route>
    </Switch>
  );
}

export function App() {
  return (
    <ThirdwebProvider
      client={client}
      activeChain="sepolia"    >

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}

export default App;
