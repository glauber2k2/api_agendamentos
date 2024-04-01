import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OneToMany } from 'typeorm'

import Company from './Company'
import UserCompany from './CompanyUser'
import Invitation from './Invitation'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  password: string

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[]

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user)
  userCompanies: UserCompany[] // Relação com a tabela de junção

  @OneToMany(() => Invitation, (invitation) => invitation.invitedUser)
  invitations: Invitation[]

  @BeforeInsert()
  @BeforeUpdate()
  async formatData() {
    this.email = this.email.toLowerCase()
    this.username = this.username.toLowerCase()
  }
}

export default User
