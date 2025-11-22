export type IParticipacion = {
  _id?: string;
  sobremesa_id: string;
  user_id: string;
  role: 'convocante' | 'participant';
  created_at?: Date;
};
