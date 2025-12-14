import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765650830502 implements MigrationInterface {
  name = 'Migration1765650830502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" text NOT NULL, "password" text NOT NULL, "version" integer NOT NULL DEFAULT '1', "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "artistId" uuid, "albumId" uuid, "duration" numeric NOT NULL, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_2fde25c80bd089c0fa0e7986409" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favs_artists" ("favId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_967332d60dc9bc64d3e3198fc6b" PRIMARY KEY ("favId", "artistId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6635a6a8b56205429ac511701e" ON "favs_artists" ("favId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08f8a0882594d24d359545372b" ON "favs_artists" ("artistId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favs_albums" ("favId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_4ef6e5adf1218448adc31434375" PRIMARY KEY ("favId", "albumId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1caa2cc74467ea2e2551d47385" ON "favs_albums" ("favId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae8008eca87227ab48a6603d58" ON "favs_albums" ("albumId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favs_tracks" ("favId" uuid NOT NULL, "trackId" uuid NOT NULL, CONSTRAINT "PK_5b35195f43e0a5cf3a321e46c77" PRIMARY KEY ("favId", "trackId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bec0a988ea0b7fbaa593c05706" ON "favs_tracks" ("favId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07ed537531349b00cfd8c58919" ON "favs_tracks" ("trackId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_62f595181306916265849fced48" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_artists" ADD CONSTRAINT "FK_6635a6a8b56205429ac511701e1" FOREIGN KEY ("favId") REFERENCES "favs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_artists" ADD CONSTRAINT "FK_08f8a0882594d24d359545372b0" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_albums" ADD CONSTRAINT "FK_1caa2cc74467ea2e2551d47385a" FOREIGN KEY ("favId") REFERENCES "favs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_albums" ADD CONSTRAINT "FK_ae8008eca87227ab48a6603d586" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_tracks" ADD CONSTRAINT "FK_bec0a988ea0b7fbaa593c057067" FOREIGN KEY ("favId") REFERENCES "favs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_tracks" ADD CONSTRAINT "FK_07ed537531349b00cfd8c58919d" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favs_tracks" DROP CONSTRAINT "FK_07ed537531349b00cfd8c58919d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_tracks" DROP CONSTRAINT "FK_bec0a988ea0b7fbaa593c057067"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_albums" DROP CONSTRAINT "FK_ae8008eca87227ab48a6603d586"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_albums" DROP CONSTRAINT "FK_1caa2cc74467ea2e2551d47385a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_artists" DROP CONSTRAINT "FK_08f8a0882594d24d359545372b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favs_artists" DROP CONSTRAINT "FK_6635a6a8b56205429ac511701e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_62f595181306916265849fced48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07ed537531349b00cfd8c58919"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bec0a988ea0b7fbaa593c05706"`,
    );
    await queryRunner.query(`DROP TABLE "favs_tracks"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae8008eca87227ab48a6603d58"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1caa2cc74467ea2e2551d47385"`,
    );
    await queryRunner.query(`DROP TABLE "favs_albums"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_08f8a0882594d24d359545372b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6635a6a8b56205429ac511701e"`,
    );
    await queryRunner.query(`DROP TABLE "favs_artists"`);
    await queryRunner.query(`DROP TABLE "favs"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
