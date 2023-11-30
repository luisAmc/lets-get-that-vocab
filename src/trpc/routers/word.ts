import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '~/utils/s3';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';

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
					tag: { select: { id: true, name: true } },
				},
			}),
		),

	removeImg: publicProcedure
		.input(
			z.object({
				directory: z.string().min(1),
				imgKey: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			checkCreateAccessKey(input.createAccessKey);

			const key = `${input.directory}${input.imgKey}`;

			const data = await s3.send(
				new DeleteObjectCommand({
					Bucket: process.env.AWS_BUCKET_NAME as string,
					Key: key,
				}),
			);

			return data;
		}),

	createPresignedUrl: publicProcedure
		.input(
			z.object({
				directory: z.string().min(1),
				ext: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			checkCreateAccessKey(input.createAccessKey);

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
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

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

	edit: publicProcedure
		.input(
			z.object({
				wordId: z.string().min(1),
				name: z.string().min(1),
				imgSrc: z.string().optional(),
				tagId: z.string().min(1),
				createAccessKey: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			checkCreateAccessKey(input.createAccessKey);

			// Check if tagId is valid
			await ctx.db.tag.findFirstOrThrow({ where: { id: input.tagId } });

			return ctx.db.word.update({
				where: { id: input.wordId },
				data: {
					text: input.name,
					imgSrc: input.imgSrc,
					tagId: input.tagId,
				},
			});
		}),
});
