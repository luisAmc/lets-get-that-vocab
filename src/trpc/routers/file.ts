import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkCreateAccessKey } from '~/utils/checkCreateAccessKey';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '~/utils/s3';

export const fileRouter = createTRPCRouter({
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
});
