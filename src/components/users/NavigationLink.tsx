import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import React from "react";
import { INavigationLinkProps } from "@/types";



const NavigationLink :React.FC<INavigationLinkProps> = ({ item, currentPath, setCurrentPath, isMobile = false }) => {
    const isActive = currentPath === item.href;
      const Icon = item.icon;
      const navigate = useNavigate();

      const handleClick = () => {
          setCurrentPath(item.href);
          navigate(item.href);
      }
      
    
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start gap-4 ${
          isActive 
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600' 
            : 'hover:bg-blue-50 hover:text-blue-600'
        } ${isMobile ? 'py-6' : ''}`}
            onClick={handleClick}
            
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Button>
    );
};
    

export default NavigationLink;