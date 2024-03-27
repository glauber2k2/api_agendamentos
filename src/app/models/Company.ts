import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import User from './User'

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  nome: string

  @Column()
  nome_fantasia: string

  @Column({ unique: true, length: 14 })
  cnpj: string

  @Column()
  plano: string

  @Column({ nullable: true })
  descricao: string

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'owner' })
  user: User
}

export default Company
