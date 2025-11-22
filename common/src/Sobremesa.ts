export type ISobremesa = {
  _id?: string;
  title: string;
  description: string;
  date_time: Date;
  max_participants: number;
  convocante_id: string;
  status: 'proposed' | 'confirmed' | 'completed' | 'cancelled';
  meeting_link?: string;
  created_at?: Date;
  updated_at?: Date;
};
