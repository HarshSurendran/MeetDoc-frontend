
import { Button } from "../ui/button";

const SpecialtiesSection = () => {
  const specialties = [
    { name: "General Medicine", image: "src/assets/heroimage2.avif" },
    { name: "Gynecology", image: "src/assets/heroimage2.avif" },
    { name: "Dermatology", image: "src/assets/heroimage2.avif" },
    { name: "Psychiatry", image: "src/assets/heroimage2.avif" },
    { name: "Psychiatry", image: "src/assets/heroimage2.avif" },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">25+ Specialties</h2>
          <Button variant="outline">View All Specialties</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:grid-cols-5">
          {specialties.map((specialty, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={specialty.image} 
                  alt={specialty.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-center group-hover:text-blue-600 transition-colors duration-300">
                {specialty.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialtiesSection;