import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import Company from './Company'
import User from './User'

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.invitations)
  invitedUser: User

  @ManyToOne(() => Company, (company) => company.invitations)
  invitingCompany: Company

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string
}

export default Invitation
