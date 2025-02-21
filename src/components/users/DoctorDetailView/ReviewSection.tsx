import React, { useEffect, useState } from 'react';
import { Star, User, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import errorHandler from '@/utils/errorHandler';
import { IReviewDisplay, IReviewSectionProps } from '@/types';
import { getReviews } from '@/services/user/user';
import ReviewPagination from '../ReviewPagination';


const ReviewSection: React.FC<IReviewSectionProps> = ({ doctorId }) => {
  const [reviews, setReviews] = useState<IReviewDisplay[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    const fetchReviews = async(currentPage: number, limit = 5 ) => {
        try {
            const response = await getReviews(doctorId, currentPage, limit);
            if (response?.status) {
              setReviews(response?.data?.reviews);
              setTotalDocs(response?.data?.totalDocs);
            }
        } catch (error) {
            errorHandler(error)
        }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <Card className="lg:min-h-screen flex flex-col justify-between">
      <CardContent className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No reviews yet
          </div>
        ) : (
          <div className=" space-y-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center mb-2">
                  <User className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="font-medium">{review.from.name}</span>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <Star
                        key={starValue}
                        size={20}
                        className={`${
                          starValue <= review.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 text-gray-700">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm">{review.message}</p>
                    <span className="text-xs text-gray-500 mt-1">
                      {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <ReviewPagination
        currentPage={currentPage}
        pageSize={5}
        totalItems={totalDocs}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default ReviewSection;