import { ArcElement, CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';

export const initPackages = () => {
    Chart.register(ArcElement, PointElement, LineElement, Legend, Tooltip, CategoryScale, LinearScale);
};
