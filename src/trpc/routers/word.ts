import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '~/utils/s3';

export const wordRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) =>
			ctx.db.word.findFirstOrThrow({
				where: { id: input.id },
				select: {
					id: true,
					text: true,
					imgSrc: true,
					tag: { select: { name: true } },
				},
			}),
		),
	createPresignedUrl: publicProcedure
		.input(z.object({ directory: z.string().min(1), ext: z.string().min(1) }))
		.mutation(async ({ input }) => {
			const key = `${input.directory}${randomUUID()}.${input.ext}`;

			const command = new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME as string,
				Key: key,
			});

			const signedUrl = await getSignedUrl(s3, command);

			return signedUrl;
		}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				imgSrc: z.string().min(1),
				tagId: z.string().min(1),
				lessonId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if tagId is valid
			await ctx.db.tag.findFirstOrThrow({ where: { id: input.tagId } });

			// Check if lessonId is valid
			await ctx.db.lesson.findFirstOrThrow({ where: { id: input.lessonId } });

			return ctx.db.word.create({
				data: {
					text: input.name,
					imgSrc: input.imgSrc,
					tagId: input.tagId,
					lessonId: input.lessonId,
				},
			});
		}),
});
