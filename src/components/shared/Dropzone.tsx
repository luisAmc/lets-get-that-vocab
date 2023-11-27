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
}

// 10MB
export const MAX_FILE_SIZE = 1 * 1000 * 1000 * 10;

export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp',
];

export function Dropzone({ multiple = false, disabled = false }: Props) {
	const form = useFormContext();

	const media: FileWithPreview[] | undefined = useWatch({
		name: 'media',
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
			form.setValue('media', [
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
			media?.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[media],
	);

	return (
		<div>
			<div
				className="grid h-64 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-100"
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
							<p className="text-xs text-gray-500">Suelte la imagen aquí...</p>
						) : (
							<div className="flex flex-col items-center justify-center p-6 text-gray-500">
								<CloudArrowUpIcon className="h-8 w-8" />

								<p className="mb-2 text-xs">
									<span className="font-semibold">Presione click</span> o
									arrastre y suelte
								</p>

								<p className="text-xs">JPG, PNG, GIF o WEBP</p>
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
