import '../styles.css';
import { AnimatePresence } from 'framer-motion';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
	const { pathname } = useRouter();

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Component key={pathname} {...pageProps} />
		</AnimatePresence>
	);
};

export default api.withTRPC(App);
