import { useEffect, useRef } from 'react';
import type { ITimerMetadataOptions } from '@@@/timer';

const DEFAULT_FAVICON_HREF = '/favicon.svg';

const FIRE_FAVICON = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.55467 14.534C10.6387 14.1167 13.3333 12.6174 13.3333 8.7407C13.3333 5.21337 10.7513 2.86404 8.89467 1.7847C8.482 1.5447 8 1.86004 8 2.3367V3.55537C8 4.5167 7.596 6.27137 6.47333 7.00137C5.9 7.37404 5.28 6.81604 5.21067 6.13604L5.15333 5.57737C5.08667 4.92804 4.42533 4.53404 3.90667 4.93004C2.974 5.64004 2 6.8867 2 8.74004C2 13.4807 5.526 14.6667 7.28867 14.6667C7.39178 14.6667 7.49933 14.6634 7.61133 14.6567C7.90867 14.6194 7.61133 14.7227 8.55467 14.5334" fill="#D04030"/>
<path d="M5.33325 12.296C5.33325 14.0426 6.74059 14.5826 7.61125 14.6573C7.90859 14.62 7.61125 14.7233 8.55458 14.534C9.24725 14.2893 9.99992 13.6613 9.99992 12.296C9.99992 11.4313 9.45392 10.8973 9.02659 10.6473C8.89592 10.5706 8.74392 10.6673 8.73258 10.818C8.69525 11.2966 8.23525 11.678 7.92259 11.314C7.64592 10.9926 7.52925 10.5226 7.52925 10.222V9.82862C7.52925 9.59262 7.29125 9.43529 7.08725 9.55662C6.32992 10.0053 5.33325 10.9293 5.33325 12.296Z" fill="#E5D4B5"/>
</svg>
`)}`;

const TREE_FAVICON = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.71209 4.09522C10.2387 3.87706 10.807 3.77761 11.3764 3.80395C11.9459 3.83029 12.5025 3.98176 13.0068 4.2476C13.511 4.51344 13.9505 4.88712 14.294 5.34206C14.6375 5.797 14.8765 6.32203 14.9941 6.87982H13.0741L12.1941 5.99982L11.3137 6.88002H8.95509C8.8261 6.30951 8.65933 5.7482 8.45589 5.19982H8.21289C8.61555 4.71537 9.1301 4.33626 9.71209 4.09522Z" fill="#527B60"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.12445 6.93187C7.27707 9.23233 6.82024 11.5324 5.80005 13.5999H8.72365C9.51855 10.9477 9.46176 8.11306 8.56125 5.49487L7.12445 6.93187Z" fill="#C09A58"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.282 2.69531C5.75535 2.47715 5.18711 2.37771 4.61767 2.40405C4.04824 2.43038 3.4916 2.58186 2.98733 2.8477C2.48307 3.11354 2.04357 3.48721 1.70009 3.94216C1.35661 4.3971 1.11758 4.92213 1 5.47991H2.9198L3.8 4.59991L4.5476 5.34751C5.06154 5.0548 5.63557 4.88338 6.22587 4.84636C6.81617 4.80935 7.40712 4.9077 7.9536 5.13391C8.1748 5.22558 8.38704 5.33752 8.5876 5.46831L8.5758 5.48031H8.5938C8.46381 4.86315 8.18532 4.28697 7.78246 3.80169C7.3796 3.31641 6.86471 2.93666 6.282 2.69531Z" fill="#527B60"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.88372 7.23386C3.10183 6.70717 3.43332 6.23502 3.85461 5.85098C4.2759 5.46694 4.77663 5.18045 5.3212 5.01188C5.86577 4.84332 6.44079 4.79682 7.00537 4.8757C7.56995 4.95458 8.11021 5.1569 8.58772 5.46826L5.82032 8.23566H4.57552V9.48046L3.21792 10.8379C2.87347 10.3095 2.663 9.70523 2.60473 9.07724C2.54646 8.44925 2.64236 7.81653 2.88372 7.23386Z" fill="#527B60"/>
</svg>
`)}`;

// INFO: favicon link는 매번 새로 만들지 않고 기존 태그를 재사용합니다.
const getOrCreateFaviconLink = () => {
    let faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");

    if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
    }

    return faviconLink;
};

export const useTimerMetadata = ({ isRunning, sessionType, minutes, seconds }: ITimerMetadataOptions) => {
    const initialTitleRef = useRef<string | null>(null);
    const initialFaviconRef = useRef<string | null>(null);

    useEffect(() => {
        if (initialTitleRef.current === null) {
            initialTitleRef.current = document.title;
        }

        if (initialFaviconRef.current === null) {
            const faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
            initialFaviconRef.current = faviconLink?.href ?? DEFAULT_FAVICON_HREF;
        }
    }, []);

    useEffect(() => {
        const faviconLink = getOrCreateFaviconLink();

        if (!isRunning) {
            document.title = initialTitleRef.current ?? 'tomado';
            faviconLink.href = initialFaviconRef.current ?? DEFAULT_FAVICON_HREF;

            return;
        }

        document.title = `${minutes}:${seconds}`;
        faviconLink.href = sessionType === 'focus' ? FIRE_FAVICON : TREE_FAVICON;
    }, [isRunning, minutes, seconds, sessionType]);
};
