import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('orders')
export class Orders {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoice_no: string;

  @Column()
  plan_id: number;
  
  @Column()
  plan: string;

  @Column()
  user_id: number;

  @Column()
  transaction_id: string;

  @Column()
  plan_type: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthly_price: string;

  @Column('decimal', { precision: 10, scale: 2 })
  grand_total: string;

  @Column()
  templates: string;

  @Column()
  medical_dictation: string;

  @Column()
  ai_assisted: string;
  
  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;
  
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
    
}
