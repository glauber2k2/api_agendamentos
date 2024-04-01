import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OneToMany } from 'typeorm'

import Company from './Company'

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

  @BeforeInsert()
  @BeforeUpdate()
  async formatData() {
    this.email = this.email.toLowerCase()
    this.username = this.username.toLowerCase()
  }
}

export default User
