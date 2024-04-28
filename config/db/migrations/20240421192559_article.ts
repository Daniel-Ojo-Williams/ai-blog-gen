import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('articles', table => {
    table.uuid('id').primary().notNullable();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.string('link').notNullable();
    table.timestamps(true, true);
  } )
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('articles');
}

