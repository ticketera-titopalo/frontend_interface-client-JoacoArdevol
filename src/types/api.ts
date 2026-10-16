export interface ApiStatus {
  message?: string;
  [key: string]: unknown;
}

export interface EventRecord {
  id?: string | number;
  _id?: string | number;
  titulo?: string;
  title?: string;
  nombre?: string;
  name?: string;
  [key: string]: unknown;
}

export type EventCollectionResponse =
  | EventRecord[]
  | {
      eventos?: EventRecord[];
      events?: EventRecord[];
      data?: EventRecord[];
    };
