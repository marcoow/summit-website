import { tableDefinitions } from "$lib/schemas";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";

const VALID_TABLES = [
	"users",
	"conferences",
	"talks",
	"sponsors",
	"roles",
] as const;
type TableName = (typeof VALID_TABLES)[number];

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { table, id } = params;

	if (!tableDefinitions[table].schema || !VALID_TABLES.includes(table)) {
		error(404, "Table not found");
	}

	let form: unknown;

	if (id !== "new") {
		const item = await db
			.prepare(`SELECT * FROM ${table} WHERE id = ?`)
			.get(params.id);

		if (!item) {
			error(404, "Item not found");
		}

		form = await superValidate(item, zod(tableDefinitions[table].schema));
	} else {
		form = await superValidate(zod(tableDefinitions[table].schema));
	}

	return { form, fields: tableDefinitions[table].fields };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, params }) => {
		const { table, id } = params;
		const form = await superValidate(request, zod(schemas[table]));

		if (!form.valid) {
			return { form };
		}

		try {
			if (id === "new") {
				const columns = Object.keys(form.data).join(", ");
				const values = Object.values(form.data);
				const placeholders = values.map(() => "?").join(", ");

				await db
					.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`)
					.run(...values);
			} else {
				const sets = Object.keys(form.data)
					.map((key) => `${key} = ?`)
					.join(", ");

				await db
					.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`)
					.run(...Object.values(form.data), id);
			}

			redirect(303, `/admin/${table}`);
		} catch (e) {
			console.error(e);
			error(500, "Database error");
		}
	},
};