import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('plans')
export class Plans {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthly_price: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthly_price_for_year: string;

  @Column()
  sort_description: string;

  @Column()
  description: string;

  @Column()
  templates: string;

  @Column()
  templates_description: string;

  @Column()
  medical_dictation: string;

  @Column()
  medical_dictation_description: string;

  @Column()
  ai_assisted: string;

  @Column()
  ai_assisted_description: string;

  @Column()
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
    
}
