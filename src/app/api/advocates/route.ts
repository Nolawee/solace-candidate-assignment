// app/api/advocates/route.ts
import db from "../../../db";
import { sql } from "drizzle-orm";

export async function GET() {
  const data = await db.execute(sql`
    SELECT
      a.id,
      a.first_name AS "firstName",
      a.last_name AS "lastName",
      a.city,
      a.degree,
      a.years_of_experience AS "yearsOfExperience",
      a.phone_number AS "phoneNumber",
      COALESCE(
        json_agg(s.name ORDER BY s.name)
        FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS specialties
    FROM advocates a
    LEFT JOIN advocates_specialties asj ON asj.advocate_id = a.id
    LEFT JOIN specialties s ON s.id = asj.specialty_id
    GROUP BY a.id, a.first_name, a.last_name, a.city, a.degree, a.years_of_experience, a.phone_number
    ORDER BY a.id;
  `);

  return Response.json({ data });
}
