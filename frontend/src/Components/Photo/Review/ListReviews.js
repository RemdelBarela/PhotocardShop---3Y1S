import React , {useEffect} from 'react';
import { Carousel } from 'react-bootstrap'

const ListReviews = ({ reviews }) => {
    useEffect(() => {
        console.log('Received rev prop:', reviews);
      }, [reviews]); 
    return (
        <div className="reviews w-75">
            <br /><h5 className="yes-indent"><strong>PHOTO FEEDBACKS</strong></h5>
            {reviews && reviews.map(review => (
                <div key={review._id} className="review-card my-3" style={{ border: '2px solid #ddd', paddingTop: '15px',  paddingLeft: '15px', borderRadius: '10px', marginLeft: '35%'}}>
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                    </div>
                    <p className="review-user">by {review.name}: <i>{review.comment}</i></p>
                    <div>
                             <Carousel pause='hover'>
                                 {review.images && review.images.map(image => (
                                     <Carousel.Item key={image.public_id} style={{ height: '360px', overflow: 'hidden' }}>
                                         <img className="d-block w-100 h-100 object-fit-cover" src={image.url}/>
                                     </Carousel.Item>
                                 ))}
                             </Carousel>
                        </div>       
                </div>
            ))}
        </div>
    );
};

export default ListReviews;
