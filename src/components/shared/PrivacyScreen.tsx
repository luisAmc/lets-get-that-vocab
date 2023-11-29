import { motion, useIsPresent } from 'framer-motion';

export function PrivacyScreen() {
	const isPresent = useIsPresent();

	return (
		<motion.div
			className="bg-brand-600 fixed inset-0 z-50"
			initial={{ scaleX: 1 }}
			animate={{
				scaleX: 0,
				transition: { duration: 0.5, ease: 'circOut' },
			}}
			exit={{
				scaleX: 1,
				transition: { duration: 0.5, ease: 'circIn' },
			}}
			style={{ originX: isPresent ? 0 : 1 }}
		></motion.div>
	);
}
