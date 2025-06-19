import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1750339516892 implements MigrationInterface {
    name = 'CreatePostsTable1750339516892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL DEFAULT 'Untitled', "summary" text, "content" text, "image" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_d03fb91772937997f010466a007" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_d03fb91772937997f010466a007"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
