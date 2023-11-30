export function checkCreateAccessKey(givenCreateAccessKey: string) {
	if (givenCreateAccessKey !== process.env.CREATE_ACCESS_KEY) {
		throw new Error('Clave de creación incorrecta.');
	}

	return true;
}
