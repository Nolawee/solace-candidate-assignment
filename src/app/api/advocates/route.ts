import db from "../../../db";
import { sql, eq, or, inArray, and, SQL, asc, desc, gt, lt } from "drizzle-orm";
import { advocates, advocatesSpecialties, specialties } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q');
  const degreeFilters = searchParams.getAll('degree');
  const sortParam = searchParams.get('sort');
  const sortDirection = sortParam === 'desc' ? 'desc' : 'asc';
  const limitParam = Number.parseInt(searchParams.get('limit') ?? '', 10);
  const pageSize = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 5;
  const cursorParam = searchParams.get('cursor');
  let cursorYears: number | null = null;
  let cursorId: number | null = null;

  if (cursorParam) {
    const [yearsStr, idStr] = cursorParam.split('_');
    const parsedYears = Number(yearsStr);
    const parsedId = Number(idStr);

    if (!Number.isNaN(parsedYears) && !Number.isNaN(parsedId)) {
      cursorYears = parsedYears;
      cursorId = parsedId;
    }
  }

  // If there's a search term, find advocates with matching specialties
  let matchingAdvocateIds: number[] = [];
  const normalizedSearch = search?.trim() ?? "";
  let tsQuery: SQL | undefined;

  if (normalizedSearch.length > 0) {
    tsQuery = sql`websearch_to_tsquery('simple', ${normalizedSearch})`;
  }

  if (tsQuery) {
    const advocatesWithMatchingSpecialty = await db
      .selectDistinct({ id: advocates.id })
      .from(advocates)
      .innerJoin(advocatesSpecialties, eq(advocatesSpecialties.advocateId, advocates.id))
      .innerJoin(specialties, eq(specialties.id, advocatesSpecialties.specialtyId))
      .where(sql`${specialties.searchVector} @@ ${tsQuery}`);
    
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

  if (tsQuery) {
    const conditions: SQL[] = [
      sql`${advocates.searchVector} @@ ${tsQuery}`,
    ];

    if (matchingAdvocateIds.length > 0) {
      conditions.push(inArray(advocates.id, matchingAdvocateIds));
    }

    const searchClause =
      conditions.length === 1 ? conditions[0]! : or(...conditions);
    whereClause = whereClause ? and(whereClause, searchClause) : searchClause;
  }

  if (degreeFilters.length > 0) {
    const degreeClause =
      degreeFilters.length === 1
        ? eq(advocates.degree, degreeFilters[0]!)
        : inArray(advocates.degree, degreeFilters);
    whereClause = whereClause ? and(whereClause, degreeClause) : degreeClause;
  }

  if (cursorYears !== null && cursorId !== null) {
    const cursorCondition =
      sortDirection === "desc"
        ? or(
            lt(advocates.yearsOfExperience, cursorYears),
            and(
              eq(advocates.yearsOfExperience, cursorYears),
              lt(advocates.id, cursorId)
            )
          )
        : or(
            gt(advocates.yearsOfExperience, cursorYears),
            and(
              eq(advocates.yearsOfExperience, cursorYears),
              gt(advocates.id, cursorId)
            )
          );

    whereClause = whereClause
      ? and(whereClause, cursorCondition)
      : cursorCondition;
  }

  if (whereClause) {
    query = query.where(whereClause) as typeof query;
  }

  const orderByExpressions =
    sortDirection === "desc"
      ? [desc(advocates.yearsOfExperience), asc(advocates.id)]
      : [asc(advocates.yearsOfExperience), asc(advocates.id)];

  const results = await query
    .groupBy(
      advocates.id,
      advocates.firstName,
      advocates.lastName,
      advocates.city,
      advocates.degree,
      advocates.yearsOfExperience,
      advocates.phoneNumber
    )
    .orderBy(...orderByExpressions)
    .limit(pageSize + 1);

  const hasNextPage = results.length > pageSize;
  const data = hasNextPage ? results.slice(0, pageSize) : results;
  const lastItem = data[data.length - 1];
  const nextCursor =
    hasNextPage && lastItem
      ? `${lastItem.yearsOfExperience}_${lastItem.id}`
      : null;

  return Response.json({
    data,
    pageInfo: {
      hasNextPage,
      nextCursor,
      pageSize,
      sortDirection,
    },
  });
}
