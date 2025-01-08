import { Button } from "../ui/button";

const HeroSection = () => (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between py-16 px-4 lg:px-16 max-w-7xl mx-auto">
      <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Save You time and
          <span className="block text-blue-600">Find doctor Online</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Connect with certified doctors online for quick and reliable medical consultations
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Find Doctor Now
        </Button>
      </div>
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <img src="Heroimageblue.png" alt="Online Doctor Consultation" className="w-full" />
      </div>
    </div>
);
  
export default HeroSection;