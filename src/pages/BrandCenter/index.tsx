import { Button, ButtonGroup } from '@/components/ui/Button';
import type { ButtonSize, ButtonVariant } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';

const standardVariants: Array<{ label: string; variant: ButtonVariant }> = [
    { label: 'Filled', variant: 'filled' },
    { label: 'Outline', variant: 'outline' },
    { label: 'Ghost', variant: 'ghost' },
];

const primitivePalettes = [
    {
        name: 'Tomato',
        steps: [
            'bg-tomato-50',
            'bg-tomato-100',
            'bg-tomato-200',
            'bg-tomato-300',
            'bg-tomato-400',
            'bg-tomato-500',
            'bg-tomato-600',
            'bg-tomato-700',
            'bg-tomato-800',
            'bg-tomato-900',
        ],
    },
    {
        name: 'Gray',
        steps: [
            'bg-gray-50',
            'bg-gray-100',
            'bg-gray-200',
            'bg-gray-300',
            'bg-gray-400',
            'bg-gray-500',
            'bg-gray-600',
            'bg-gray-700',
            'bg-gray-800',
            'bg-gray-900',
        ],
    },
    {
        name: 'Blue',
        steps: [
            'bg-blue-50',
            'bg-blue-100',
            'bg-blue-200',
            'bg-blue-300',
            'bg-blue-400',
            'bg-blue-500',
            'bg-blue-600',
            'bg-blue-700',
            'bg-blue-800',
            'bg-blue-900',
        ],
    },
    {
        name: 'Yellow',
        steps: [
            'bg-yellow-50',
            'bg-yellow-100',
            'bg-yellow-200',
            'bg-yellow-300',
            'bg-yellow-400',
            'bg-yellow-500',
            'bg-yellow-600',
            'bg-yellow-700',
            'bg-yellow-800',
            'bg-yellow-900',
        ],
    },
    {
        name: 'Green',
        steps: [
            'bg-green-50',
            'bg-green-100',
            'bg-green-200',
            'bg-green-300',
            'bg-green-400',
            'bg-green-500',
            'bg-green-600',
            'bg-green-700',
            'bg-green-800',
            'bg-green-900',
        ],
    },
    {
        name: 'Red',
        steps: [
            'bg-red-50',
            'bg-red-100',
            'bg-red-200',
            'bg-red-300',
            'bg-red-400',
            'bg-red-500',
            'bg-red-600',
            'bg-red-700',
            'bg-red-800',
            'bg-red-900',
        ],
    },
];

const semanticPalettes = [
    {
        name: 'Primary',
        chips: [
            { label: 'subtle', className: 'bg-primary-subtle text-primary-darker' },
            { label: 'lighter', className: 'bg-primary-lighter text-primary-darker' },
            { label: 'default', className: 'bg-primary text-white' },
            { label: 'darker', className: 'bg-primary-darker text-white' },
        ],
    },
    {
        name: 'Neutral',
        chips: [
            { label: 'subtle', className: 'bg-neutral-subtle text-neutral-darker' },
            { label: 'lighter', className: 'bg-neutral-lighter text-neutral-darker' },
            { label: 'default', className: 'bg-neutral text-white' },
            { label: 'darker', className: 'bg-neutral-darker text-white' },
        ],
    },
    {
        name: 'Info',
        chips: [
            { label: 'subtle', className: 'bg-info-subtle text-info-darker' },
            { label: 'lighter', className: 'bg-info-lighter text-info-darker' },
            { label: 'default', className: 'bg-info text-white' },
            { label: 'darker', className: 'bg-info-darker text-white' },
        ],
    },
    {
        name: 'Success',
        chips: [
            { label: 'subtle', className: 'bg-success-subtle text-success-darker' },
            { label: 'lighter', className: 'bg-success-lighter text-success-darker' },
            { label: 'default', className: 'bg-success text-white' },
            { label: 'darker', className: 'bg-success-darker text-white' },
        ],
    },
    {
        name: 'Warning',
        chips: [
            { label: 'subtle', className: 'bg-warning-subtle text-warning-darker' },
            { label: 'lighter', className: 'bg-warning-lighter text-warning-darker' },
            { label: 'default', className: 'bg-warning text-black' },
            { label: 'darker', className: 'bg-warning-darker text-white' },
        ],
    },
    {
        name: 'Danger',
        chips: [
            { label: 'subtle', className: 'bg-danger-subtle text-danger-darker' },
            { label: 'lighter', className: 'bg-danger-lighter text-danger-darker' },
            { label: 'default', className: 'bg-danger text-white' },
            { label: 'darker', className: 'bg-danger-darker text-white' },
        ],
    },
];

const sectionClassName =
    'rounded-[2rem] border border-neutral bg-white/90 p-6 shadow-[0_20px_60px_rgba(23,28,35,0.06)] backdrop-blur';

const panelClassName = 'rounded-3xl border border-neutral bg-white p-5';

const headingClassName = 'text-sm font-semibold uppercase tracking-[0.18em] text-neutral-darker';

const standardSizes: ButtonSize[] = ['lg', 'md'];

export default function BrandCenter() {
    return (
        <main className='min-h-screen bg-[radial-gradient(circle_at_top,_var(--color-primary-subtle),_transparent_32%),linear-gradient(180deg,_var(--color-white),_var(--color-neutral-subtle))] px-4 py-8 sm:px-6 lg:px-10'>
            <div className='mx-auto flex w-full max-w-7xl flex-col gap-8'>
                <section className={sectionClassName}>
                    <div className='flex flex-col gap-3 border-b border-neutral pb-5 sm:flex-row sm:items-end sm:justify-between'>
                        <div className='space-y-2'>
                            <p className={headingClassName}>Brand Center</p>
                            <h1 className='text-3xl font-bold text-black sm:text-4xl'>Button Visual QA</h1>
                            <p className='max-w-3xl text-sm text-neutral-darker sm:text-base'>
                                `Button.styles.ts`에 정의한 버튼 스타일과 컬러 토큰 조합을 한 화면에서 검수할 수 있도록
                                구성했습니다.
                            </p>
                        </div>
                        <ButtonGroup className='w-full sm:max-w-md'>
                            <Button variant='outline'>취소</Button>
                            <Button>다음</Button>
                        </ButtonGroup>
                    </div>
                </section>

                <section className={sectionClassName}>
                    <div className='mb-6'>
                        <p className={headingClassName}>Foundation</p>
                        <h2 className='mt-2 text-2xl font-semibold text-black'>Color Palette And Base Tokens</h2>
                        <p className='mt-2 text-sm text-neutral-darker sm:text-base'>
                            컬러 토큰은 실제 `theme.css` 값을, spacing, radius, typography는 Tailwind 기본 foundation을
                            그대로 시각화합니다.
                        </p>
                    </div>

                    <div className='grid gap-5 xl:grid-cols-[1.4fr_1fr]'>
                        <article className={panelClassName}>
                            <div className='mb-5 flex items-center justify-between border-b border-neutral pb-4'>
                                <h3 className='text-lg font-semibold text-black'>Primitive Palette</h3>
                                <span className='rounded-full bg-neutral-subtle px-3 py-1 text-xs font-semibold text-neutral-darker'>
                                    theme.css
                                </span>
                            </div>
                            <div className='space-y-4'>
                                {primitivePalettes.map((palette) => (
                                    <div key={palette.name} className='grid gap-3 md:grid-cols-[120px_1fr]'>
                                        <p className='pt-1 text-sm font-semibold text-neutral-darker'>{palette.name}</p>
                                        <div className='grid grid-cols-5 gap-2 sm:grid-cols-10'>
                                            {palette.steps.map((step) => (
                                                <div key={step} className='space-y-2'>
                                                    <div className={`${step} h-14 rounded-xl border border-black/5`} />
                                                    <p className='text-[11px] font-medium text-neutral-darker'>
                                                        {step.replace('bg-', '')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className={panelClassName}>
                            <div className='mb-5 flex items-center justify-between border-b border-neutral pb-4'>
                                <h3 className='text-lg font-semibold text-black'>Semantic Palette</h3>
                                <span className='rounded-full bg-neutral-subtle px-3 py-1 text-xs font-semibold text-neutral-darker'>
                                    color tokens
                                </span>
                            </div>
                            <div className='space-y-4'>
                                {semanticPalettes.map((palette) => (
                                    <div key={palette.name} className='space-y-2'>
                                        <p className='text-sm font-semibold text-neutral-darker'>{palette.name}</p>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {palette.chips.map((chip) => (
                                                <div
                                                    key={`${palette.name}-${chip.label}`}
                                                    className={`${chip.className} rounded-2xl px-4 py-4 text-sm font-semibold`}
                                                >
                                                    {chip.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <div className='mt-5 grid gap-5 lg:grid-cols-3'>
                        <article className={panelClassName}>
                            <div className='mb-5 border-b border-neutral pb-4'>
                                <h3 className='text-lg font-semibold text-black'>Typography</h3>
                            </div>
                            <div className='space-y-3'>
                                <h1>Heading 1</h1>
                                <h2>Heading 2</h2>
                                <h3>Heading 3</h3>
                                <p>
                                    기본 본문 텍스트는 `base.css`와 Tailwind spacing 조합이 화면에서 어떻게 보이는지
                                    확인하는 용도입니다.
                                </p>
                                <small>Small caption text</small>
                            </div>
                        </article>

                        <article className={panelClassName}>
                            <div className='mb-5 border-b border-neutral pb-4'>
                                <h3 className='text-lg font-semibold text-black'>Radius</h3>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                <div className='rounded-lg bg-primary-subtle px-4 py-6 text-sm font-semibold text-primary-darker'>
                                    rounded-lg
                                </div>
                                <div className='rounded-xl bg-primary-subtle px-4 py-6 text-sm font-semibold text-primary-darker'>
                                    rounded-xl
                                </div>
                                <div className='rounded-2xl bg-primary-subtle px-4 py-6 text-sm font-semibold text-primary-darker'>
                                    rounded-2xl
                                </div>
                                <div className='rounded-3xl bg-primary-subtle px-4 py-6 text-sm font-semibold text-primary-darker'>
                                    rounded-3xl
                                </div>
                            </div>
                        </article>

                        <article className={panelClassName}>
                            <div className='mb-5 border-b border-neutral pb-4'>
                                <h3 className='text-lg font-semibold text-black'>Spacing</h3>
                            </div>
                            <div className='space-y-3'>
                                <div className='rounded-2xl bg-neutral-subtle p-2 text-sm font-semibold text-neutral-darker'>
                                    p-2
                                </div>
                                <div className='rounded-2xl bg-neutral-subtle p-4 text-sm font-semibold text-neutral-darker'>
                                    p-4
                                </div>
                                <div className='rounded-2xl bg-neutral-subtle p-6 text-sm font-semibold text-neutral-darker'>
                                    p-6
                                </div>
                                <div className='rounded-2xl bg-neutral-subtle p-8 text-sm font-semibold text-neutral-darker'>
                                    p-8
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className={sectionClassName}>
                    <div className='mb-6 flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='mt-2 text-2xl font-semibold text-black'>Button / Standard</h2>
                        </div>
                    </div>
                    <div className='grid gap-5 lg:grid-cols-2'>
                        {standardSizes.map((size) => (
                            <article key={size} className={panelClassName}>
                                <div className='mb-5 flex items-center justify-between border-b border-neutral pb-4'>
                                    <h3 className='text-lg font-semibold text-black'>
                                        {size === 'lg' ? 'Large' : 'Medium'}
                                    </h3>
                                    <span className='rounded-full bg-neutral-subtle px-3 py-1 text-xs font-semibold text-neutral-darker'>
                                        {size === 'lg' ? 'h-10' : 'h-8'}
                                    </span>
                                </div>
                                <div className='space-y-6'>
                                    {standardVariants.map(({ label: variantLabel, variant }) => (
                                        <div key={variant} className='space-y-3'>
                                            <p className='text-sm font-semibold text-neutral-darker'>{variantLabel}</p>
                                            <div className='grid gap-3 sm:grid-cols-2'>
                                                <div className='space-y-2'>
                                                    <p className='text-xs font-medium uppercase tracking-[0.12em] text-neutral'>
                                                        Default
                                                    </p>
                                                    <Button fullWidth size={size} variant={variant}>
                                                        다음
                                                    </Button>
                                                </div>
                                                <div className='space-y-2'>
                                                    <p className='text-xs font-medium uppercase tracking-[0.12em] text-neutral'>
                                                        Disabled
                                                    </p>
                                                    <Button disabled fullWidth size={size} variant={variant}>
                                                        다음
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={sectionClassName}>
                    <div className='mb-6 flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='mt-2 text-2xl font-semibold text-black'>SectionHeader</h2>
                            <p className='mt-2 text-sm text-neutral-darker sm:text-base'>
                                datePicker, title type, text 슬롯 visibility를 함께 확인하는 샘플입니다.
                            </p>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <article className={panelClassName}>
                            <SectionHeader datePicker title='title' type='main' />
                        </article>
                        <article className={panelClassName}>
                            <SectionHeader title='title' type='sub' />
                        </article>
                        <article className={panelClassName}>
                            <SectionHeader datePicker title='title' type='sub' />
                        </article>
                        <article className={panelClassName}>
                            <SectionHeader datePicker showText text='제목을 입력해 주세요' title='title' type='sub' />
                        </article>
                        <article className={panelClassName}>
                            <SectionHeader datePicker text='제목을 입력해 주세요' title='title' type='sub' />
                        </article>
                    </div>
                </section>
            </div>
        </main>
    );
}
