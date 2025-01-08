import { Button } from "../ui/button";
import { Card } from "../ui/card";

const DoctorsSection = () => {
    const specialties = [
        { name: "Afsal Madathingal", category: "General Medicine", consultation: "783", image: "src/assets/heroimage2.avif" },
        { name: "Afsal Madathingal", category: "General Medicine", consultation: "783", image: "src/assets/heroimage2.avif" },
        { name: "Afsal Madathingal", category: "General Medicine", consultation: "783", image: "src/assets/heroimage2.avif" },
        { name: "Afsal Madathingal", category: "General Medicine", consultation: "783", image: "src/assets/heroimage2.avif" },
    ];
  
    return (
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Our Doctors</h2>
            <Button variant="outline">View All Doctors</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <img src={specialty.image} alt={specialty.name} className="w-24 h-24 rounded-full mx-auto my-4" />
                    <div className="my-4">
                        <h3 className="font-semibold text-center">Dr. {specialty.name}</h3>
                        <h2 className="font-light">{specialty.category}</h2>
                        <h2 className="font-light">Consultations : <b>{specialty.consultation}</b></h2>
                    </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
};
  
export default DoctorsSection;
