export interface ArtCollection {
    id: string;
    name: string;
    description: string;
    artworks: string[]; // Array of artwork IDs
    createdAt: Date;
    updatedAt: Date;
}