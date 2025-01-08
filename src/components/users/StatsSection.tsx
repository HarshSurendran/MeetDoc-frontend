const StatsSection = () => {
    const stats = [
      { value: "2,00,000+", label: "Happy Patients" },
      { value: "20,000+", label: "Verified Doctors" },
      { value: "25+", label: "Specialities" },
      { value: "4.5", label: "App Rating" },
    ];
  
    return (
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};
  
export default StatsSection;