import {
	ACCEPTED_IMAGE_TYPES,
	Dropzone,
	MAX_FILE_SIZE,
} from '~/components/shared/Dropzone';
import { api } from '~/utils/api';
import { Button } from '~/components/shared/Button';
import { ErrorMessage } from '~/components/shared/ErrorMessage';
import { Form, useZodForm } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Page } from '~/components/shared/Page';
import { Search } from '~/components/shared/Search';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';
import { z } from 'zod';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { uploadFile } from '~/utils/uploadFile';
import { useRouter } from 'next/router';

const wordSchema = z.object({
	name: z.string().min(1, 'Ingrese la palabra o frase.'),
	media: z
		.any()
		.refine((files) => (files?.[0] as File)?.size <= MAX_FILE_SIZE)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'Solo se soportan formatos .jpg, .jpeg, .png y .webp.',
		),
	tagId: z.string().min(1, 'Seleccione una etiqueta.'),
});

const createWordsSchema = z.object({
	words: z.array(wordSchema),
	createAccessKey: z.string().min(1, 'Ingrese la clave de creación.'),
});

export function CreateWords() {
	const router = useRouter();
	const lessonId = router.query.lessonId as string;

	const createSignedMutation = api.file.createPresignedUrl.useMutation({
		onError: () => {
			form.reset(form.getValues());
		},
	});

	const tagsQuery = api.tag.getAll.useQuery();

	const tags = useMemo(() => {
		if (!tagsQuery.data) {
			return [];
		}

		return tagsQuery.data.map((tag) => ({ label: tag.name, value: tag.id }));
	}, [tagsQuery.data]);

	const form = useZodForm({
		schema: createWordsSchema,
		defaultValues: { words: [{ name: '', media: '', tagId: '' }] },
	});

	const wordsFieldArray = useFieldArray({
		control: form.control,
		name: 'words',
	});

	const trpcContext = api.useUtils();

	const createWordsMutation = api.word.createMultiple.useMutation({
		onSuccess: () => {
			trpcContext.lesson.get.invalidate({
				id: lessonId,
			});

			const url = router.asPath;
			const pivot = url.lastIndexOf('/');

			router.push(url.slice(0, pivot));
		},
		onError: () => {
			form.reset(form.getValues());
		},
	});

	async function handleSubmit(input: z.infer<typeof createWordsSchema>) {
		const words = [];

		for (const word of input.words) {
			const signedUrl = await createSignedMutation.mutateAsync({
				directory: 'testImages/',
				ext: (word.media[0] as File).name.split('.').pop()!,
				createAccessKey: input.createAccessKey,
			});

			const imgSrc = await uploadFile(signedUrl, word.media[0] as File);

			words.push({
				name: word.name,
				tagId: word.tagId,
				imgSrc: imgSrc,
				lessonId: lessonId,
			});
		}

		await createWordsMutation.mutateAsync({
			words,
			createAccessKey: input.createAccessKey,
		});
	}

	return (
		<Page className="max-w-7xl">
			<div className="rounded-xl border-2 border-brand-300 bg-white px-4 py-6 shadow-sm">
				<header className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-x-2">
						<Button variant="secondary" size="icon" href="/control-panel/units">
							<ChevronLeftIcon className="h-5 w-5" />
						</Button>

						<h1 className="text-2xl">Añadir palabras</h1>
					</div>
				</header>

				<Form form={form} onSubmit={handleSubmit}>
					<ErrorMessage
						title="No se pudo crear la unidad"
						error={
							createSignedMutation.error?.message ||
							createWordsMutation.error?.message
						}
					/>

					<table className="mb-2 text-sm">
						<thead>
							<tr>
								<th className="px-4 py-2 text-center text-sm font-medium text-brand-600">
									#
								</th>
								<th className="px-4 py-2 text-left text-sm font-medium text-brand-600">
									Nombre
								</th>
								<th className="px-4 py-2 text-left text-sm font-medium text-brand-600">
									Imagen
								</th>
								<th className="px-4 py-2 text-left text-sm font-medium text-brand-600">
									Etiqueta
								</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{wordsFieldArray.fields.map((field, fieldIndex) => (
								<tr key={field.id}>
									<td className="px-4 py-2 text-center text-xs">
										{fieldIndex + 1}
									</td>

									<td className="px-4 py-2">
										<Input
											{...form.register(`words.${fieldIndex}.name`)}
											placeholder="Palabra o frase"
										/>
									</td>

									<td className="px-4 py-2">
										<Dropzone name={`words.${fieldIndex}.media`} />
									</td>

									<td className="px-4 py-2">
										<Search
											{...form.register(`words.${fieldIndex}.tagId`)}
											placeholder="Seleccione una etiqueta"
											options={tags}
										/>
									</td>

									<td>
										<Button
											size="icon"
											variant="ghost"
											onClick={() => wordsFieldArray.remove(fieldIndex)}
										>
											<TrashIcon className="size-4" />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<Button
						variant="dashed"
						onClick={() =>
							wordsFieldArray.append({ name: '', media: '', tagId: '' })
						}
					>
						Una palabra más
					</Button>

					<div className="mt-6 flex items-center justify-between">
						<div className="w-1/2">
							<Input
								{...form.register('createAccessKey')}
								type="password"
								label="Clave de creación"
							/>
						</div>

						<SubmitButton>Añadir palabras o frases</SubmitButton>
					</div>
				</Form>
			</div>
		</Page>
	);
}
