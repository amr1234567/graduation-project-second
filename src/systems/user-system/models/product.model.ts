export type ProductModel = {
  categoryName: string;
  productId: string,
  name: string,
  pictureUrl: string,
  size: string,
  stockQuantity: number,
  price: number,
  colors: string,
  categoryId: string;
  rate: number;
  makeReviews: ReviewModel[];
}


export type ReviewModel = {
  comment: string,
  numberOfPoint: number,
  createdAt: Date,
  appUserId: string
}
