export interface Param {
  key: string;
  value: string;
}

export interface Header {
  key: string;
  value: string;
}
export interface RequestState {
  id: string;               // unique tab id
  name: string;             // display name (e.g., "GET /users")
  method: string;
  url: string;
  params: Param[];
  headers: Header[];
  body: string;
}

// For saved history/collections
export interface SavedRequest extends RequestState {
  timestamp: number;
}
export interface Collection {
  id: string;
  name: string;
  isFavorite: boolean;
  requests: SavedRequest[];
}