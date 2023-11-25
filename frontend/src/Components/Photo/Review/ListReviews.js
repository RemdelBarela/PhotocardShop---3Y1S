import React from 'react';

const ListReviews = ({ reviews }) => {
    return (
        <div className="reviews w-75">
            <h5 className="no-indent"><strong>Photo Reviews:</strong></h5>
            {reviews && reviews.map(review => (
                <div key={review._id} className="review-card my-3">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                    </div>
                    <p className="review-user">by {review.name}: {review.comment}</p>
                    <p className="review-comment"></p>        
                </div>
            ))}
        </div>
    );
};

export default ListReviews;
