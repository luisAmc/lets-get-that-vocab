import { api } from '~/utils/api';
import { CheckCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Form, FormProps } from '~/components/shared/Form';
import { Input } from '~/components/shared/Input';
import { Search } from '~/components/shared/Search';
import { SubmitButton } from '~/components/shared/SubmitButton';
import { Textarea } from '~/components/shared/Textarea';
import { useEffect, useMemo } from 'react';

export const MAX_FILE_SIZE = 1 * 1000 * 1000 * 10; //10MB

export const ACCEPTED_FILE_TYPES = ['application/pdf'];

interface NoteFormProps extends FormProps {
	type: 'create' | 'edit';
}

export function NoteForm({ type, form, onSubmit }: NoteFormProps) {
	const lessonsQuery = api.lesson.getAll.useQuery();

	const lessonOptions = useMemo(() => {
		if (!lessonsQuery.data) {
			return [];
		}

		return lessonsQuery.data.map((lesson) => ({
			label: lesson.name,
			value: lesson.id,
		}));
	}, [lessonsQuery.data]);

	useEffect(() => {
		// While editing, we reset the form after the lesson's options
		// are created.
		//
		// This is because, if a related lesson exists, we set the
		// lesson's id as a default value in the form, but at that point
		// the seach field has no options so the corresponding item
		// can't be selected.
		//
		// By resetting the form after the options are created,
		// the search field can select an option.
		if (type === 'edit') {
			form.reset(form.getValues());
		}
	}, [lessonOptions]);

	return (
		<Form form={form} onSubmit={onSubmit}>
			<Input {...form.register('name')} label="Nombre" />

			<Input {...form.register('date')} label="Fecha" type="date" />

			<Input
				{...form.register('media')}
				label="Media (PDF)"
				type="file"
				accept="application/pdf"
			/>

			<Input
				{...form.register('videoSrc')}
				label="Link de video de clase (Opcional)"
			/>

			<Search
				{...form.register('relatedLessonId')}
				label="Lección relacionada (Opcional)"
				options={lessonOptions}
			/>

			<Textarea
				{...form.register('adittionalNotes')}
				label="Notas adicionales (Opcional)"
			/>

			<Input
				{...form.register('createAccessKey')}
				type="password"
				label="Clave de creación"
			/>

			<SubmitButton>
				{type === 'create' ? (
					<>
						<CheckCircleIcon className="mr-1 size-4" />
						<span>Crear</span>
					</>
				) : (
					<>
						<PencilSquareIcon className="mr-1 size-4" />
						<span>Editar</span>
					</>
				)}
			</SubmitButton>
		</Form>
	);
}
