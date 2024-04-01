import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateInvitationTable1711951210838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria a extensão uuid-ossp se ela ainda não existir
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    // Cria a tabela de convites
    await queryRunner.createTable(
      new Table({
        name: 'invitation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'invitedUserId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'invitingCompanyId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'accepted', 'rejected'],
            default: `'pending'`,
          },
        ],
      }),
    )

    // Adiciona as chaves estrangeiras
    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['invitedUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['invitingCompanyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a tabela de convites
    await queryRunner.dropTable('invitation')

    // Remove a extensão uuid-ossp se ela existir
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
