export type ProductModel = {
  categoryName: string;
  productId: string,
  name: string,
  pictureUrl: string,
  sizes: string[],
  stockQuantity: number,
  price: number,
  colors: string[],
  categoryId: string;
  rate: number;
  makeReviews: ReviewModel[];
  isInFav: boolean;
  isInCart: boolean;
  description: string;
}


export type ReviewModel = {
  reviewId: string;
  comment: string,
  numberOfPoint: number,
  createdAt: Date,
  appUserId: string
}
