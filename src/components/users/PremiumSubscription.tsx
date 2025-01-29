import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

const PremiumSubscription = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 mt-4">
      <Card className="relative overflow-hidden bg-white shadow-xl transition-all hover:shadow-2xl">
        {/* Premium Badge */}
        <div className="absolute -right-12 top-6 rotate-45">
          <Badge className="bg-blue-600 text-white px-12 py-1">
            Premium
          </Badge>
        </div>

        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Upgrade to Premium
          </CardTitle>
          <CardDescription className="text-gray-600">
            Get exclusive benefits and save more
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Price Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">₹ 1000</span>
              <span className="text-gray-600 ml-2">/6 months</span>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {[
              '50% off on all consultations',
              'Priority customer support',
              'Access to exclusive content',
              'Cancel anytime'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-6">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold transition-colors"
            onClick={() => {
              // Handle subscription logic here
              console.log('Subscription button clicked');
            }}
          >
            Upgrade Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PremiumSubscription;