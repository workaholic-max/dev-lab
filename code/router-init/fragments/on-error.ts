export const onRouterError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : '';

    const isChunkLoadError =
        message.includes('Failed to fetch dynamically imported module') ||
        message.includes('Importing a module script failed');

    if (isChunkLoadError) {
        window.location.reload();
    }
};
