import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { ICreateReview, IReviewModalProp } from '@/types';
import errorHandler from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { sendReview } from '@/services/user/user';




const ReviewModal: React.FC<IReviewModalProp> = ({doctorId, appointmentId}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const navigate = useNavigate();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

    const handleSubmit = async () => {
        try {
            const reviewData: ICreateReview = {
                for: doctorId,
                rating,
                message: review,
                appointmentId
          }
          console.log("review data", reviewData);
            const response = await sendReview(reviewData);
            if (response.status) {
                toast.success('Review submitted successfully.');
            }
            navigate(`/prescription`);
            console.log('Submitted:', { rating, review });
        } catch (error) {
            errorHandler(error);
        }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-blue-50 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-800">
          How was your consultation?
        </h2>
        
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <Star
              key={starValue}
              size={40}
              onClick={() => handleRatingClick(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`cursor-pointer transition-colors duration-200 ${
                (hoveredRating >= starValue || rating >= starValue)
                  ? 'text-blue-500 fill-blue-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full min-h-[120px] resize-none"
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default ReviewModal;