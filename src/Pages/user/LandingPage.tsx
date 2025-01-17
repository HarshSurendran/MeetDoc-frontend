
import Footer from '@/components/users/Footer';
import BenefitsSection from '@/components/users/BenefitsSection';
import StatsSection from '@/components/users/StatsSection';
import SpecialtiesSection from '@/components/users/SpecialitiesSection';
import HeroSection from '@/components/users/HeroSection';
import FAQSection from "@/components/users/FaqSection";
import DoctorsSection from "@/components/users/DoctorsSection";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/appStore";
import HeaderPreLogin from "@/components/users/HeaderPreLogin";
import HeaderPostLogin from "@/components/users/HeaderPostLogin";

const LandingPage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen">
      <header>
        {user.isAuthenticated ?  <HeaderPostLogin /> : <HeaderPreLogin />}
      </header>

      <main>
        <HeroSection />
        <SpecialtiesSection />
        <DoctorsSection />
        <StatsSection />
        <BenefitsSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;