import { queryClient } from '@/api/queryClient';
import { getGetMyProfileQueryKey } from '@/api/generated/users/users';
import { deleteUserAvatar, mapUserResponseToAuthUser, uploadUserAvatar, useAuthStore } from '@/features/auth';
import { Input, Toggle } from '@/components/form';
import { CenteredLayout, Container, SectionHeader } from '@/components/layout';
import { Button, Icon } from '@/components/ui';
import { useModal, useToast } from '@/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function My() {
    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
    const profileImageClassName = 'block size-full rounded-full object-cover bg-primary';

    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const [name, setName] = useState('');
    const [focusTime, setFocusTime] = useState(0);
    const [shortBreakTime, setShortBreakTime] = useState(0);
    const [longBreakTime, setLongBreakTime] = useState(0);
    const [todoToggle, setTodoToggle] = useState(true);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { showToast } = useToast();
    const { showModal } = useModal();

    const dummyUser = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        login_id: 'devjohn',
        nickname: '재빠른 개발자',
        avatar_url: 'https://cdn.tomado.io/avatars/devjohn.png',
        created_at: '2026-01-15T09:00:00Z',
        updated_at: '2026-06-01T12:00:00Z',
    };
    const dummySettings = {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        focus_min: 25,
        short_break_min: 5,
        long_break_min: 30,
        sessions_per_set: 4,
        auto_carry_todo: true,
        updated_at: '2026-06-01T12:00:00Z',
    };

    const initialTime = {
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 30,
    };

    const profileNickname = user?.nickname ?? dummyUser.nickname;
    const profileAvatarSrc = user?.avatarSrc ?? null;
    const hasAvatar = Boolean(profileAvatarSrc);

    useEffect(() => {
        setName(profileNickname);
        setFocusTime(dummySettings.focus_min | initialTime.focusTime);
        setShortBreakTime(dummySettings.short_break_min | initialTime.shortBreakTime);
        setLongBreakTime(dummySettings.long_break_min | initialTime.longBreakTime);
        setTodoToggle(dummySettings.auto_carry_todo);
    }, [profileNickname]);

    const isNameSaveDisabled = useMemo(() => {
        return !(name.length >= 2 && name.length <= 20 && name !== profileNickname);
    }, [name, profileNickname]);

    const handleNameSave = () => {
        // TODO: 닉네임 저장 로직
    };

    const handleDeleteAcount = () => {
        // TODO: 계정 삭제 로직
        showToast({
            message: '계정이 삭제되었어요',
            iconName: 'check',
            duration: 3000,
        });

        setTimeout(() => {
            // TODO: 랜딩 이동
        }, 3000);
    };

    const isActiveSettingSaveBtn = (): boolean => {
        if (
            focusTime === dummySettings.focus_min &&
            shortBreakTime === dummySettings.short_break_min &&
            longBreakTime === dummySettings.long_break_min
        ) {
            return true;
        }

        return false;
    };

    const handleResetSettings = () => {
        setFocusTime(initialTime.focusTime);
        setShortBreakTime(initialTime.shortBreakTime);
        setLongBreakTime(initialTime.longBreakTime);

        handleSaveSettings();
    };

    const handleSaveSettings = () => {
        // TODO: 설정 저장 api 호출
    };

    const handleAutoCarryTodo = () => {
        setTodoToggle(!todoToggle);

        // TODO: 투두 자동 이월 변경 api
    };

    const handleDeleteConfirm = () => {
        showModal({
            title: '계정 삭제',
            description: `삭제한 기록은 복구할 수 없어요\n그래도 삭제하시겠어요?`,
            tone: 'danger',
            confirmLabel: '삭제하기',
            onConfirm: handleDeleteAcount,
        });
    };

    const handleAvatarPickerOpen = () => {
        if (!user?.id || isAvatarUploading) {
            return;
        }

        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile || !user?.id) {
            return;
        }

        if (!selectedFile.type.startsWith('image/')) {
            showToast({
                message: '이미지 파일만 업로드할 수 있어요',
                iconName: 'error',
                duration: 3000,
            });
            event.target.value = '';
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            showToast({
                message: '프로필 이미지는 5MB 이하만 업로드할 수 있어요',
                iconName: 'error',
                duration: 3000,
            });
            event.target.value = '';
            return;
        }

        setIsAvatarUploading(true);

        try {
            const nextUser = await uploadUserAvatar(selectedFile);
            updateUser(mapUserResponseToAuthUser(nextUser));
            void queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
            showToast({
                message: '프로필 이미지를 변경했어요',
                iconName: 'check',
                duration: 3000,
            });
        } catch (error) {
            console.error('프로필 이미지 업로드에 실패했습니다.', error);
            showToast({
                message: '프로필 이미지 업로드에 실패했어요',
                iconName: 'error',
                duration: 3000,
            });
        } finally {
            setIsAvatarUploading(false);
            event.target.value = '';
        }
    };

    const handleAvatarDelete = async () => {
        if (!user?.id || !hasAvatar) {
            return;
        }

        try {
            const nextUser = await deleteUserAvatar();
            updateUser(mapUserResponseToAuthUser(nextUser));
            void queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
            showToast({
                message: '프로필 이미지를 삭제했어요',
                iconName: 'check',
                duration: 3000,
            });
        } catch (error) {
            console.error('프로필 이미지 삭제에 실패했습니다.', error);
            showToast({
                message: '프로필 이미지 삭제에 실패했어요',
                iconName: 'error',
                duration: 3000,
            });
        }
    };

    const handleAvatarDeleteConfirm = () => {
        showModal({
            title: '프로필 이미지 삭제',
            description: '현재 프로필 이미지를 삭제하고 기본 아이콘으로 되돌릴까요?',
            confirmLabel: '삭제하기',
            tone: 'danger',
            onConfirm: handleAvatarDelete,
        });
    };

    return (
        <Container>
            <CenteredLayout>
                <section className={panelClassName}>
                    <div className='w-full max-w-[450px]'>
                        <SectionHeader title='계정 관리' type='sub' />
                        <div className='my-4'>
                            <p className='ml-1 mb-1'>프로필</p>
                            <div className='flex items-end gap-4'>
                                <div className='w-[100px] h-[100px] relative shrink-0'>
                                    {profileAvatarSrc ? (
                                        <img
                                            alt='사용자 아바타'
                                            className={profileImageClassName}
                                            src={profileAvatarSrc}
                                        />
                                    ) : (
                                        <Icon name='avatar' size={100} />
                                    )}
                                    <button
                                        aria-label='프로필 이미지 변경'
                                        className='w-[35px] h-[35px] flex justify-center items-center absolute right-0 bottom-0 border-1 border-(--color-tomato-50) rounded-full bg-primary hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
                                        disabled={!user?.id || isAvatarUploading}
                                        onClick={handleAvatarPickerOpen}
                                        type='button'
                                    >
                                        <Icon name='edit' color='color-white' size={20} />
                                    </button>
                                    <input
                                        accept='image/*'
                                        className='hidden'
                                        onChange={handleAvatarChange}
                                        ref={fileInputRef}
                                        type='file'
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Button
                                        disabled={!user?.id || isAvatarUploading}
                                        onClick={handleAvatarPickerOpen}
                                        variant='outline'
                                    >
                                        {isAvatarUploading ? '업로드 중...' : '이미지 업로드'}
                                    </Button>
                                    <Button
                                        disabled={!hasAvatar || isAvatarUploading}
                                        onClick={handleAvatarDeleteConfirm}
                                        variant='ghost'
                                    >
                                        이미지 삭제
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='my-4'>
                            <p className='ml-1 mb-1'>닉네임</p>
                            <div className='flex'>
                                <Input className='mr-2' value={name} onChange={(e) => setName(e.target.value)} />
                                <Button onClick={handleNameSave} disabled={isNameSaveDisabled}>
                                    저장
                                </Button>
                            </div>
                        </div>

                        <div className='my-4'>
                            <p className='ml-1 mb-1'>계정 삭제</p>

                            <div className='flex p-5 justify-between items-center border-1 border-(--color-neutral-lighter) rounded-xl'>
                                <p className='text-neutral-darker'>계정 삭제 시 모든 기록은 삭제됩니다.</p>
                                <Button variant='outline' onClick={handleDeleteConfirm}>
                                    삭제하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={panelClassName}>
                    <div className='w-full max-w-[450px]'>
                        <SectionHeader title='설정' type='sub' />

                        <div className='my-4'>
                            <p className='ml-1 mb-1'>타이머</p>

                            <div className='flex p-5 flex-col gap-5 border-1 border-(--color-neutral-lighter) rounded-xl'>
                                <div className='flex justify-between items-center w-full'>
                                    <p>집중 시간</p>
                                    <div className='flex w-[120px] justify-between'>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setFocusTime(Math.max(5, focusTime - 5))}
                                        >
                                            <span className='relative top-[-2px]'>-</span>
                                        </button>
                                        <p>{focusTime}분</p>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setFocusTime(focusTime + 5)}
                                        >
                                            <span className='relative top-[-2px]'>+</span>
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <p>단기 휴식</p>
                                    <div className='flex w-[120px] justify-between'>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setShortBreakTime(Math.max(5, shortBreakTime - 5))}
                                        >
                                            <span className='relative top-[-2px]'>-</span>
                                        </button>
                                        <p>{shortBreakTime}분</p>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setShortBreakTime(shortBreakTime + 5)}
                                        >
                                            <span className='relative top-[-2px]'>+</span>
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <p>장 휴식</p>
                                    <div className='flex w-[120px] justify-between'>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setLongBreakTime(Math.max(5, longBreakTime - 5))}
                                        >
                                            <span className='relative top-[-2px]'>-</span>
                                        </button>
                                        <p>{longBreakTime}분</p>
                                        <button
                                            className='flex w-[25px] h-[25px] justify-center items-center text-xl border rounded-md'
                                            onClick={() => setLongBreakTime(longBreakTime + 5)}
                                        >
                                            <span className='relative top-[-2px]'>+</span>
                                        </button>
                                    </div>
                                </div>

                                <div className='flex gap-3'>
                                    <Button
                                        className='grow !bg-neutral-lighter !text-black'
                                        onClick={handleResetSettings}
                                    >
                                        설정값 초기화
                                    </Button>
                                    <Button
                                        className='grow'
                                        onClick={handleSaveSettings}
                                        disabled={isActiveSettingSaveBtn()}
                                    >
                                        저장
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='my-4'>
                            <p className='ml-1 mb-1'>투두리스트</p>

                            <div className='flex p-5 flex-col gap-5 border-1 border-(--color-neutral-lighter) rounded-xl'>
                                <div className='flex justify-between items-center w-full'>
                                    <div>
                                        <p>미완료 작업 자동 이월</p>
                                        <p className='text-sm text-neutral-darker'>
                                            어제 미완료한 작업을 오늘로 이동합니다.
                                        </p>
                                    </div>
                                    <Toggle checked={todoToggle} onCheckedChange={handleAutoCarryTodo} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </CenteredLayout>
        </Container>
    );
}
