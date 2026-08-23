export const ensureServiceWorkerActivated = (): Promise<void> => {
    const { serviceWorker } = navigator;

    return new Promise((resolve) => {
        if (!serviceWorker?.controller) {
            resolve();

            return;
        }

        let isResolved = false;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const onControllerChange = () => {
            if (isResolved) return;

            isResolved = true;

            window.location.reload();
        };

        const cleanup = () => {
            serviceWorker.removeEventListener('controllerchange', onControllerChange);

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };

        const resolveOnce = () => {
            if (isResolved) return;

            isResolved = true;

            cleanup();
            resolve();
        };

        serviceWorker.addEventListener('controllerchange', onControllerChange);

        void (async () => {
            const registration = await serviceWorker.getRegistration();

            if (!registration) {
                resolveOnce();

                return;
            }

            timeoutId = setTimeout(resolveOnce, 7000); // 7s

            try {
                await registration.update();
            } catch {
                // A network hiccup checking for updates isn't fatal — fall through
            }

            if (!registration.waiting && !registration.installing) {
                resolveOnce();
            }
        })();
    });
};
