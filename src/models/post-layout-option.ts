export interface PostLayoutOption {
  postLocations: number[];
  description: PostLayoutDescription;
}

export interface PostLayoutDescription {
  additionalPosts: number;
  evenLayout: number;
  postsFallOnTryToAvoid: number;
  postsFallOnMustAvoid: number;
}
