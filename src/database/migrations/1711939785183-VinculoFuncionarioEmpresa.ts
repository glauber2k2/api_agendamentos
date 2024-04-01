import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class VinculoFuncionarioEmpresa1711939785183
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria a extensão uuid-ossp se ela ainda não existir
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    // Cria a tabela user_company
    await queryRunner.createTable(
      new Table({
        name: 'user_company',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'companyId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    )

    // Cria as chaves estrangeiras
    await queryRunner.createForeignKey(
      'user_company',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'user_company',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a tabela user_company
    await queryRunner.dropTable('user_company')

    // Remove a extensão uuid-ossp se ela existir
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
