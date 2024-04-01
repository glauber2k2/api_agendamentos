import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import User from './User'
import UserCompany from './CompanyUser'
import Invitation from './Invitation'

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  identifier: string

  @Column({ default: true })
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

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  userCompanies: UserCompany[] // Relação com a tabela de junção

  @OneToMany(() => Invitation, (invitation) => invitation.invitingCompany)
  invitations: Invitation[]
}

export default Company
