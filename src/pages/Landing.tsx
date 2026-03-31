import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from '@@/layout';
import { Button, Icon } from '@@/ui';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const pageClassName = 'w-full bg-[#f4f7fd]';
const layoutClassName = 'flex flex-col gap-28 pb-32';

const heroClassName =
    'grid items-center gap-14 rounded-[48px] border border-[#d7e2f1] bg-white px-8 py-10 shadow-[0_28px_60px_rgba(87,112,153,0.08)] lg:grid-cols-[minmax(0,1fr)_560px] lg:px-16 lg:py-18';
const heroEyebrowClassName = 'text-sm font-semibold tracking-[0.18em] text-[#6b7c99] uppercase';
const heroTitleClassName = 'max-w-[10ch] text-5xl leading-[1.02] font-bold text-[#111827] lg:text-7xl';
const heroDescriptionClassName = 'max-w-[58ch] text-lg leading-8 text-[#53627c]';
const heroActionsClassName = 'flex flex-wrap items-center gap-3';
const heroMetaRowClassName = 'flex flex-wrap items-center gap-3 text-sm text-[#63748f]';
const heroMetaBadgeClassName = 'rounded-full border border-[#d7e2f1] bg-[#f7faff] px-4 py-2';
const demoInputWrapperClassName = 'flex items-center gap-3 rounded-xl border border-[#d7e2f1] bg-[#f7faff] px-4 py-3';
const demoInputClassName = 'w-full bg-transparent text-sm text-gray-700 placeholder:text-neutral focus:outline-none';
const demoShortcutClassName =
    'inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#c6d4e8] bg-white px-2 text-xs font-medium text-[#53627c]';

const sectionClassName = 'flex flex-col gap-5';
const sectionEyebrowClassName = 'text-sm font-semibold tracking-[0.16em] text-[#6b7c99] uppercase';
const sectionTitleClassName = 'max-w-[16ch] text-4xl leading-tight font-bold text-[#111827] lg:text-5xl';
const sectionBodyClassName = 'max-w-[68ch] text-lg leading-8 text-[#53627c]';

const showcaseGridClassName = 'grid gap-6 lg:grid-cols-2';
const showcaseCardClassName =
    'overflow-hidden rounded-[36px] border border-[#d7e2f1] bg-white shadow-[0_24px_48px_rgba(87,112,153,0.08)]';
const showcaseContentClassName = 'flex flex-col gap-8 p-8';
const showcaseTitleClassName = 'text-[28px] leading-tight font-bold text-[#111827]';
const showcaseDescriptionClassName = 'text-base leading-7 text-[#53627c]';

const featureListClassName = 'grid gap-4 lg:grid-cols-3';
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
    'rounded-[40px] border border-[#d7e2f1] bg-white px-8 py-10 text-[#111827] shadow-[0_24px_48px_rgba(87,112,153,0.08)] lg:px-14 lg:py-14';
const ctaTitleClassName = 'max-w-[12ch] text-4xl leading-tight font-bold lg:text-5xl';
const ctaBodyClassName = 'mt-4 max-w-[56ch] text-base leading-7 text-[#53627c]';

const featureItems = [
    {
        icon: 'pomodoro',
        title: '집중이 남는 타이머',
        text: '세션과 세트를 기준으로 포모도로를 쌓고, 휴식 흐름까지 자연스럽게 이어집니다.',
    },
    {
        icon: 'edit',
        title: '날짜 기반 기록',
        text: '투두, 데일리로그, 회고를 같은 날짜 축에 얹어 하루를 통째로 관리할 수 있습니다.',
    },
    {
        icon: 'tree',
        title: '한눈에 보이는 패턴',
        text: '캘린더와 히트맵으로 언제 많이 집중했고 무엇을 남겼는지 빠르게 확인할 수 있습니다.',
    },
] as const;

const problemItems = [
    {
        label: 'Problem 01',
        title: '무엇을 했는지 흩어집니다',
        text: '할 일은 할 일 앱에, 기록은 노트에, 회고는 머릿속에 남으면 하루 전체 맥락을 잃기 쉽습니다.',
    },
    {
        label: 'Problem 02',
        title: '집중 시간이 결과와 연결되지 않습니다',
        text: '타이머를 써도 실제 어떤 작업에 시간을 썼는지 남지 않으면 집중 데이터는 금방 휘발됩니다.',
    },
    {
        label: 'Problem 03',
        title: '돌아보기가 어려워집니다',
        text: '과거 작업 이력과 회고가 분리되어 있으면 패턴을 읽기 어렵고 같은 비효율을 반복하게 됩니다.',
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
            <Container as='section'>
                <div className={layoutClassName}>
                    <section className={heroClassName}>
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col gap-5'>
                                <p className={heroEyebrowClassName}>Focus. Work. Log. Reflect.</p>
                                <h1 className={heroTitleClassName}>
                                    집중한 하루가
                                    <br />
                                    기록으로 남는
                                    <br />
                                    작업 공간
                                </h1>
                                <p className={heroDescriptionClassName}>
                                    TOMADO는 포모도로, 투두, 데일리로그, 회고, 대시보드를 하나의 흐름으로 묶습니다. 오늘
                                    무엇을 했고, 얼마나 집중했고, 무엇을 남겼는지 같은 화면에서 이어집니다.
                                </p>
                            </div>

                            <div className={heroActionsClassName}>
                                <Button onClick={() => navigate('/signup')} size='lg'>
                                    무료로 시작하기
                                </Button>
                                <Button onClick={() => navigate('/login')} size='lg' variant='outline'>
                                    로그인
                                </Button>
                            </div>

                            <div className={heroMetaRowClassName}>
                                <span className={heroMetaBadgeClassName}>개발자와 지식 근로자를 위한 집중 관리</span>
                                <span className={heroMetaBadgeClassName}>작업, 기록, 회고를 날짜 기준으로 통합</span>
                            </div>
                        </div>

                        <div className='relative rounded-[40px] border border-[#d7e2f1] bg-[#eef4fb] p-6 shadow-[0_28px_60px_rgba(87,112,153,0.1)]'>
                            <div className='rounded-[34px] border border-[#d7e2f1] bg-white p-6 shadow-[0_18px_40px_rgba(87,112,153,0.08)]'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div>
                                        <p className='text-sm font-semibold tracking-[0.16em] text-primary uppercase'>
                                            Today
                                        </p>
                                        <h2 className='mt-3 text-3xl font-bold text-black'>25분 집중 세션</h2>
                                    </div>
                                    <span className='rounded-full bg-[#667891] px-3 py-1 text-sm text-white'>0set</span>
                                </div>

                                <div className='mt-10 flex flex-col items-center gap-6'>
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

                            <div className='mt-5 rounded-[28px] border border-[#d7e2f1] bg-white p-5 shadow-[0_18px_36px_rgba(87,112,153,0.08)]'>
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

                    <section className='grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_500px]'>
                        <div className={sectionClassName}>
                            <p className={sectionEyebrowClassName}>One Flow</p>
                            <h2 className={sectionTitleClassName}>
                                집중, 작업, 기록, 회고를 따로 옮겨 다니지 않습니다
                            </h2>
                            <p className={sectionBodyClassName}>
                                TOMADO는 하루의 생산성을 잘게 쪼개지 않고, 하나의 연속된 경험으로 정리합니다. 타이머를
                                켜고, 할 일을 체크하고, 로그를 남기고, 회고를 기록한 뒤 다시 대시보드로 돌아와 흐름을
                                확인할 수 있습니다.
                            </p>
                        </div>

                        <div className='overflow-hidden rounded-[44px] border border-[#d7e2f1] bg-white shadow-[0_24px_48px_rgba(87,112,153,0.08)]'>
                            <div className='relative h-[90px] overflow-hidden border-b border-[#d7e2f1] bg-[#242424]'>
                                <div className='absolute inset-x-0 bottom-0 h-1 bg-[#dfe8f4]'>
                                    <div
                                        className='landing-main-progress h-full w-full bg-primary'
                                        style={{ animationDuration: `${LANDING_FLOW_TOTAL_DURATION_MS}ms` }}
                                    />
                                </div>

                                <div className='flex h-full items-start gap-0 px-0 pt-2'>
                                    <div className='flex h-[60px] min-w-[170px] items-center gap-3 rounded-br-[22px] bg-[#202020] px-6'>
                                        <span className='size-4 rounded-full bg-[#ff5f57]' />
                                        <span className='size-4 rounded-full bg-[#febc2e]' />
                                        <span className='size-4 rounded-full bg-[#28c840]' />
                                    </div>

                                    <div className='flex min-w-0 flex-1 items-start gap-[2px] overflow-hidden pl-2 pr-4'>
                                        <div className='flex h-[60px] min-w-[300px] items-center gap-4 rounded-t-[20px] bg-[#3a3a3a] px-6 text-white'>
                                            <Icon color='color-primary' name='pomodoro' size={18} />
                                            <span className='text-[18px] leading-none font-semibold'>
                                                {landingTabMinutes}:{landingTabDisplaySeconds}
                                            </span>
                                            <span className='truncate text-[17px] font-medium text-white/80'>
                                                {activeLandingTabTitle}
                                            </span>
                                        </div>
                                        <div
                                            className={cx(
                                                'flex h-[60px] min-w-[230px] items-center gap-3 rounded-t-[20px] px-6 text-[17px] font-medium transition-colors duration-300',
                                                normalizedFlowStep === 1
                                                    ? 'bg-[#3a3a3a] text-white'
                                                    : 'bg-[#2f2f2f] text-white/70'
                                            )}
                                        >
                                            <Icon color='white' name='edit' size={16} />
                                            데일리로그
                                            <Icon className='ml-auto' color='white' name='close' size={16} />
                                        </div>
                                        <div
                                            className={cx(
                                                'flex h-[60px] min-w-[170px] items-center gap-3 rounded-t-[20px] px-6 text-[17px] font-medium transition-colors duration-300',
                                                normalizedFlowStep === 2
                                                    ? 'bg-[#3a3a3a] text-white'
                                                    : 'bg-[#2f2f2f] text-white/70'
                                            )}
                                        >
                                            <Icon color='white' name='edit' size={16} />
                                            회고
                                            <Icon className='ml-auto' color='white' name='close' size={16} />
                                        </div>
                                    </div>
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
                                                            <Icon
                                                                color='color-neutral'
                                                                name='drag_indicator'
                                                                size={16}
                                                            />
                                                            <Icon
                                                                color={
                                                                    index === 0
                                                                        ? 'color-primary'
                                                                        : 'color-neutral-subtle'
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
                                            오늘은 기술 선택 기준을 더 분명히 잡았고, 다음엔 회고 작성 흐름을 더 짧게
                                            만들 계획입니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={showcaseGridClassName}>
                        <article className={showcaseCardClassName}>
                            <div className={showcaseContentClassName}>
                                <div>
                                    <p className={sectionEyebrowClassName}>Focus Layer</p>
                                    <h3 className={showcaseTitleClassName}>
                                        오늘 해야 할 일과 현재 세션을 같은 화면에 둡니다
                                    </h3>
                                    <p className={showcaseDescriptionClassName}>
                                        포모도로 세션을 시작하면 할 일과 집중 상태를 동시에 관리할 수 있습니다. 무엇을
                                        위해 집중했는지 나중에도 잃지 않도록 구조를 잡았습니다.
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
                                    <p className={sectionEyebrowClassName}>Review Layer</p>
                                    <h3 className={showcaseTitleClassName}>
                                        하루가 끝나면 기록과 회고가 같은 날짜 축에 남습니다
                                    </h3>
                                    <p className={showcaseDescriptionClassName}>
                                        데일리로그와 회고를 분리된 문서처럼 다루지 않습니다. 날짜별 작업과 함께 쌓아서,
                                        특정 날의 작업 이력과 생각을 한 번에 다시 볼 수 있습니다.
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
                        <p className={sectionEyebrowClassName}>Why It Exists</p>
                        <h2 className={sectionTitleClassName}>
                            기억에 의존하지 않고, 집중의 결과까지 남기기 위해 만들었습니다
                        </h2>
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
                        <h2 className={ctaTitleClassName}>오늘 한 일을 끝까지 남기는 습관을 시작하세요</h2>
                        <p className={ctaBodyClassName}>
                            TOMADO는 단순한 타이머가 아니라, 하루의 집중과 작업 결과를 연결해서 남기는 도구입니다. 지금
                            바로 시작해 보세요.
                        </p>
                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Button onClick={() => navigate('/signup')} size='lg'>
                                회원가입
                            </Button>
                            <Button onClick={() => navigate('/login')} size='lg' variant='outline'>
                                로그인
                            </Button>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
