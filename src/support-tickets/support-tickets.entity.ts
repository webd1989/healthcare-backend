import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('support-tickets')
export class SupportTickets {

  @PrimaryGeneratedColumn()
  id: number;

   @Column()
  ticket_no: string;
  
  @Column()
  user_id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  status: number;
  
  @Column({ nullable: true })
  attachment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
    
}
