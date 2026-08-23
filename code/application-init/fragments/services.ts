type ServiceExport = { init?: () => void };

const serviceModules = import.meta.glob<Record<string, ServiceExport>>(
    ['/src/**/*.service.js', '/src/**/*.service.ts'],
    { eager: true }
);

export const initServices = () => {
    Object.values(serviceModules).forEach((module) => {
        Object.values(module).forEach((service) => {
            service.init?.();
        });
    });
};
