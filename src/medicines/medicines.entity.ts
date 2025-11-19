import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('medicines')
export class Medicines {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  status: number;

  @Column({nullable: true})
  unique_code: string;

  @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
    
}
