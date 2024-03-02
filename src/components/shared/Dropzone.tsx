import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FieldError } from './Form';

export interface FileWithPreview extends File {
	preview: string;
}

interface Props {
	multiple?: boolean;
	disabled?: boolean;
	name: string;
}

export const MAX_FILE_SIZE = 1 * 1000 * 1000 * 10; // 10MB

export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp',
];

export function Dropzone({ multiple = false, disabled = false, name }: Props) {
	const form = useFormContext();

	const media: FileWithPreview[] | undefined = useWatch({
		name: name,
		control: form.control,
	});

	const dropzone = useDropzone({
		multiple,
		maxFiles: 1,
		maxSize: MAX_FILE_SIZE,
		accept: {
			'image/*': ACCEPTED_IMAGE_TYPES.map((type) =>
				type.replace('image/', '.'),
			),
		},
		onDrop: (acceptedFiles) => {
			form.setValue(name, [
				...(multiple ? form.getValues().media ?? [] : []),
				...acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					}),
				),
			]);
		},
	});

	useEffect(
		() => () => {
			if (media) {
				URL.revokeObjectURL(media?.[0].preview);
			}
		},
		[media],
	);

	return (
		<div>
			<div
				className="grid h-10 w-full cursor-pointer place-items-center overflow-hidden rounded-lg border border-solid border-brand-200 hover:bg-brand-100"
				{...dropzone.getRootProps()}
			>
				<input {...dropzone.getInputProps()} disabled={disabled} />

				{media ? (
					<div className="h-full w-full overflow-hidden rounded bg-white">
						{media.map((file) => (
							<Preview key={file.name} file={file} />
						))}
					</div>
				) : (
					<>
						{dropzone.isDragActive ? (
							<span className="text-xs text-brand-500">
								Suelte la imagen aquí...
							</span>
						) : (
							<div className="flex items-center justify-center gap-x-2 text-brand-500">
								<CloudArrowUpIcon className="size-5" />
								<span className="text-xs">(JPG, PNG, GIF o WEBP)</span>
							</div>
						)}
					</>
				)}
			</div>

			<FieldError name="media" />
		</div>
	);
}

interface PreviewProps {
	file: FileWithPreview;
}

function Preview({ file }: PreviewProps) {
	return (
		// eslint-disable-next-line
		<img className="h-full w-full object-cover" src={file.preview} alt="" />
	);
}
