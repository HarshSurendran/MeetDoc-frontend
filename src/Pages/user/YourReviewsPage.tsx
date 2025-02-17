import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Edit2, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { IReviewDisplay, IUpdateReview } from '@/types';
import errorHandler from '@/utils/errorHandler';
import { deleteReview, getYourReviews, updateReview } from '@/services/user/user';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';


const UserReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<IReviewDisplay[]>([]);
  const [editingReview, setEditingReview] = useState<IReviewDisplay | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10'); 
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
      fetchReviews(currentPage, Number(pageSize));
  }, [currentPage, pageSize]);

  const fetchReviews = async (page: number, limit: number) => {
    try {
      const response = await getYourReviews(page, limit);
      if (response.status) {
        setReviews(response.data.reviews);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleEditReview = (review: IReviewDisplay) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    const updateReviewDto: IUpdateReview = {
      _id: editingReview._id,
      for: editingReview.for._id,
      from: editingReview.from?._id,
      message: editingReview.message,
      rating: editingReview.rating
    }
    const response = await updateReview(updateReviewDto);
    if (response.status) {
      toast.success('Review updated successfully.');
      setReviews(reviews.map(r => 
        r._id === editingReview._id ? editingReview : r
      ));
    } else {
      toast.error('Failed to update review. Try again after sometime.');
    }
    
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const response = await deleteReview(reviewId);
    if (response.status) {
      toast.success('Review deleted successfully.');
      setReviews(reviews.filter(r => r._id !== reviewId));
    } else {
      toast.error('Failed to delete review. Try again after sometime.');
    }
    setDeleteConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-4">
      <div className="max-w- mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className=" text-blue-800 p-6">
          <h1 className="text-3xl font-bold">My Reviews</h1>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="mx-auto mb-4 w-16 h-16 text-blue-500" />
            <p>You haven't written any reviews yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800">
                      {review.for.name}
                    </h3>
                    <p className="text-gray-500">{review.for.specialisation}</p>
                    
                    <div className="flex my-2">
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

                    <p className="text-gray-700 mt-2">{review.message}</p>
                    <span className="text-sm text-gray-500">
                      {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditReview(review)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => setDeleteConfirmation(review._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Dialog */}
      <Dialog 
        open={!!editingReview} 
        onOpenChange={() => setEditingReview(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review for {editingReview?.for.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  size={30}
                  onClick={() => editingReview && setEditingReview({
                    ...editingReview,
                    rating: starValue
                  })}
                  className={`cursor-pointer ${
                    editingReview && starValue <= editingReview.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <Textarea
              value={editingReview?.message || ''}
              onChange={(e) => editingReview && setEditingReview({
                ...editingReview,
                message: e.target.value
              })}
              placeholder="Update your review"
            />

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingReview(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateReview}>
                Update Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!deleteConfirmation} 
        onOpenChange={() => setDeleteConfirmation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmation(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmation && handleDeleteReview(deleteConfirmation)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Pagination
      currentPage={currentPage}
      pageSize={Number(pageSize)}
      totalItems={totalDocs}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
    </div>
  );
};

export default UserReviewsPage;