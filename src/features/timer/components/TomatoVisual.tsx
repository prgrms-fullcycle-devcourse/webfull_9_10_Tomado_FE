import { useEffect, useState } from 'react';

import type { HTMLAttributes } from 'react';

export interface TomatoVisualProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    animate?: boolean;
    progress?: number;
}

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(' ');
};

const tomatoStages = [
    {
        body: 'var(--color-green-500)',
        shadow: 'var(--color-green-600)',
        highlight: 'var(--color-green-300)',
    },
    {
        body: 'var(--color-green-400)',
        shadow: 'var(--color-green-500)',
        highlight: 'var(--color-green-200)',
    },
    {
        body: 'var(--color-yellow-300)',
        shadow: 'var(--color-yellow-400)',
        highlight: 'var(--color-yellow-100)',
    },
    {
        body: 'var(--color-yellow-400)',
        shadow: 'var(--color-yellow-500)',
        highlight: 'var(--color-yellow-200)',
    },
    {
        body: 'var(--color-tomato-300)',
        shadow: 'var(--color-tomato-400)',
        highlight: 'var(--color-tomato-100)',
    },
    {
        body: 'var(--color-tomato-400)',
        shadow: 'var(--color-tomato-500)',
        highlight: 'var(--color-tomato-200)',
    },
    {
        body: 'var(--color-tomato-500)',
        shadow: 'var(--color-tomato-600)',
        highlight: 'var(--color-tomato-300)',
    },
] as const;

const leafColor = 'var(--color-green-600)';
const stemColor = 'var(--color-green-600)';
const fillTransitionStyle = { transition: 'fill 1800ms ease-in-out' } as const;

export const TomatoVisual = ({ size = 320, animate = true, progress, className, ...props }: TomatoVisualProps) => {
    const [stageIndex, setStageIndex] = useState(0);
    const hasExternalProgress = typeof progress === 'number';
    const normalizedProgress = hasExternalProgress ? Math.min(1, Math.max(0, progress)) : 0;
    const progressStageIndex = Math.min(tomatoStages.length - 1, Math.floor(normalizedProgress * tomatoStages.length));
    const currentStage = tomatoStages[hasExternalProgress ? progressStageIndex : stageIndex];

    useEffect(() => {
        if (!animate || hasExternalProgress) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setStageIndex((prev) => (prev + 1) % tomatoStages.length);
        }, 3000);

        return () => window.clearTimeout(timeoutId);
    }, [animate, hasExternalProgress, stageIndex]);

    return (
        <div
            {...props}
            className={cx('inline-flex items-center justify-center', className)}
            style={{ width: size, height: size }}
        >
            <svg fill='none' viewBox='180 180 440 430' width={size} height={size} aria-hidden='true'>
                {/* 몸통 */}
                <path
                    d='M536.114,328.243c-26.654-30.561-72.744-44.283-111.186-30.128c-8.148,3-41.707,3-49.855,0
                    c-38.443-14.155-84.533-0.432-111.187,30.128c-31.652,36.293-41.517,84.832-34.751,130.583
                    c8.605,58.168,41.079,98.021,101.241,115.923c33.594,9.996,46.53,4.634,69.625,4.634c23.094,0,36.03,5.362,69.624-4.634
                    c60.162-17.902,92.636-57.755,101.241-115.923C577.631,413.075,567.767,364.536,536.114,328.243z'
                    fill={currentStage.body}
                    style={fillTransitionStyle}
                />

                {/* 광택 */}
                <circle
                    cx='314.372'
                    cy='376.423'
                    r='34.016'
                    fill={currentStage.highlight}
                    fillOpacity='0.65'
                    style={fillTransitionStyle}
                />

                {/* 그림자 */}
                <path
                    d='M536.114,328.243c-26.654-30.561-72.744-44.283-111.186-30.128c-8.148,3-41.707,3-49.855,0
                    c-12.652-4.659-26.129-6.242-39.473-5.255c21.936,4.773,22.698,32.555,91.459,27.456c63.897-4.738,111.075,90.124,74.72,168.236
                    c-22.58,48.517-99.653,81.35-200.825,74.567c8.962,4.545,18.734,8.452,29.422,11.632c33.594,9.996,46.53,4.634,69.624,4.634
                    s36.029,5.362,69.624-4.634c60.161-17.902,92.635-57.755,101.24-115.924C577.631,413.075,567.767,364.536,536.114,328.243z'
                    fill={currentStage.shadow}
                    fillOpacity='0.18'
                    style={fillTransitionStyle}
                />

                {/* 토마토 잎 */}
                <path
                    d='M398.754,283.553c-6.342-15.999-22.062-25.66-39.187-27.372c8.24,7.94,14.25,14.705,17.021,28.559
                    c-8.983-5.049-33.25-8.708-46.568,0.79c17.725,1.989,27.552,5.951,37.86,17.814c0,0-7.216,6.683-8.708,14.052
                    c-1.064,5.256,0.539,17.3,0.539,17.3c10.939-15.519,37.064-7.602,38.252-23.831c0,0,26.916,5.146,37.208,23.75
                    c1.979-24.542-9.896-28.896-9.896-28.896c11.347-8.18,32.59-2.375,44.706,1.386c-7.894-11.666-25.233-21.584-41.058-19.449
                    c6.358-11.542,17.663-18.019,30.777-19.306C439.872,261.53,411.712,261.824,398.754,283.553L398.754,283.553z'
                    fill={stemColor}
                />

                {/* 토마토 꼭지 */}
                <path
                    d='M411.78,219.196c-21.458,16.95-19.139,58.159-16.605,77.868c1.548,0.771,3.467,0.949,5.611-0.422
                    c0.066-11.942,0.964-30.534,5.399-42.986c6.388-17.938,16.462-23.344,16.462-23.344
                    C422.647,218.273,411.78,219.196,411.78,219.196z'
                    fill={leafColor}
                />
            </svg>
        </div>
    );
};
