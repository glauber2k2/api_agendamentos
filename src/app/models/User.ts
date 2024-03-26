import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import bcrypt from 'bcryptjs'

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

  @BeforeInsert()
  @BeforeUpdate()
  async formatData() {
    this.email = this.email.toLowerCase()
    this.username = this.username.toLowerCase()
    // Verifica se uma nova senha foi definida antes de criptografá-la
    if (this.password && this.password !== this.getOriginalPassword()) {
      this.password = bcrypt.hashSync(this.password, 8)
    }
  }

  // Método para obter a senha original do usuário
  getOriginalPassword() {
    return this.id ? this.password : null
  }
}

export default User
