import { Row } from './layout/flex';

export function StarRating({ rating = 0 }: { rating?: number }) {
    return (
        <Row className="gap-x-1" aria-label={rating + ' out of 5 stars'}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={'icon ' + (star <= rating ? 'icon-filled' : '')}
                    width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden="true">
                    <path d="M12 2.5L15.09 8.76L22 9.77L17 14.64L18.18 21.52L12 18.27L5.82 21.52L7 14.64L2 9.77L8.91 8.76L12 2.5Z"
                        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ))}
        </Row>
    );
}
