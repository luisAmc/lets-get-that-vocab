export async function uploadFile(signedUrl: string, file: File) {
	await fetch(signedUrl, {
		method: 'PUT',
		body: file,
		headers: {
			'Content-Type': file.type,
		},
	});

	return signedUrl.split('?')[0];
}
