import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('patientforms')
export class Patientform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  form_field: string;

  @Column()
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

}
