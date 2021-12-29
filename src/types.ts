export interface FlashCard {
  id: string;
  frontSide: string;
  backSide: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'failed';
