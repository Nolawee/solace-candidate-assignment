// app/api/advocates/route.ts
import db from "../../../db";
import { sql, eq } from "drizzle-orm";
import { advocates, advocatesSpecialties, specialties } from "../../../db/schema";

export async function GET() {
  const data = await db
    .select({
      id: advocates.id,
      firstName: advocates.firstName,
      lastName: advocates.lastName,
      city: advocates.city,
      degree: advocates.degree,
      yearsOfExperience: advocates.yearsOfExperience,
      phoneNumber: advocates.phoneNumber,
      specialties: sql<string[]>`COALESCE(
        json_agg(${specialties.name} ORDER BY ${specialties.name})
        FILTER (WHERE ${specialties.id} IS NOT NULL),
        '[]'
      )`,
    })
    .from(advocates)
    .leftJoin(advocatesSpecialties, eq(advocatesSpecialties.advocateId, advocates.id))
    .leftJoin(specialties, eq(specialties.id, advocatesSpecialties.specialtyId))
    .groupBy(
      advocates.id,
      advocates.firstName,
      advocates.lastName,
      advocates.city,
      advocates.degree,
      advocates.yearsOfExperience,
      advocates.phoneNumber
    )
    .orderBy(advocates.id);

  return Response.json({ data });
}
