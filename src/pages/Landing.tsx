import { useNavigate } from 'react-router-dom';

import { Container } from '@@/layout';
import { Button, Icon } from '@@/ui';

const pageClassName = 'w-full bg-linear-to-b from-primary-subtle/70 via-white to-white';
const heroSectionClassName =
    'grid gap-10 rounded-[2rem] bg-white px-8 py-10 shadow-1 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-12 lg:py-14';
const heroEyebrowClassName = 'text-sm font-semibold tracking-[0.18em] text-primary uppercase';
const heroTitleClassName = 'max-w-[12ch] text-5xl leading-tight font-bold text-black lg:text-6xl';
const heroDescriptionClassName = 'max-w-[60ch] text-lg leading-8 text-neutral-darker';
const heroActionGroupClassName = 'flex flex-wrap items-center gap-3';
const heroHighlightGridClassName = 'grid gap-4 sm:grid-cols-3';
const heroHighlightCardClassName = 'rounded-2xl bg-neutral-subtle px-5 py-4';
const heroHighlightValueClassName = 'text-2xl font-bold text-gray-700';
const heroHighlightLabelClassName = 'mt-1 text-sm text-neutral-darker';
const heroVisualClassName =
    'relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary-subtle via-white to-neutral-subtle p-6';
const heroVisualPanelClassName = 'rounded-[1.5rem] border border-neutral-lighter bg-white p-5 shadow-1';
const sectionClassName = 'flex flex-col gap-5';
const sectionHeadingClassName = 'text-3xl font-bold text-black';
const sectionDescriptionClassName = 'max-w-[70ch] text-base leading-7 text-neutral-darker';
const featureGridClassName = 'grid gap-4 lg:grid-cols-2 xl:grid-cols-3';
const featureCardClassName =
    'flex h-full flex-col gap-4 rounded-[1.75rem] border border-neutral-lighter bg-white p-6 shadow-1';
const featureIconWrapClassName =
    'inline-flex size-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary';
const featureTitleClassName = 'text-xl font-bold text-black';
const featureBodyClassName = 'text-sm leading-7 text-neutral-darker';
const problemGridClassName = 'grid gap-4 lg:grid-cols-3';
const problemCardClassName = 'rounded-[1.5rem] bg-white p-6 shadow-1';
const problemTitleClassName = 'mb-3 text-lg font-bold text-black';
const problemBodyClassName = 'text-sm leading-7 text-neutral-darker';
const targetListClassName = 'grid gap-3 lg:grid-cols-3';
const targetCardClassName = 'rounded-[1.5rem] border border-neutral-lighter bg-white p-5';
const ctaSectionClassName =
    'rounded-[2rem] bg-linear-to-r from-gray-900 to-neutral-darker px-8 py-10 text-white lg:px-12';
const ctaTitleClassName = 'text-3xl font-bold';
const ctaBodyClassName = 'mt-3 max-w-[60ch] text-base leading-7 text-white/80';

const features = [
    {
        title: '포모도로',
        icon: 'pomodoro',
        body: '세션과 세트를 기준으로 집중 흐름을 관리하고, 짧은 휴식과 긴 휴식을 자연스럽게 이어갑니다.',
    },
    {
        title: '투두리스트',
        icon: 'add',
        body: '날짜별로 해야 할 일을 관리하고, 단축키 기반 입력과 자정 이월 규칙으로 흐름을 끊지 않습니다.',
    },
    {
        title: '데일리로그',
        icon: 'edit',
        body: '마크다운 기반으로 작업 기록을 남기고, 자동저장과 검색으로 언제든 다시 꺼내볼 수 있습니다.',
    },
    {
        title: '회고',
        icon: 'communication',
        body: '기술, 결정, 소통, 감정 템플릿을 바탕으로 하루를 구조적으로 정리할 수 있습니다.',
    },
    {
        title: '대시보드',
        icon: 'tree',
        body: '캘린더와 히트맵으로 작업 이력과 집중 패턴을 한눈에 확인할 수 있습니다.',
    },
    {
        title: '집중모드',
        icon: 'fullscreen_open',
        body: '배경음악과 몰입형 배경을 통해 방해 요소를 줄이고, 타이머와 투두를 한 화면에 유지합니다.',
    },
] as const;

const problems = [
    {
        title: '기억에 의존한 기록',
        body: '언제 무엇을 했는지 기억에만 의존하면 하루가 끝난 뒤 남는 것은 모호한 감각뿐입니다.',
    },
    {
        title: '집중과 작업의 분리',
        body: '타이머를 써도 실제 어떤 작업을 위해 집중했는지 연결되지 않으면 시간 데이터는 쉽게 휘발됩니다.',
    },
    {
        title: '돌아보기 어려운 이력',
        body: '기록과 회고가 흩어져 있으면 달력이나 통계를 통해 패턴을 확인하기 어렵고 반복 실수도 커집니다.',
    },
] as const;

const targets = [
    '하루 작업을 체계적으로 기록하고 싶은 개발자',
    '포모도로로 집중 흐름을 관리하고 싶은 지식 근로자',
    '과거 작업 이력과 패턴을 한 번에 확인하고 싶은 사용자',
] as const;

export default function Landing() {
    const navigate = useNavigate();

    return (
        <main className={pageClassName}>
            <Container as='section'>
                <section className={heroSectionClassName}>
                    <div className='flex flex-col justify-between gap-8'>
                        <div className='flex flex-col gap-5'>
                            <p className={heroEyebrowClassName}>Focus, Work, Log, Retro</p>
                            <h1 className={heroTitleClassName}>집중과 기록을 하나의 흐름으로 묶는 작업 공간</h1>
                            <p className={heroDescriptionClassName}>
                                TOMADO는 포모도로 타이머, 날짜별 투두리스트, 데일리로그, 회고, 대시보드를 한 흐름으로
                                연결합니다. 무엇을 했고 얼마나 집중했는지, 그리고 그 하루를 어떻게 돌아볼지까지 같은
                                경험 안에서 이어집니다.
                            </p>
                        </div>

                        <div className={heroActionGroupClassName}>
                            <Button onClick={() => navigate('/signup')} size='lg'>
                                회원가입
                            </Button>
                            <Button onClick={() => navigate('/login')} size='lg' variant='outline'>
                                로그인
                            </Button>
                        </div>

                        <div className={heroHighlightGridClassName}>
                            <div className={heroHighlightCardClassName}>
                                <strong className={heroHighlightValueClassName}>집중</strong>
                                <p className={heroHighlightLabelClassName}>포모도로 세션과 세트 관리</p>
                            </div>
                            <div className={heroHighlightCardClassName}>
                                <strong className={heroHighlightValueClassName}>기록</strong>
                                <p className={heroHighlightLabelClassName}>날짜 기반 로그와 회고 작성</p>
                            </div>
                            <div className={heroHighlightCardClassName}>
                                <strong className={heroHighlightValueClassName}>분석</strong>
                                <p className={heroHighlightLabelClassName}>캘린더와 히트맵으로 패턴 확인</p>
                            </div>
                        </div>
                    </div>

                    <div className={heroVisualClassName}>
                        <div className='flex flex-col gap-4'>
                            <div className={heroVisualPanelClassName}>
                                <div className='mb-5 flex items-center justify-between'>
                                    <h2 className='text-3xl font-bold text-black'>TODAY</h2>
                                    <span className='rounded-full bg-gray-700 px-3 py-1 text-sm text-white'>0set</span>
                                </div>
                                <div className='flex flex-col items-center gap-6 py-6'>
                                    <div className='flex items-center gap-3'>
                                        <span className='size-6 rounded-lg bg-primary' />
                                        <span className='size-6 rounded-lg border-2 border-neutral' />
                                        <span className='size-6 rounded-lg border-2 border-neutral' />
                                        <span className='size-6 rounded-lg border-2 border-neutral' />
                                    </div>
                                    <div className='flex items-center gap-4 text-lg font-semibold text-neutral'>
                                        <span className='text-gray-700'>집중</span>
                                        <span>휴식</span>
                                        <span>장휴식</span>
                                    </div>
                                    <div className='size-44 rounded-full bg-primary' />
                                    <strong className='text-6xl leading-none font-bold text-black'>25:00</strong>
                                    <div className='flex items-center gap-4'>
                                        <Button icon={<Icon name='play' />} iconOnly size='lg'>
                                            재생
                                        </Button>
                                        <Button disabled icon={<Icon name='stop' color='white' />} iconOnly size='lg'>
                                            정지
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className={heroVisualPanelClassName}>
                                <div className='mb-4 flex items-center justify-between'>
                                    <h3 className='text-2xl font-bold text-black'>TODO</h3>
                                    <span className='rounded-full bg-gray-700 px-3 py-1 text-sm text-white'>1/3</span>
                                </div>
                                <div className='space-y-3'>
                                    {['오전 강의 3개 듣기', '오후 프로젝트 회의', '오후 미팅'].map((item, index) => (
                                        <div
                                            className='flex items-center gap-3 rounded-xl border border-neutral-lighter px-4 py-3'
                                            key={item}
                                        >
                                            <Icon color='color-neutral' name='drag_indicator' size={16} />
                                            <Icon
                                                color={index === 0 ? 'color-primary' : 'color-neutral-subtle'}
                                                name={index === 0 ? 'checked' : 'unchecked'}
                                                size={24}
                                            />
                                            <span
                                                className={`text-sm ${index === 0 ? 'text-neutral line-through' : 'text-gray-700'}`}
                                            >
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={sectionClassName}>
                    <h2 className={sectionHeadingClassName}>핵심 기능</h2>
                    <p className={sectionDescriptionClassName}>
                        작업을 적고, 세션으로 집중하고, 로그와 회고로 하루를 마무리한 뒤, 대시보드에서 전체 흐름을 다시
                        확인할 수 있습니다.
                    </p>
                    <div className={featureGridClassName}>
                        {features.map((feature) => (
                            <article className={featureCardClassName} key={feature.title}>
                                <span className={featureIconWrapClassName}>
                                    <Icon color='color-primary' name={feature.icon} size={24} />
                                </span>
                                <div className='flex flex-col gap-2'>
                                    <h3 className={featureTitleClassName}>{feature.title}</h3>
                                    <p className={featureBodyClassName}>{feature.body}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={sectionClassName}>
                    <h2 className={sectionHeadingClassName}>왜 TOMADO인가</h2>
                    <p className={sectionDescriptionClassName}>
                        기존 서비스는 작업 관리와 시간 측정이 분리되어 있습니다. TOMADO는 집중, 작업, 기록, 회고를
                        하나의 경험으로 묶어 하루의 맥락을 잃지 않게 합니다.
                    </p>
                    <div className={problemGridClassName}>
                        {problems.map((problem) => (
                            <article className={problemCardClassName} key={problem.title}>
                                <h3 className={problemTitleClassName}>{problem.title}</h3>
                                <p className={problemBodyClassName}>{problem.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={sectionClassName}>
                    <h2 className={sectionHeadingClassName}>이런 사용자에게 적합합니다</h2>
                    <div className={targetListClassName}>
                        {targets.map((target) => (
                            <article className={targetCardClassName} key={target}>
                                <p className='text-base leading-7 text-neutral-darker'>{target}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={ctaSectionClassName}>
                    <h2 className={ctaTitleClassName}>작업, 집중, 기록을 한 화면에서 이어가세요</h2>
                    <p className={ctaBodyClassName}>
                        포모도로로 집중을 시작하고, 날짜별 투두와 로그, 회고를 연결해 하루의 생산성을 단절 없이 관리할
                        수 있습니다.
                    </p>
                    <div className='mt-6 flex flex-wrap gap-3'>
                        <Button onClick={() => navigate('/signup')} size='lg'>
                            지금 시작하기
                        </Button>
                        <Button onClick={() => navigate('/login')} size='lg' variant='outline'>
                            로그인
                        </Button>
                    </div>
                </section>
            </Container>
        </main>
    );
}
