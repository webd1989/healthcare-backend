import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('appoinments')
export class Appointment{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, default:0})
  user_id: string;

  @Column({nullable: true})
  appointment_no: string;
  
  @Column({nullable: true})
  template_id: string;

  @Column({nullable: true})
  user_name: string;

  @Column({ nullable: true })
  patient_id: string;

  @Column({ nullable: true })
  visit_id: string;

  @Column({ nullable: true })
  user_first_name: string;

  @Column({ nullable: true })
  user_last_name: string;

  @Column({ nullable: true })
  user_email: string;
  
  @Column({ nullable: true })
  user_mobile: string;

  @Column({ nullable: true })
  doctor_id: string;
  
  @Column({ nullable: true })
  fields_data: string;

  @Column({ nullable: true })
  doctor_name: string;
  
  @Column({ nullable: true })
  visit_type: string;

  @Column({ nullable: true })
  workflow_type: string;

  @Column({ nullable: true })
  chief_complaint: string;

  @Column({ nullable: true })
  doctor_email: string;

  @Column({nullable: true, type: "longtext" })
  question_answers: string;
  
  @Column({nullable: true, type: "longtext" })
  appointment_vitals: string;

  @Column({ nullable: true,type: 'date' })
  appointment_date: string; 

  @Column({ nullable: true, type: 'time' })
  appointment_time: string;

  @Column({ nullable: true, default:'No' })
  previsit_created: string;

  @Column({ nullable: true, default:'No' })
  postvisit_created: string;

  @CreateDateColumn({ nullable: true,type: 'timestamp' })
  created_at: Date;

  @Column({nullable: true, default:'pending' })
  transcribe_status: string;
  
  @Column({nullable: true, default:'No' })
  soap_generated: string;
  
  @Column({nullable: true, type: "longtext" })
  quick_notes: string;

  @Column({nullable: true, type: "longtext" })
  tasks: string;

}
