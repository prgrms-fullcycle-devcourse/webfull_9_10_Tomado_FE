import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Icon } from '@@/ui';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const pageClassName = 'w-full bg-neutral-subtle';
const layoutClassName = 'flex flex-col gap-28 pb-32';

const heroClassName =
    'grid items-start gap-14 bg-transparent lg:grid-cols-[minmax(0,1fr)_560px] lg:pt-20 max-w-[1200px] mx-auto';
const heroTitleClassName = 'text-5xl leading-[1.08] font-bold tracking-[-0.03em] text-[#111827] lg:text-6xl';
const heroDescriptionClassName = 'text-xl text-neutral-darker';
const heroActionsClassName = 'flex flex-wrap items-center gap-3';
const demoInputWrapperClassName = 'flex items-center gap-3 rounded-xl border border-[#d7e2f1] bg-[#f7faff] px-4 py-3';
const demoInputClassName = 'w-full bg-transparent text-sm text-gray-700 placeholder:text-neutral focus:outline-none';
const demoShortcutClassName =
    'inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#c6d4e8] bg-white px-2 text-xs font-medium text-[#53627c]';

const sectionClassName = 'flex flex-col gap-5 max-w-[1200px] mx-auto';
const sectionEyebrowClassName = 'text-sm font-semibold tracking-[0.16em] text-[#6b7c99] uppercase';
const sectionTitleClassName = 'text-4xl leading-tight font-bold lg:text-5xl';
const sectionBodyClassName = 'max-w-[68ch] text-lg leading-8 text-neutral-darker';

const showcaseGridClassName = 'grid gap-6 lg:grid-cols-2 max-w-[1200px] mx-auto';
const showcaseCardClassName =
    'overflow-hidden rounded-[36px] border border-[#d7e2f1] bg-white shadow-[0_24px_48px_rgba(87,112,153,0.08)]';
const showcaseContentClassName = 'flex flex-col gap-8 p-8';
const showcaseTitleClassName = 'text-[28px] leading-tight font-bold text-[#111827]';
const showcaseDescriptionClassName = 'text-base leading-7 text-[#53627c]';

const featureListClassName = 'grid gap-4 lg:grid-cols-3 max-w-[1200px] mx-auto';
const featureCardClassName =
    'rounded-[30px] border border-[#d7e2f1] bg-white p-7 shadow-[0_18px_36px_rgba(87,112,153,0.06)]';
const featureIconClassName =
    'mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-[#f7faff] text-primary';
const featureTitleClassName = 'text-xl font-bold text-[#111827]';
const featureTextClassName = 'mt-2 text-sm leading-7 text-[#53627c]';

const comparisonClassName = 'grid gap-4 lg:grid-cols-3';
const comparisonCardClassName = 'rounded-[30px] border border-[#d7e2f1] bg-white p-7';
const comparisonLabelClassName = 'text-sm font-semibold tracking-[0.16em] text-[#6b7c99] uppercase';
const comparisonTitleClassName = 'mt-3 text-2xl font-bold text-[#111827]';
const comparisonTextClassName = 'mt-3 text-sm leading-7 text-[#53627c]';

const ctaClassName =
    'rounded-[40px] border border-[#d7e2f1] bg-white px-8 py-10 text-[#111827] shadow-[0_24px_48px_rgba(87,112,153,0.08)] max-w-[1200px] mx-auto w-full';
const ctaTitleClassName = 'max-w-[12ch] text-4xl leading-tight font-bold lg:text-5xl';
const ctaBodyClassName = 'mt-4 max-w-[56ch] text-base leading-7 text-[#53627c]';

const featureItems = [
    {
        icon: 'pomodoro',
        title: '지금 바로 집중 시작',
        text: '세션과 세트를 따라 포모도로를 이어가며, 하던 흐름을 끊지 않고 바로 다음 집중으로 넘어갈 수 있습니다.',
    },
    {
        icon: 'edit',
        title: '한 번에 같이 남기기',
        text: '할 일, 데일리로그, 회고를 따로 옮기지 말고 같은 날짜에 이어서 적어보세요.',
    },
    {
        icon: 'tree',
        title: '다시 볼수록 선명해짐',
        text: '캘린더와 히트맵으로 언제 집중이 잘 됐고 무엇을 남겼는지 빠르게 돌아볼 수 있습니다.',
    },
] as const;

const problemItems = [
    {
        label: '끊기는 순간 01',
        title: '할 일과 기록이 자꾸 따로 놉니다',
        text: '할 일은 체크했는데 기록은 안 남고, 기록은 남겼는데 맥락이 빠지면 하루 전체가 끊겨 보입니다.',
    },
    {
        label: '끊기는 순간 02',
        title: '집중한 시간만 남고 결과는 흐려집니다',
        text: '타이머를 오래 돌려도 어떤 일을 끝냈는지 바로 이어지지 않으면 집중 데이터는 금방 의미를 잃습니다.',
    },
    {
        label: '끊기는 순간 03',
        title: '나중에 다시 볼수록 찾기 어려워집니다',
        text: '그날 한 일과 회고가 흩어져 있으면 패턴도 놓치고, 같은 비효율도 다시 반복하게 됩니다.',
    },
] as const;

const statItems = [
    { value: '25:00', label: '포모도로 타이머' },
    { value: '1/3', label: '완료된 오늘의 투두' },
    { value: '365', label: '히스토리를 남기는 캘린더' },
] as const;

const timelineItems = ['집중', '휴식', '장휴식'] as const;
const landingFlowSteps = ['포모도로', '데일리로그', '회고'] as const;
const LANDING_FLOW_STEP_DURATION_MS = 1800;
const LANDING_FLOW_TOTAL_DURATION_MS = landingFlowSteps.length * LANDING_FLOW_STEP_DURATION_MS;

export default function Landing() {
    const navigate = useNavigate();
    const [demoSeconds, setDemoSeconds] = useState(25 * 60);
    const [landingTabSeconds, setLandingTabSeconds] = useState(84);
    const [isDemoRunning, setIsDemoRunning] = useState(false);
    const [demoTodoInput, setDemoTodoInput] = useState('');
    const [currentFlowStep, setCurrentFlowStep] = useState(0);
    const [demoTodos, setDemoTodos] = useState([
        { id: 1, label: '오전 강의 3개 듣기', checked: true },
        { id: 2, label: 'API 명세서 정리', checked: false },
        { id: 3, label: '회고 초안 작성', checked: false },
    ]);

    useEffect(() => {
        if (!isDemoRunning) {
            return;
        }

        const timerId = window.setInterval(() => {
            setDemoSeconds((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timerId);
                    setIsDemoRunning(false);
                    return 25 * 60;
                }

                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [isDemoRunning]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentFlowStep((prev) => (prev + 1) % landingFlowSteps.length);
        }, LANDING_FLOW_STEP_DURATION_MS);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setLandingTabSeconds((prev) => (prev <= 53 ? 84 : prev - 1));
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    const completedTodoCount = useMemo(() => demoTodos.filter((todo) => todo.checked).length, [demoTodos]);
    const demoMinutes = String(Math.floor(demoSeconds / 60)).padStart(2, '0');
    const demoDisplaySeconds = String(demoSeconds % 60).padStart(2, '0');
    const landingTabMinutes = String(Math.floor(landingTabSeconds / 60)).padStart(2, '0');
    const landingTabDisplaySeconds = String(landingTabSeconds % 60).padStart(2, '0');
    const timerProgressRatio = demoSeconds / (25 * 60);
    const sessionFilledCount = Math.min(completedTodoCount, 4);
    const normalizedFlowStep = currentFlowStep % landingFlowSteps.length;
    const activeLandingTabTitle = landingFlowSteps[normalizedFlowStep];

    const handleToggleDemoTimer = () => {
        setIsDemoRunning((prev) => !prev);
    };

    const handleResetDemoTimer = () => {
        setIsDemoRunning(false);
        setDemoSeconds(25 * 60);
    };

    const handleAddDemoTodo = () => {
        const nextLabel = demoTodoInput.trim();

        if (!nextLabel) {
            return;
        }

        setDemoTodos((prev) => [
            ...prev,
            {
                id: Date.now(),
                label: nextLabel,
                checked: false,
            },
        ]);
        setDemoTodoInput('');
    };

    const handleToggleDemoTodo = (id: number) => {
        setDemoTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo)));
    };

    return (
        <main className={pageClassName}>
            <div className={layoutClassName}>
                <section className={heroClassName}>
                    <div className='flex flex-col gap-8 pt-6 lg:pt-10'>
                        <div className='flex flex-col gap-5'>
                            <h1 className={heroTitleClassName}>
                                할 일 적고,
                                <br />
                                포모도로 시작하기
                            </h1>
                            {/* <h2 className='text-5xl'>
                                기억에 대신, 기록으로
                            </h2> */}
                            <p className={heroDescriptionClassName}>
                                해야 할 일과 집중 시간을 한 화면에서 함께 보면서,
                                <br />
                                지금 할 일에만 몰입해보세요.
                            </p>
                        </div>

                        <div className={heroActionsClassName}>
                            <Button onClick={() => navigate('/signup')} size='lg'>
                                지금 바로 시작하기
                            </Button>
                        </div>
                    </div>
                    {/* window slide animation */}
                    <div className='overflow-hidden rounded-[44px] bg-white shadow-[0_24px_48px_rgba(87,112,153,0.08)] lg:-translate-y-2'>
                        <div className='relative h-[74px] overflow-hidden bg-neutral-darker'>
                            <div className='absolute inset-x-0 bottom-0 h-1'>
                                <div
                                    className='landing-main-progress h-full w-full bg-primary'
                                    style={{ animationDuration: `${LANDING_FLOW_TOTAL_DURATION_MS}ms` }}
                                />
                            </div>

                            {/* window tab bar */}
                            <div className='pt-1'>
                                <div className='flex items-start gap-0 px-0'>
                                    <div className='bg-neutral-lighter'>
                                        <div className='flex h-[60px] items-center gap-3 rounded-br-[22px] bg-neutral-darker px-6'>
                                            <span className='size-4 rounded-full bg-[#ff5f57]' />
                                            <span className='size-4 rounded-full bg-[#febc2e]' />
                                            <span className='size-4 rounded-full bg-[#28c840]' />
                                        </div>
                                    </div>

                                    <div className='flex min-w-0 items-start gap-[2px] overflow-hidden'>
                                        <div className='flex h-[60px] min-w-[300px] items-center gap-4 rounded-t-[20px] bg-neutral-lighter px-6'>
                                            <Icon color='color-primary' name='pomodoro' size={18} />
                                            <span className='text-[18px] leading-none font-semibold'>
                                                {landingTabMinutes}:{landingTabDisplaySeconds}
                                            </span>
                                            <span className='truncate text-[17px] font-medium'>
                                                {activeLandingTabTitle}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='bg-neutral-lighter'>
                                        <div className='flex h-[60px] items-center gap-3 rounded-bl-[22px] bg-neutral-darker px-6' />
                                    </div>
                                </div>
                                <hr className='bg-neutral-lighter h-[12px] border-none' />
                            </div>
                        </div>

                        <div className='relative min-h-[300px] overflow-hidden bg-[#fbfdff] p-6'>
                            <div
                                className={cx(
                                    'absolute inset-0 grid gap-4 p-6 transition-all duration-500 ease-in-out',
                                    normalizedFlowStep === 0
                                        ? 'translate-y-0 opacity-100'
                                        : '-translate-y-4 opacity-0 pointer-events-none'
                                )}
                            >
                                <div className='grid gap-4 sm:grid-cols-[1.1fr_0.9fr]'>
                                    <div className='rounded-[30px] border border-[#dfe8f4] bg-white p-5 shadow-[0_16px_30px_rgba(87,112,153,0.06)]'>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <strong className='text-xl font-bold text-[#111827]'>TODAY</strong>
                                            <span className='rounded-full bg-[#667891] px-3 py-1 text-xs text-white'>
                                                0set
                                            </span>
                                        </div>
                                        <div className='flex flex-col items-center gap-4 py-3'>
                                            <div className='flex items-center gap-3'>
                                                {timelineItems.map((item, index) => (
                                                    <div className='flex flex-col items-center gap-2' key={item}>
                                                        <span
                                                            className={cx(
                                                                'size-5 rounded-md border-2 border-neutral',
                                                                index === 0 && 'border-primary bg-primary'
                                                            )}
                                                        />
                                                        <span className='text-[11px] font-semibold text-[#42526b]'>
                                                            {item}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='size-24 rounded-full bg-primary shadow-[inset_0_-14px_0_rgba(0,0,0,0.05)]' />
                                            <strong className='text-5xl leading-none font-bold text-black'>
                                                24:00
                                            </strong>
                                        </div>
                                    </div>

                                    <div className='rounded-[30px] border border-[#dfe8f4] bg-white p-5 shadow-[0_16px_30px_rgba(87,112,153,0.06)]'>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <strong className='text-xl font-bold text-[#111827]'>TODO</strong>
                                            <span className='rounded-full bg-[#667891] px-3 py-1 text-xs text-white'>
                                                1/3
                                            </span>
                                        </div>
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-3 rounded-xl border border-[#d7e2f1] bg-[#f7faff] px-4 py-3'>
                                                <Icon color='color-neutral-darker' name='add' size={16} />
                                                <span className='text-sm text-neutral'>할 일을 추가해보세요</span>
                                                <span className='ml-auto inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#c6d4e8] bg-white px-2 text-xs font-medium text-[#53627c]'>
                                                    T
                                                </span>
                                            </div>
                                            {['오전 강의 3개 듣기', 'API 명세서 정리', '회고 초안 작성'].map(
                                                (item, index) => (
                                                    <div
                                                        className='flex items-center gap-3 rounded-xl border border-[#e3ebf6] bg-[#fbfdff] px-4 py-3'
                                                        key={item}
                                                    >
                                                        <Icon color='color-neutral' name='drag_indicator' size={16} />
                                                        <Icon
                                                            color={
                                                                index === 0 ? 'color-primary' : 'color-neutral-subtle'
                                                            }
                                                            name={index === 0 ? 'checked' : 'unchecked'}
                                                            size={22}
                                                        />
                                                        <span
                                                            className={cx(
                                                                'text-sm',
                                                                index === 0
                                                                    ? 'text-neutral line-through'
                                                                    : 'text-gray-700'
                                                            )}
                                                        >
                                                            {item}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={cx(
                                    'absolute inset-0 flex flex-col gap-4 p-6 transition-all duration-500 ease-in-out',
                                    normalizedFlowStep === 1
                                        ? 'translate-y-0 opacity-100'
                                        : '-translate-y-4 opacity-0 pointer-events-none'
                                )}
                            >
                                <div className='rounded-[30px] border border-[#dfe8f4] bg-white p-6 shadow-[0_16px_30px_rgba(87,112,153,0.06)]'>
                                    <div className='flex items-center justify-between'>
                                        <strong className='text-2xl font-bold text-[#111827]'>데일리로그</strong>
                                        <Icon color='color-neutral-darker' name='arrow_right' size={20} />
                                    </div>
                                    <div className='mt-6 space-y-3'>
                                        <p className='text-base font-semibold text-[#334155]'>오늘 한 일</p>
                                        <p className='text-sm leading-7 text-[#63748f]'>
                                            API 명세서 작성 완료
                                            <br />
                                            ERD 리뷰 및 수정 포인트 정리
                                            <br />
                                            대시보드 데이터 설계 마무리
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={cx(
                                    'absolute inset-0 flex flex-col gap-4 p-6 transition-all duration-500 ease-in-out',
                                    normalizedFlowStep === 2
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-4 opacity-0 pointer-events-none'
                                )}
                            >
                                <div className='rounded-[30px] border border-[#dfe8f4] bg-white p-6 shadow-[0_16px_30px_rgba(87,112,153,0.06)]'>
                                    <div className='flex items-center justify-between'>
                                        <strong className='text-2xl font-bold text-[#111827]'>회고</strong>
                                        <Icon color='color-neutral-darker' name='arrow_right' size={20} />
                                    </div>
                                    <div className='mt-5 flex flex-wrap gap-2'>
                                        {['기술', '결정', '소통', '감정'].map((tag) => (
                                            <span
                                                className='rounded-full border border-[#c6d4e8] bg-white px-3 py-1 text-sm text-[#53627c]'
                                                key={tag}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className='mt-5 text-sm leading-7 text-[#63748f]'>
                                        오늘은 기술 선택 기준을 더 분명히 잡았고, 다음엔 회고 작성 흐름을 더 짧게 만들
                                        계획입니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='flex flex-col items-center gap-10 bg-neutral-lighter w-full py-30 text-center'>
                    <div className={sectionClassName}>
                        <h2 className={sectionTitleClassName}>
                            불필요한 작업 전환은
                            <br />
                            집중을 흐트러뜨립니다.
                        </h2>
                        <p className={sectionBodyClassName}>
                            토마두는 해야 할 일과 타이머를 한 화면에 두고,
                            <br />
                            지금 할 일에만 더 오래 머물 수 있게 돕습니다.
                        </p>
                    </div>

                    <div className='relative flex rounded-[40px] p-6 gap-4'>
                        <div className='rounded-[34px] border border-[#d7e2f1] bg-white p-6'>
                            <div className='flex items-start justify-between gap-4'>
                                <div>
                                    <p className='text-sm font-semibold tracking-[0.16em] text-primary uppercase'>
                                        Today
                                    </p>
                                    <h2 className='mt-3 text-3xl font-bold text-black'>25분 집중 세션</h2>
                                </div>
                                <span className='rounded-full bg-[#667891] px-3 py-1 text-sm text-white'>0set</span>
                            </div>

                            <div className='flex flex-col items-center gap-6'>
                                <div className='flex items-center gap-3'>
                                    {timelineItems.map((item, index) => (
                                        <div className='flex flex-col items-center gap-2' key={item}>
                                            <span
                                                className={cx(
                                                    'size-6 rounded-lg border-2 border-neutral',
                                                    index < sessionFilledCount && 'border-primary bg-primary'
                                                )}
                                            />
                                            <span
                                                className={cx(
                                                    'text-sm font-semibold text-neutral',
                                                    index === 0 && 'text-[#42526b]'
                                                )}
                                            >
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className='size-44 rounded-full bg-primary shadow-[inset_0_-18px_0_rgba(0,0,0,0.05)] transition-transform duration-300'
                                    style={{ transform: `scale(${0.9 + timerProgressRatio * 0.1})` }}
                                />
                                <strong className='text-6xl leading-none font-bold text-black'>
                                    {demoMinutes}:{demoDisplaySeconds}
                                </strong>

                                <div className='flex items-center gap-4'>
                                    <Button
                                        icon={<Icon name={isDemoRunning ? 'pause' : 'play'} />}
                                        iconOnly
                                        onClick={handleToggleDemoTimer}
                                        size='lg'
                                    >
                                        재생
                                    </Button>
                                    <Button
                                        disabled={!isDemoRunning && demoSeconds === 25 * 60}
                                        icon={<Icon color='white' name='stop' />}
                                        iconOnly
                                        onClick={handleResetDemoTimer}
                                        size='lg'
                                    >
                                        정지
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-[28px] border border-[#d7e2f1] bg-white p-5 shadow-[0_18px_36px_rgba(87,112,153,0.08)]'>
                            <div className='mb-4 flex items-center justify-between'>
                                <h3 className='text-2xl font-bold text-black'>TODO</h3>
                                <span className='rounded-full bg-[#667891] px-3 py-1 text-sm text-white'>
                                    {completedTodoCount}/{demoTodos.length}
                                </span>
                            </div>
                            <div className='space-y-3'>
                                <div className={demoInputWrapperClassName}>
                                    <Icon color='color-neutral-darker' name='add' size={16} />
                                    <input
                                        className={demoInputClassName}
                                        onChange={(event) => setDemoTodoInput(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleAddDemoTodo();
                                            }
                                        }}
                                        placeholder='할 일을 추가해보세요'
                                        value={demoTodoInput}
                                    />
                                    <span className={demoShortcutClassName}>T</span>
                                </div>

                                {demoTodos.map((item) => (
                                    <div
                                        className='flex items-center gap-3 rounded-xl border border-[#e3ebf6] bg-[#fbfdff] px-4 py-3'
                                        key={item.id}
                                    >
                                        <Icon color='color-neutral' name='drag_indicator' size={16} />
                                        <button onClick={() => handleToggleDemoTodo(item.id)} type='button'>
                                            <Icon
                                                color={item.checked ? 'color-primary' : 'color-neutral-subtle'}
                                                name={item.checked ? 'checked' : 'unchecked'}
                                                size={24}
                                            />
                                        </button>
                                        <span
                                            className={cx(
                                                'text-sm',
                                                item.checked ? 'text-neutral line-through' : 'text-gray-700'
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={showcaseGridClassName}>
                    <article className={showcaseCardClassName}>
                        <div className={showcaseContentClassName}>
                            <div>
                                <p className={sectionEyebrowClassName}>지금 집중할 때</p>
                                <h3 className={showcaseTitleClassName}>할 일을 적고, 바로 이번 세션을 시작하세요</h3>
                                <p className={showcaseDescriptionClassName}>
                                    무엇에 집중할지 적어두고 타이머를 켜보세요. 진행 중인 일과 집중 상태가 같은 화면에서
                                    이어져서, 끝나고 나서도 왜 이 시간에 몰입했는지 놓치지 않습니다.
                                </p>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-3'>
                                {statItems.map((item) => (
                                    <div
                                        className='rounded-2xl border border-[#dfe8f4] bg-[#f7faff] px-5 py-4'
                                        key={item.label}
                                    >
                                        <strong className='text-3xl font-bold text-[#334155]'>{item.value}</strong>
                                        <p className='mt-2 text-sm text-[#63748f]'>{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    <article className={showcaseCardClassName}>
                        <div className={showcaseContentClassName}>
                            <div>
                                <p className={sectionEyebrowClassName}>끝나고 나면</p>
                                <h3 className={showcaseTitleClassName}>오늘 한 일과 생각을 같은 날짜에 남기세요</h3>
                                <p className={showcaseDescriptionClassName}>
                                    작업이 끝나면 데일리로그와 회고까지 바로 이어서 적어보세요. 그날 한 일, 남긴 판단,
                                    다음 액션이 한 날짜에 쌓여서 나중에 다시 보기 쉬워집니다.
                                </p>
                            </div>

                            <div className='grid gap-3'>
                                <div className='rounded-2xl border border-[#dfe8f4] bg-[#fbfdff] px-5 py-4'>
                                    <div className='flex items-center justify-between'>
                                        <strong className='text-xl font-bold text-black'>데일리로그</strong>
                                        <Icon color='color-neutral-darker' name='arrow_right' size={20} />
                                    </div>
                                    <p className='mt-4 text-base text-[#334155]'>오늘 한 일</p>
                                    <p className='mt-3 text-sm leading-7 text-[#63748f]'>
                                        API 명세서 정리 완료, ERD 리뷰, 대시보드 데이터 설계 방향 정리
                                    </p>
                                </div>
                                <div className='rounded-2xl border border-[#dfe8f4] bg-[#fbfdff] px-5 py-4'>
                                    <div className='flex items-center justify-between'>
                                        <strong className='text-xl font-bold text-black'>회고</strong>
                                        <Icon color='color-neutral-darker' name='arrow_right' size={20} />
                                    </div>
                                    <div className='mt-4 flex flex-wrap gap-2'>
                                        {['기술', '결정', '소통', '감정'].map((tag) => (
                                            <span
                                                className='rounded-full border border-[#c6d4e8] bg-white px-3 py-1 text-sm text-[#53627c]'
                                                key={tag}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <section className={featureListClassName}>
                    {featureItems.map((item) => (
                        <article className={featureCardClassName} key={item.title}>
                            <span className={featureIconClassName}>
                                <Icon color='color-primary' name={item.icon} size={24} />
                            </span>
                            <h3 className={featureTitleClassName}>{item.title}</h3>
                            <p className={featureTextClassName}>{item.text}</p>
                        </article>
                    ))}
                </section>

                <section className={sectionClassName}>
                    <p className={sectionEyebrowClassName}>왜 이렇게 쓰냐면</p>
                    <h2 className={sectionTitleClassName}>타이머만 돌리고 끝내면, 오늘 한 일이 남지 않기 때문입니다</h2>
                    <div className={comparisonClassName}>
                        {problemItems.map((item) => (
                            <article className={comparisonCardClassName} key={item.title}>
                                <p className={comparisonLabelClassName}>{item.label}</p>
                                <h3 className={comparisonTitleClassName}>{item.title}</h3>
                                <p className={comparisonTextClassName}>{item.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={ctaClassName}>
                    <h2 className={ctaTitleClassName}>오늘 할 일을 적고, 첫 세션부터 시작하세요</h2>
                    <p className={ctaBodyClassName}>
                        집중만 하고 끝내지 말고, 오늘 한 일까지 남겨보세요. TOMADO가 할 일, 기록, 회고를 한 흐름으로
                        이어줍니다.
                    </p>
                    <div className='mt-8 flex flex-wrap gap-3'>
                        <Button onClick={() => navigate('/signup')} size='lg'>
                            무료로 시작하기
                        </Button>
                        <Button onClick={() => navigate('/login')} size='lg' variant='outline'>
                            로그인
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
