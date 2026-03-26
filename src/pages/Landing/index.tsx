import { Icon, Button, Menu } from '@@/ui/index';
import { SectionHeader } from '@/components/layout/SectionHeader/SectionHeader';

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
                <Button icon={<Icon name='delete' />} size='md' variant='filled'>
                    아이콘이 있는 버튼
                </Button>
                <Menu inline items={[{ label: '날짜 이동하기' }, { label: '삭제하기', tone: 'danger' }]} />
            </div>
        </div>
    );
}
