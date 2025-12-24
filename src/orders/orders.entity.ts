import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('orders')
export class Orders {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  invoice_no: string;

  @Column()
  plan_id: number;
  
  @Column()
  plan: string;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  plan_type: string;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  user_email: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthly_price: string;

  @Column('decimal', { precision: 10, scale: 2 })
  grand_total: string;

  @Column({ nullable: true })
  templates: string;

  @Column({ nullable: true })
  medical_dictation: string;

  @Column({ nullable: true })
  ai_assisted: string;
  
  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;
  
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
    
}
