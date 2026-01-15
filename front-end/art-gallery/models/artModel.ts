export interface Art {
  artFilePath: string;
  artName: string;
  artDescription: string;
}

export interface ArtsResponse {
  arts: Art[];
}