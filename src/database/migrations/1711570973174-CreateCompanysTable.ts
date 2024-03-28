import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateCompanysTable1711570973174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'main_company_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'identifier',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
          },
          {
            name: 'cnpj',
            type: 'varchar',
            isUnique: true,
            length: '14',
          },
          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user',
            type: 'uuid',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['main_company_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies')
  }
}
