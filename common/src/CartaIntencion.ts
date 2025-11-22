export type ICartaIntencion = {
  _id?: string;
  sobremesa_id: string;
  user_id: string;
  text: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: Date;
};
