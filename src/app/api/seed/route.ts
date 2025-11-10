// app/api/seed/route.ts
import db from "../../../db";
import { inArray, sql } from "drizzle-orm";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import {
  advocates,
  specialties as specialtiesTable,
} from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export async function POST() {
  try {
    const result = await db.transaction(async (tx: PgTransaction<PostgresJsQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>) => {
      // 1) Insert advocates
      const inserted = await tx
        .insert(advocates)
        .values(
          advocateData.map((a) => ({
            firstName: a.firstName,
            lastName: a.lastName,
            city: a.city,
            degree: a.degree,
            yearsOfExperience: a.yearsOfExperience,
            phoneNumber: a.phoneNumber,
          }))
        )
        .returning({ id: advocates.id });

      const advocateIds = inserted.map((r) => r.id);

      // 2) Upsert specialties (dedup by slug)
      const labels = Array.from(
        new Set(
          advocateData.flatMap((a) => (a.specialties ?? []).map((x) => x.trim())).filter(Boolean)
        )
      );
      const rows = labels.map((name) => ({ name, slug: slugify(name) }));

      if (rows.length) {
        await tx.execute(sql`
          INSERT INTO "specialties" ("name","slug")
          VALUES ${sql.join(rows.map((r) => sql`(${r.name}, ${r.slug})`), sql`, `)}
          ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name"
        `);
      }

      // 3) Fetch specialties to map slug → id
      const specRecords = await tx
        .select()
        .from(specialtiesTable)
        .where(inArray(specialtiesTable.slug, rows.map((r) => r.slug)));
      const specBySlug = new Map(specRecords.map((r) => [r.slug, r.id]));

      // 4) Insert join rows advocates ↔ specialties
      const joinValues: { advocateId: number; specialtyId: number }[] = [];
      advocateIds.forEach((advId, idx) => {
        (advocateData[idx].specialties ?? []).forEach((label) => {
          const sid = specBySlug.get(slugify(label));
          if (sid) joinValues.push({ advocateId: advId, specialtyId: sid });
        });
      });

      if (joinValues.length) {
        await tx.execute(sql`
          INSERT INTO "advocates_specialties" ("advocate_id","specialty_id")
          VALUES ${sql.join(
            joinValues.map((v) => sql`(${v.advocateId}, ${v.specialtyId})`),
            sql`, `
          )}
          ON CONFLICT DO NOTHING
        `);
      }

      return {
        advocates: advocateIds.length,
        specialties: specBySlug.size,
        links: joinValues.length,
      };
    });

    return Response.json({ ok: true, counts: result });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
