import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , ManyToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity('patients')

export class Patients {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  hospital_id: number;

  @Column({ nullable: true })
  doctor_id: number;
  
  @Column({ nullable: true })
  patient_id: string;

  @Column({ nullable: true })
  visit_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  recently_travelled: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  consent: boolean;

  @Column({ nullable: true, default: 'US'  })
  country: string;
  
  @Column({ nullable: true, default: 'en' })
  language: string;

  @Column()
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  
}