import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Icon } from '@@/ui';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const pageClassName = 'w-full bg-neutral-subtle';
const layoutClassName = 'flex flex-col';

const heroClassName =
    'grid items-start gap-14 bg-transparent lg:grid-cols-[minmax(0,1fr)_560px] max-w-[1200px] mx-auto py-24';
const heroTitleClassName = 'text-5xl leading-[1.08] font-bold tracking-[-0.03em] text-[#111827] lg:text-6xl';
const heroDescriptionClassName = 'text-xl text-neutral-darker';
const heroActionsClassName = 'flex flex-wrap items-center gap-3';
const demoInputClassName = 'w-full bg-transparent text-sm text-gray-700 placeholder:text-neutral focus:outline-none';

const sectionClassName = 'flex flex-col gap-5 max-w-[1200px] mx-auto';
const sectionTitleClassName = 'text-4xl leading-tight font-bold lg:text-5xl';
const sectionBodyClassName = 'max-w-[68ch] text-lg leading-8 text-neutral-darker text-center';

const ctaClassName = 'w-full bg-[var(--color-gray-900)] text-white';
const ctaTitleClassName = 'text-4xl leading-tight font-bold lg:text-5xl text-center';

const retroTemplateItems = [
    {
        category: '기술',
        title: '막혔던 지점을 기술 관점에서 정리',
        question: '오늘 가장 오래 붙잡고 있던 문제는 무엇이었고, 다음에는 어떤 기준으로 풀어볼까요?',
    },
    {
        category: '회고',
        title: '하루를 돌아보며 패턴 찾기',
        question: '오늘 잘된 선택 하나와 반복하고 싶지 않은 선택 하나를 적어보세요.',
    },
    {
        category: '소통',
        title: '협업 과정에서 남길 판단 기록',
        question: '오늘 나눈 대화 중 나중에 다시 참고할 만한 내용은 무엇이었나요?',
    },
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
        { id: 1, label: '오전 강의 3개 듣기', checked: false },
        { id: 2, label: 'API 명세서 정리', checked: true },
        { id: 3, label: '회고 초안 작성', checked: true },
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
    const normalizedFlowStep = currentFlowStep % landingFlowSteps.length;
    const activeLandingTabTitle = landingFlowSteps[normalizedFlowStep];
    const heroTodoItems = demoTodos.slice(0, 3);

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
                                할 일 적고
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
                    <div className='overflow-hidden rounded-[32px] border border-neutral-lighter bg-white shadow-shadow-1 lg:-translate-y-2'>
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
                                    <div className='bg-white'>
                                        <div className='flex h-[60px] items-center gap-3 rounded-br-[22px] bg-neutral-darker px-6'>
                                            <span className='size-4 rounded-full bg-[#ff5f57]' />
                                            <span className='size-4 rounded-full bg-[#febc2e]' />
                                            <span className='size-4 rounded-full bg-[#28c840]' />
                                        </div>
                                    </div>

                                    <div className='flex min-w-0 items-start gap-[2px] overflow-hidden'>
                                        <div className='flex h-[60px] min-w-[300px] items-center gap-4 rounded-t-[20px] bg-white px-6'>
                                            <Icon color='color-primary' name='pomodoro' size={18} />
                                            <span className='text-[18px] leading-none font-semibold'>
                                                {landingTabMinutes}:{landingTabDisplaySeconds}
                                            </span>
                                            <span className='truncate text-[17px] font-medium'>
                                                {activeLandingTabTitle}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='bg-white'>
                                        <div className='flex h-[60px] items-center gap-3 rounded-bl-[22px] bg-neutral-darker px-6' />
                                    </div>
                                </div>
                                <hr className='bg-white h-[12px] border-none' />
                            </div>
                        </div>

                        <div className='relative min-h-[300px] overflow-hidden bg-neutral-subtle p-6'>
                            <div
                                className={cx(
                                    'absolute inset-0 grid gap-4 p-6 transition-all duration-500 ease-in-out',
                                    normalizedFlowStep === 0
                                        ? 'translate-y-0 opacity-100'
                                        : '-translate-y-4 opacity-0 pointer-events-none'
                                )}
                            >
                                <div className='grid gap-4 sm:grid-cols-[1.1fr_0.9fr]'>
                                    <div className='rounded-2xl border border-neutral-lighter bg-white px-6 py-5 shadow-shadow-1'>
                                        <div className='mb-5 flex items-center justify-between'>
                                            <strong className='text-xl font-bold text-[#111827]'>TODAY</strong>
                                            <span className='rounded-full bg-[#667891] px-3 py-1 text-xs font-medium text-white'>
                                                0set
                                            </span>
                                        </div>
                                        <div className='flex flex-col gap-6'>
                                            <div className='rounded-2xl border border-neutral-lighter bg-neutral-subtle px-5 py-6 text-left'>
                                                <span className='text-sm font-medium text-neutral'>이번 세션</span>
                                                <strong className='mt-3 block text-5xl leading-none font-bold text-black'>
                                                    24:00
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='rounded-2xl border border-neutral-lighter bg-white px-6 py-5 shadow-shadow-1'>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <strong className='text-xl font-bold text-[#111827]'>TODO</strong>
                                            <span className='rounded-full bg-[#667891] px-3 py-1 text-xs font-medium text-white'>
                                                {completedTodoCount}/{demoTodos.length}
                                            </span>
                                        </div>
                                        <div className='space-y-3'>
                                            {heroTodoItems.map((item) => (
                                                <div
                                                    className='flex items-center gap-3 rounded-xl border border-neutral-lighter bg-neutral-subtle px-4 py-3'
                                                    key={item.id}
                                                >
                                                    <Icon
                                                        color={item.checked ? 'color-primary' : 'color-neutral-subtle'}
                                                        name={item.checked ? 'checked' : 'unchecked'}
                                                        size={20}
                                                    />
                                                    <div className='h-3 flex-1 rounded-full bg-white' />
                                                </div>
                                            ))}
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
                            {/* 불필요한 작업 전환은
                            <br />
                            집중을 흐트러뜨립니다 */}
                            할 일과 타이머,
                            <br />한 화면에서
                        </h2>
                        <p className={sectionBodyClassName}>
                            토마두는 해야 할 일과 타이머를 한 화면에 두고,
                            <br />
                            지금 할 일에만 더 오래 머물 수 있게 돕습니다.
                        </p>
                    </div>

                    <div className='w-full max-w-[1040px]'>
                        <div className='grid gap-4 sm:grid-cols-[1.1fr_0.9fr]'>
                            <div className='rounded-2xl border border-neutral-lighter bg-white px-6 py-5 shadow-shadow-1'>
                                <div className='mb-4 flex items-center justify-between'>
                                    <strong className='text-xl font-bold text-[#111827]'>TODAY</strong>
                                    <span className='rounded-full bg-[#667891] px-3 py-1 text-xs font-medium text-white'>
                                        0set
                                    </span>
                                </div>
                                <div className='flex flex-col items-center gap-5 py-3'>
                                    <div className='flex items-start gap-3'>
                                        {timelineItems.map((item, index) => (
                                            <div className='flex flex-col items-center gap-2' key={item}>
                                                <span
                                                    className={cx(
                                                        'h-7 w-7 rounded-[10px] border-2 border-neutral text-xs',
                                                        index === 0 && 'border-primary bg-primary'
                                                    )}
                                                />
                                                <span
                                                    className={cx(
                                                        'text-[11px] font-semibold',
                                                        index === 0 ? 'text-neutral-darker' : 'text-neutral'
                                                    )}
                                                >
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='relative size-24 rounded-full bg-primary shadow-[inset_0_-14px_0_rgba(0,0,0,0.05)]'>
                                        <div className='absolute left-4 top-4 size-7 rounded-full bg-white/25' />
                                    </div>
                                    <strong className='text-5xl leading-none font-bold text-black'>
                                        {demoMinutes}:{demoDisplaySeconds}
                                    </strong>
                                    <div className='flex items-center gap-4'>
                                        <Button
                                            className='shadow-[0_10px_20px_rgba(255,102,77,0.25)]'
                                            icon={<Icon name={isDemoRunning ? 'pause' : 'play'} />}
                                            iconOnly
                                            onClick={handleToggleDemoTimer}
                                            size='lg'
                                        >
                                            재생
                                        </Button>
                                        <Button
                                            disabled={!isDemoRunning && demoSeconds === 25 * 60}
                                            icon={<Icon name='stop' />}
                                            iconOnly
                                            onClick={handleResetDemoTimer}
                                            size='lg'
                                            variant='outline'
                                        >
                                            정지
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className='rounded-2xl border border-neutral-lighter bg-white px-6 py-5 shadow-shadow-1'>
                                <div className='mb-4 flex items-center justify-between'>
                                    <strong className='text-xl font-bold text-[#111827]'>TODO</strong>
                                    <span className='rounded-full bg-[#667891] px-3 py-1 text-xs font-medium text-white'>
                                        {completedTodoCount}/{demoTodos.length}
                                    </span>
                                </div>
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 rounded-xl border border-neutral-lighter bg-white px-4 py-3 shadow-[inset_0_0_0_1px_rgba(232,236,243,0.3)]'>
                                        <Icon color='color-neutral-darker' name='add' size={16} />
                                        <input
                                            className={demoInputClassName}
                                            onChange={(event) => setDemoTodoInput(event.target.value)}
                                            onKeyDown={(event) => {
                                                const nativeEvent = event.nativeEvent as KeyboardEvent & {
                                                    isComposing?: boolean;
                                                    keyCode?: number;
                                                };

                                                if (nativeEvent.isComposing || nativeEvent.keyCode === 229) {
                                                    return;
                                                }

                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    handleAddDemoTodo();
                                                }
                                            }}
                                            placeholder='할 일을 추가해보세요'
                                            value={demoTodoInput}
                                        />
                                        <span className='ml-auto inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-neutral-lighter bg-neutral-subtle px-2 text-xs font-medium text-[#53627c]'>
                                            T
                                        </span>
                                    </div>
                                    {demoTodos.map((item) => (
                                        <div
                                            className='flex items-center gap-3 rounded-xl border border-neutral-lighter bg-white px-4 py-3'
                                            key={item.id}
                                        >
                                            <Icon color='color-neutral' name='drag_indicator' size={16} />
                                            <button onClick={() => handleToggleDemoTodo(item.id)} type='button'>
                                                <Icon
                                                    color={item.checked ? 'color-primary' : 'color-neutral-subtle'}
                                                    name={item.checked ? 'checked' : 'unchecked'}
                                                    size={22}
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
                    </div>
                </section>

                <section className='flex flex-col items-center gap-12 max-w-[1200px] mx-auto py-24'>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-center text-4xl leading-tight font-bold text-[#111827] lg:text-5xl'>
                            빈 종이 말고,
                            <br />
                            질문에서 시작하는 회고
                        </h2>
                        <p className='text-center text-xl text-[#6b7c99]'>
                            뭘 써야 할지 몰라서 안 썼다면,
                            <br />
                            질문에 답하는 것부터 시작해보세요.
                        </p>
                    </div>

                    <div className='flex w-full flex-col gap-6 pt-2'>
                        {retroTemplateItems.map((item, index) => (
                            <article
                                className={cx(
                                    'relative border border-[#d9e3f0] bg-white px-9 py-7 shadow-[0_18px_40px_rgba(109,128,159,0.08)]',
                                    index === 0 && 'max-w-[900px] self-end rounded-[36px] ml-20',
                                    index === 1 && 'max-w-[760px] self-start rounded-[34px] mr-20',
                                    index === 2 && 'max-w-[840px] self-end rounded-[36px] ml-20'
                                )}
                                key={item.title}
                            >
                                <div
                                    className={cx(
                                        'absolute bottom-[-10px] h-5 w-5 rotate-45 border-[#d9e3f0] bg-white',
                                        index % 2 === 0 ? 'right-12 border-r border-b' : 'left-12 border-b'
                                    )}
                                />
                                <div className='mb-4 flex items-center gap-3'>
                                    <span className='inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#fff3ee] px-2 text-sm font-bold text-primary'>
                                        Q{index + 1}
                                    </span>
                                    <div className='h-px flex-1 bg-[#e8eef7]' />
                                </div>
                                <p className='text-[16px] leading-[1.45] font-bold tracking-[-0.02em] text-[#111827]'>
                                    {item.question}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className='w-full bg-[linear-gradient(180deg,#eef3fa_0%,#e5edf7_100%)] py-24'>
                    <div className='max-w-[1200px] mx-auto flex flex-col gap-8 px-6'>
                        <div className='text-center'>
                            <h2 className='text-4xl leading-tight font-bold text-[#111827] lg:text-5xl'>
                                지난 날들,
                                <br />
                                언제든 꺼내보기
                            </h2>
                            <p className='mt-5 text-xl leading-8 text-[#6b7c99]'>
                                얼마나 집중했는지, 무엇을 했는지,
                                <br />
                                모두 한 곳에 모여있어요.
                            </p>
                        </div>

                        <div className='rounded-[28px] bg-white p-6 shadow-[0_24px_48px_rgba(77,97,128,0.18)]'>
                            <div className='grid gap-4 lg:grid-cols-[0.92fr_1.08fr]'>
                                <div className='grid gap-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div className='rounded-2xl border border-neutral-lighter bg-neutral-subtle px-5 py-4'>
                                            <p className='text-sm font-medium text-[#6b7c99]'>이번 주 집중 시간</p>
                                            <strong className='mt-3 block text-4xl font-bold text-[#111827]'>
                                                12h 40m
                                            </strong>
                                        </div>
                                        <div className='rounded-2xl border border-neutral-lighter bg-neutral-subtle px-5 py-4'>
                                            <p className='text-sm font-medium text-[#6b7c99]'>완료한 할 일</p>
                                            <strong className='mt-3 block text-4xl font-bold text-[#111827]'>
                                                28개
                                            </strong>
                                        </div>
                                    </div>

                                    <div className='rounded-2xl border border-neutral-lighter bg-white px-5 py-5'>
                                        <div className='mb-4 flex items-center'>
                                            <strong className='text-xl font-bold text-[#111827]'>집중 히트맵</strong>
                                        </div>
                                        <div className='grid grid-cols-7 gap-2'>
                                            {[
                                                1, 3, 2, 0, 2, 1, 2, 2, 4, 3, 0, 0, 2, 4, 3, 1, 0, 1, 0, 1, 2, 0, 3, 2,
                                                1, 4, 2, 3,
                                            ].map((level, index) => (
                                                <span
                                                    className={cx(
                                                        'h-8 rounded-lg',
                                                        level === 0 && 'bg-[var(--color-heatmap-1)]',
                                                        level === 1 && 'bg-[var(--color-heatmap-2)]',
                                                        level === 2 && 'bg-[var(--color-heatmap-3)]',
                                                        level === 3 && 'bg-[var(--color-heatmap-4)]',
                                                        level === 4 && 'bg-[var(--color-heatmap-5)]'
                                                    )}
                                                    key={index}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className='grid gap-4'>
                                    <div className='rounded-2xl border border-neutral-lighter bg-white px-5 py-5'>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <strong className='text-xl font-bold text-[#111827]'>최근 기록</strong>
                                            <span className='rounded-full bg-neutral-subtle px-3 py-1 text-xs font-semibold text-[#667891]'>
                                                04.14
                                            </span>
                                        </div>
                                        <div className='grid gap-3'>
                                            <div className='rounded-xl border border-neutral-lighter bg-neutral-subtle px-4 py-4'>
                                                <div className='flex items-center justify-between'>
                                                    <strong className='text-base font-bold text-[#111827]'>
                                                        데일리로그
                                                    </strong>
                                                    <Icon color='color-neutral-darker' name='arrow_right' size={18} />
                                                </div>
                                                <p className='mt-3 text-sm leading-7 text-[#53627c]'>
                                                    API 명세서 정리 완료, ERD 리뷰, 대시보드 구조 정리
                                                </p>
                                            </div>
                                            <div className='rounded-xl border border-neutral-lighter bg-neutral-subtle px-4 py-4'>
                                                <div className='flex items-center justify-between'>
                                                    <strong className='text-base font-bold text-[#111827]'>회고</strong>
                                                    <div className='flex gap-2'>
                                                        {['기술', '결정', '소통'].map((tag) => (
                                                            <span
                                                                className='rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#667891]'
                                                                key={tag}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className='mt-3 text-sm leading-7 text-[#53627c]'>
                                                    오늘은 선택 기준을 더 또렷하게 남겼고, 다음에는 회고를 더 짧고 자주
                                                    적어보기로 했어요.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid gap-4 sm:grid-cols-3'>
                                        <div className='rounded-2xl border border-neutral-lighter bg-white px-4 py-4'>
                                            <p className='text-sm font-medium text-[#6b7c99]'>최장 집중</p>
                                            <strong className='mt-3 block text-2xl font-bold text-[#111827]'>
                                                2h 10m
                                            </strong>
                                        </div>
                                        <div className='rounded-2xl border border-neutral-lighter bg-white px-4 py-4'>
                                            <p className='text-sm font-medium text-[#6b7c99]'>회고 작성일</p>
                                            <strong className='mt-3 block text-2xl font-bold text-[#111827]'>
                                                18일
                                            </strong>
                                        </div>
                                        <div className='rounded-2xl border border-neutral-lighter bg-white px-4 py-4'>
                                            <p className='text-sm font-medium text-[#6b7c99]'>기록한 카테고리</p>
                                            <strong className='mt-3 block text-2xl font-bold text-[#111827]'>
                                                7개
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={ctaClassName}>
                    <div className='mx-auto max-w-[1200px]'>
                        <div className='flex flex-col items-center px-6 py-20'>
                            <h2 className={ctaTitleClassName}>
                                성장에 투자한 시간들을
                                <br />
                                토마두와 함께 기록해 볼까요?
                            </h2>
                            <div className='mt-8 flex flex-wrap gap-3'>
                                <Button onClick={() => navigate('/signup')} size='lg'>
                                    시작하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className='w-full bg-[var(--color-gray-950)] text-white/70'>
                    <div className='mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-6 text-sm'>
                        <p>Copyright © 2026 TeamPalette. All rights reserved.</p>
                        <a
                            className='inline-flex items-center gap-2 font-medium text-white/88 transition-colors hover:text-white'
                            href='https://github.com/prgrms-fullcycle-devcourse/webfull_9_10_Tomado_FE'
                            rel='noreferrer'
                            target='_blank'
                        >
                            <img alt='GitHub' className='h-4 w-4' src='https://skillicons.dev/icons?i=github' />
                            <span>GitHub</span>
                        </a>
                    </div>
                </footer>
            </div>
        </main>
    );
}
