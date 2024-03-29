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
  identifier: string

  @Column({ nullable: true })
  isVisible: boolean

  @Column()
  name: string

  @Column()
  business_name: string

  @Column({ unique: true, length: 14 })
  cnpj: string

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => Company, (company) => company.main_company_id, {
    nullable: true,
  })
  @JoinColumn({ name: 'main_company_id' })
  main_company_id: Company

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'user' })
  user: User
}

export default Company
