// db/schema.ts
import { sql, relations } from "drizzle-orm";
import {
  pgTable, integer, text, serial, timestamp, bigint,
  uniqueIndex, index, primaryKey
} from "drizzle-orm/pg-core";

export const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const specialties = pgTable(
  "specialties",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    uqName: uniqueIndex("uq_specialties_name").on(t.name),
    uqSlug: uniqueIndex("uq_specialties_slug").on(t.slug),
  })
);

export const advocatesSpecialties = pgTable(
  "advocates_specialties",
  {
    advocateId: integer("advocate_id")
      .notNull()
      .references(() => advocates.id, { onDelete: "cascade" }),
    specialtyId: integer("specialty_id")
      .notNull()
      .references(() => specialties.id, { onDelete: "restrict" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.advocateId, t.specialtyId], name: "pk_adv_spec" }),
    bySpecialty: index("idx_adv_specs_specialty_advocate").on(t.specialtyId, t.advocateId),
    byAdvocate: index("idx_adv_specs_advocate_specialty").on(t.advocateId, t.specialtyId),
  })
);

// db relations
export const advocatesRelations = relations(advocates, ({ many }) => ({
  advocateSpecialties: many(advocatesSpecialties),
}));
export const specialtiesRelations = relations(specialties, ({ many }) => ({
  advocateSpecialties: many(advocatesSpecialties),
}));
