export interface Art {
  file: File | null;
  title: string;
  description: string;
  user_id: string;
}

export interface ArtsResponse {
  arts: Art[];
}