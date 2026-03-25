const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

export const rootClassName = 'flex h-[100px] w-fit flex-col justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2';

export const dateClassName = 'text-base text-white';

export const metricsClassName = 'flex flex-col gap-1';

export const metricRowClassName = 'flex items-center gap-2 text-sm text-white';

export const metricLabelClassName = 'text-sm text-white';

export const metricValueClassName = 'text-sm text-white';

export const getMetricValueStateClassName = (empty = false) => {
    return cx(empty && 'text-white/70');
};
