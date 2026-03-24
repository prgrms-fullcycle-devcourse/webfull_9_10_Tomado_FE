import { Button } from '@@/ui/Button/Button';
import { SectionHeader } from '@@/ui/SectionHeader/SectionHeader';
import { Icon } from '@@/ui/Icon/Icon';

export default function Landing() {
    return (
        <div className='flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-primary-subtle'>
            <h1 className='text-3xl font-bold text-primary-darker'>Tailwind 4 Working</h1>
            <a href='/brand-center' className='text-3xl font-bold text-primary-darker'>
                브랜드 센터 바로가기
            </a>
            <div className='h-50 w-full max-w-4xl bg-white'>
                <SectionHeader title='섹션 헤더' datePicker showText text='2025.10.13' type='sub' />
                <SectionHeader title='섹션 헤더' datePicker showText text='2025.10.13' type='main' />
                <Button variant='filled' size='md' icon={<Icon name='delete' />}>
                    안녕하세요
                </Button>
            </div>
        </div>
    );
}
