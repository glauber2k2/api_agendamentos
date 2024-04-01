import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import Company from './Company'
import User from './User'

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.userCompanies)
  user: User

  @ManyToOne(() => Company, (company) => company.userCompanies)
  company: Company
}

export default UserCompany
