import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , ManyToOne, JoinColumn} from 'typeorm';

@Entity('users')

export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
  
  @Column({ nullable: true })
  hospital_id: number;

  @Column({ nullable: true })
  doctor_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}