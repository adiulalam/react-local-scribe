import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <TooltipProvider>
      <h1 className="text-3xl font-bold underline text-blue-600">
        Tailwind is Working!
      </h1>
    </TooltipProvider>
  );
};

export default App;
