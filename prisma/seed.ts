import { db } from '../src/utils/prisma';

const TAGS = [
	'Animales',
	'Comidas',
	'Objetos',
	'Artículos de ropa',
	'Personas',
	'Profesiones',
	'Expresiones',
	'Acción',
	'Saludos',
	'Comandos',
];

async function main() {
	for (const tag of TAGS) {
		await db.tag.upsert({
			where: { name: tag },
			create: {
				name: tag,
			},
			update: {},
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
