import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')

export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_code: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  role_id: number;

  @Column({ nullable: true })
  hospital_id: number;

  @Column({ nullable: true })
  doctor_id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  public_user_name: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true })
  emr_use: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  timezone: string;

  // Stores SOAP Summary Ordering + Pre-Visit Summary Configuration as a single JSON string.
  @Column({ type: 'longtext', nullable: true })
  soap_summary_settings: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  plan_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
  
}