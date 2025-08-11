CREATE TABLE "role_points" (
	"role_points" integer,
	"points" integer,
	CONSTRAINT "role_points_role_points_pk" PRIMARY KEY("role_points"),
	CONSTRAINT "role_points_role_points_unique" UNIQUE("role_points")
);
--> statement-breakpoint
ALTER TABLE "role_points" ADD CONSTRAINT "role_points_role_points_roles_id_fk" FOREIGN KEY ("role_points") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;