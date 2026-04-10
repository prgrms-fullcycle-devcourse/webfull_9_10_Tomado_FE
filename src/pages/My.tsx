import { useMyProfileController } from '@/features/auth';
import { useMySettings } from '@/features/settings';
import { Input, Toggle } from '@/components/form';
import { CenteredLayout, Container, SectionHeader } from '@/components/layout';
import { Button, Icon, Menu } from '@/components/ui';

const settingControlButtonBaseClassName =
    'flex h-[16px] w-[16px] items-center justify-center align-middle pt-[2px] rounded-xs border-1 border-neutral-darker text-xs transition-colors duration-200 ease-out hover:cursor-pointer disabled:cursor-not-allowed disabled:border-neutral-lighter disabled:text-neutral disabled:bg-neutral-subtle';
const settingValueInputClassName =
    'h-[16px] w-[50px] appearance-none rounded-xs bg-transparent px-2 text-center text-xs font-medium text-neutral-darker focus:outline-none disabled:bg-transparent disabled:text-neutral [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

export default function My() {
    const panelClassName =
        'flex max-w-[800px] mx-auto min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-shadow-1';
    const profileImageClassName = 'block size-full rounded-full object-cover bg-primary';
    const settingsLabelClassName = 'text-sm font-semibold text-gray-800 px-[5px]';
    const { timer, todo, meta, actions } = useMySettings();
    const { profile, avatar, account } = useMyProfileController();

    return (
        <Container>
            <CenteredLayout>
                <section className={panelClassName}>
                    <div className='w-full max-w-[400px] gap-5 flex flex-col'>
                        <SectionHeader title='계정 관리' type='main' />
                        <div className='gap-2 flex flex-col'>
                            <p className={settingsLabelClassName}>프로필</p>
                            <div className='flex items-end gap-4'>
                                <div className='relative h-[100px] w-[100px] shrink-0' ref={avatar.menuRef}>
                                    {profile.avatarSrc ? (
                                        <img
                                            alt='사용자 아바타'
                                            className={profileImageClassName}
                                            src={profile.avatarSrc}
                                        />
                                    ) : (
                                        <Icon name='avatar' size={100} />
                                    )}
                                    <button
                                        aria-expanded={avatar.isMenuOpen}
                                        aria-haspopup='menu'
                                        aria-label='프로필 이미지 메뉴 열기'
                                        className='w-[35px] h-[35px] flex justify-center items-center absolute right-0 bottom-0 border-1 border-(--color-tomato-50) rounded-full bg-primary hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
                                        disabled={!avatar.canEdit}
                                        onClick={avatar.onEditClick}
                                        type='button'
                                    >
                                        <Icon name='edit' color='color-white' size={20} />
                                    </button>
                                    {avatar.hasAvatar && avatar.isMenuOpen ? (
                                        <div className='absolute right-0 bottom-8 z-20 p-2'>
                                            <Menu
                                                inline
                                                items={[
                                                    {
                                                        label: avatar.isUploading
                                                            ? '이미지 업로드 중...'
                                                            : '이미지 수정',
                                                        onClick: avatar.openPicker,
                                                    },
                                                    {
                                                        label: '이미지 삭제',
                                                        onClick: avatar.confirmDelete,
                                                        tone: 'danger' as const,
                                                    },
                                                ]}
                                            />
                                        </div>
                                    ) : null}
                                    <input
                                        accept='image/*'
                                        className='hidden'
                                        onChange={avatar.onFileChange}
                                        ref={avatar.fileInputRef}
                                        type='file'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='gap-2 flex flex-col'>
                            <p className={settingsLabelClassName}>닉네임</p>
                            <div className='flex'>
                                <Input
                                    className='mr-2'
                                    value={profile.name}
                                    onChange={(e) => profile.setName(e.target.value)}
                                />
                                <Button onClick={profile.save} disabled={profile.isNameSaveDisabled}>
                                    {profile.isSaving ? '저장 중...' : '저장'}
                                </Button>
                            </div>
                        </div>

                        <div className='gap-2 flex flex-col'>
                            <p className={settingsLabelClassName}>계정 삭제</p>

                            <div className='flex p-5 justify-between items-center border-1 border-neutral-lighter rounded-2xl'>
                                <p className='text-neutral-darker'>계정 삭제 시 모든 기록은 삭제됩니다.</p>
                                <Button variant='ghost' onClick={account.confirmDelete}>
                                    삭제하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={panelClassName}>
                    <div className='w-full max-w-[400px] gap-5 flex flex-col'>
                        <SectionHeader title='설정' type='main' />

                        <div className='gap-2 flex flex-col'>
                            <p className={settingsLabelClassName}>타이머</p>

                            <div className='flex-col flex gap-4 p-5 items-center border-1 border-neutral-lighter rounded-2xl'>
                                <div className='flex flex-col gap-5 w-full'>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-neutral-darker font-medium h-[20px] mb-[2px]'>집중 시간</p>
                                        <div className='flex'>
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={!timer.focus.canDecrease || meta.isSaving}
                                                onClick={timer.focus.decrease}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>-</span>
                                            </button>
                                            <input
                                                className={settingValueInputClassName}
                                                disabled={meta.isSaving}
                                                inputMode='numeric'
                                                min={1}
                                                onChange={timer.focus.onChange}
                                                step={1}
                                                type='number'
                                                value={timer.focus.value}
                                            />
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={meta.isSaving}
                                                onClick={timer.focus.increase}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-neutral-darker font-medium h-[20px] mb-[2px]'>단기 휴식</p>
                                        <div className='flex'>
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={!timer.shortBreak.canDecrease || meta.isSaving}
                                                onClick={timer.shortBreak.decrease}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>-</span>
                                            </button>
                                            <input
                                                className={settingValueInputClassName}
                                                disabled={meta.isSaving}
                                                inputMode='numeric'
                                                min={1}
                                                onChange={timer.shortBreak.onChange}
                                                step={1}
                                                type='number'
                                                value={timer.shortBreak.value}
                                            />
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={meta.isSaving}
                                                onClick={timer.shortBreak.increase}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>+</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='text-neutral-darker font-medium h-[20px] mb-[2px]'>장 휴식</p>
                                        <div className='flex'>
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={!timer.longBreak.canDecrease || meta.isSaving}
                                                onClick={timer.longBreak.decrease}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>-</span>
                                            </button>
                                            <input
                                                className={settingValueInputClassName}
                                                disabled={meta.isSaving}
                                                inputMode='numeric'
                                                min={1}
                                                onChange={timer.longBreak.onChange}
                                                step={1}
                                                type='number'
                                                value={timer.longBreak.value}
                                            />
                                            <button
                                                className={settingControlButtonBaseClassName}
                                                disabled={meta.isSaving}
                                                onClick={timer.longBreak.increase}
                                                type='button'
                                            >
                                                <span className='relative top-[-2px]'>+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex gap-2.5 w-full'>
                                    <Button
                                        className='flex-1 !bg-neutral-lighter !text-black'
                                        disabled={meta.isSaving}
                                        onClick={actions.reset}
                                    >
                                        {meta.isSaving ? '저장 중...' : '설정값 초기화'}
                                    </Button>
                                    <Button
                                        className='flex-1'
                                        onClick={() => void actions.save()}
                                        disabled={meta.isSaveDisabled}
                                    >
                                        {meta.isSaving ? '저장 중...' : '저장'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='gap-2 flex flex-col'>
                            <p className={settingsLabelClassName}>투두리스트</p>

                            <div className='flex-col flex gap-4 p-5 items-center border-1 border-neutral-lighter rounded-2xl'>
                                <div className='flex justify-between items-center w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <p className='font-medium text-neutral-darker'>미완료 작업 자동 이월</p>
                                        <p className='text-xs text-neutral-darker'>
                                            어제 미완료한 작업을 오늘로 이동합니다.
                                        </p>
                                    </div>
                                    <Toggle checked={todo.autoCarry} onCheckedChange={todo.onToggle} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </CenteredLayout>
        </Container>
    );
}
