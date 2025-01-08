import { Search } from "lucide-react";
import { Card } from "../ui/card";

const BenefitsSection = () => {
    const benefits = [
      "24/7 Video Consultation",
      "Online Doctor Prescription",
      "Book Lab Tests Online",
      "Health Records Safe"
    ];
  
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Benefits of Online Consultation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">{benefit}</h3>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
};
  
export default BenefitsSection;