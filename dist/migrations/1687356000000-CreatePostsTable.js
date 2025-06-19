export class CreatePostsTable1687356000000 {
    constructor() {
        this.name = 'CreatePostsTable1687356000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL DEFAULT 'Untitled',
                "summary" character varying(1000),
                "content" character varying(5000),
                "image" character varying(500),
                "author" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_d03fb91772937997f010466a007"
            FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_d03fb91772937997f010466a007"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }
}
