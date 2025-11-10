import db from "../../../db";
import { sql, eq, or, ilike, inArray, and, SQL, asc, desc } from "drizzle-orm";
import { advocates, advocatesSpecialties, specialties } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const degreeFilters = searchParams.getAll('degree');
  const sortParam = searchParams.get('sort');
  const sortDirection = sortParam === 'desc' ? 'desc' : 'asc';

  // If there's a search term, find advocates with matching specialties
  let matchingAdvocateIds: number[] = [];
  if (search) {
    const advocatesWithMatchingSpecialty = await db
      .selectDistinct({ id: advocates.id })
      .from(advocates)
      .innerJoin(advocatesSpecialties, eq(advocatesSpecialties.advocateId, advocates.id))
      .innerJoin(specialties, eq(specialties.id, advocatesSpecialties.specialtyId))
      .where(ilike(specialties.name, `%${search}%`));
    
    matchingAdvocateIds = advocatesWithMatchingSpecialty.map((a: { id: number }) => a.id);
  }

  // Build the main query
  let query = db
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
    .leftJoin(specialties, eq(specialties.id, advocatesSpecialties.specialtyId));

  // Apply search filter if provided
  let whereClause: SQL | undefined;

  if (search) {
    const conditions = [
      ilike(advocates.firstName, `%${search}%`),
      ilike(advocates.lastName, `%${search}%`),
      ilike(advocates.city, `%${search}%`),
      ilike(advocates.degree, `%${search}%`)
    ];

    // Include advocates that have a matching specialty
    if (matchingAdvocateIds.length > 0) {
      conditions.push(inArray(advocates.id, matchingAdvocateIds));
    }

    const searchClause = or(...conditions);
    whereClause = whereClause ? and(whereClause, searchClause) : searchClause;
  }

  if (degreeFilters.length > 0) {
    const degreeClause =
      degreeFilters.length === 1
        ? eq(advocates.degree, degreeFilters[0]!)
        : inArray(advocates.degree, degreeFilters);
    whereClause = whereClause ? and(whereClause, degreeClause) : degreeClause;
  }

  if (whereClause) {
    query = query.where(whereClause) as typeof query;
  }

  const orderByExpressions =
    sortDirection === "desc"
      ? [desc(advocates.yearsOfExperience), asc(advocates.id)]
      : [asc(advocates.yearsOfExperience), asc(advocates.id)];

  const data = await query
    .groupBy(
      advocates.id,
      advocates.firstName,
      advocates.lastName,
      advocates.city,
      advocates.degree,
      advocates.yearsOfExperience,
      advocates.phoneNumber
    )
    .orderBy(...orderByExpressions);

  return Response.json({ data });
}
