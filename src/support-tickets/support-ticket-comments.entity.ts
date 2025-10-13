import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('support-ticket-comments')
export class SupportTicketComments {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  ticket_id: number;
  
  @Column()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  message: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  attachment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
    
}
