
const Footer = () => {
    const sections = [
      {
        title: "MeetDoc",
        links: ["About", "Blog", "Careers", "Contact"]
      },
      {
        title: "For Patients",
        links: ["Search Doctors", "Consultation", "Articles", "Contact"]
      },
      {
        title: "For Doctors",
        links: ["About", "Solutions", "Features", "Contact"]
      },
      {
        title: "More",
        links: ["Privacy", "Terms", "FAQ", "Contact"]
      }
    ];
  
    return (
      <footer className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-blue-100 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-blue-400 text-center">
            <p className="text-blue-100">© 2025 MeetDoc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };

export default Footer;