import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('appoinments')
export class Appointment{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;
  
  @Column()
  user_mobile: string;

  @Column()
  doctor_id: string;

  @Column()
  doctor_name: string;

  @Column()
  doctor_email: string;

  @Column({ type: 'date' })
  appointment_date: string; 

  @Column({ type: 'time' })
  appointment_time: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}
