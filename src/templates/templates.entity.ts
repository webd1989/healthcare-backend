import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , ManyToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity('templates')

export class Templates {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  hospital_id: number;
 
  @Column({ nullable: true })
  doctor_id: number;

  @Column({ nullable: true })
  template_name: string;

  @Column({ nullable: true })
  description: string;
  
  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  speciality: string;

  @Column({ nullable: true })
  subjective: string;

  @Column({ nullable: true })
  objective: string;

  @Column({ nullable: true })
  assessment: string;

  @Column({ nullable: true })
  plan: string;

  @Column({ nullable: true })
  tags: string;
  
  @Column({ nullable: true })
  appointment_type: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_favorite: boolean;

  @Column()
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  
}