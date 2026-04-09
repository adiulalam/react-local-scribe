import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <TooltipProvider>
      <h1 className="text-3xl font-bold text-blue-600 underline">Tailwind is Working!</h1>
    </TooltipProvider>
  );
};

export default App;
