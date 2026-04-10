import { queryClient } from '@/api/queryClient';
import { getGetMyProfileQueryKey, getGetMySettingsQueryKey } from '@/api/generated/users/users';
import { deleteUserAvatar, mapUserDtoToAuthUser, uploadUserAvatar, useAuthStore } from '@/features/auth';
import { Input, Toggle } from '@/components/form';
import { CenteredLayout, Container, SectionHeader } from '@/components/layout';
import { Button, Icon } from '@/components/ui';
import { useModal, useToast } from '@/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useDeleteMe,
    useGetMyProfile,
    useGetMySettings,
    useUpdateMyProfile,
    useUpdateMySettings,
} from '@/api/generated/users/users';

export default function My() {
    const panelClassName =
        'flex h-full min-h-0 w-full flex-col items-center rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
    const profileImageClassName = 'block size-full rounded-full object-cover bg-primary';
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const logout = useAuthStore((state) => state.logout);
    const [name, setName] = useState('');
    const [focusTime, setFocusTime] = useState(0);
    const [shortBreakTime, setShortBreakTime] = useState(0);
    const [longBreakTime, setLongBreakTime] = useState(0);
    const [todoToggle, setTodoToggle] = useState(true);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data: profile } = useGetMyProfile();
    const { data: settings } = useGetMySettings();
    const { mutateAsync: updateProfile } = useUpdateMyProfile();
    const { mutateAsync: updateSettings } = useUpdateMySettings();
    const { mutateAsync: deleteMe } = useDeleteMe();

    const { showToast } = useToast();
    const { showModal } = useModal();

    const initialTime = {
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 30,
    };

    const profileAvatarSrc = user?.avatarSrc ?? null;
    const hasAvatar = Boolean(profileAvatarSrc);

    useEffect(() => {
        if (profile) {
            setName(profile.nickname ?? '');
        }
    }, [profile]);

    useEffect(() => {
        if (settings) {
            setFocusTime(settings.focus_min || initialTime.focusTime);
            setShortBreakTime(settings.short_break_min || initialTime.shortBreakTime);
            setLongBreakTime(settings.long_break_min || initialTime.longBreakTime);
            setTodoToggle(settings.auto_carry_todo ?? true);
        }
    }, [settings]);

    const isNameSaveDisabled = useMemo(() => {
        const currentNickname = profile?.nickname ?? '';
        return !(name.length >= 2 && name.length <= 20 && name !== currentNickname);
    }, [name, profile]);

    const handleNameSave = async () => {
        try {
            await updateProfile({ data: { nickname: name } });
            void queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
            showToast({ message: '닉네임이 저장되었어요', iconName: 'check', duration: 3000 });
        } catch {
            showToast({ message: '닉네임 저장에 실패했습니다', iconName: 'error', duration: 3000 });
        }
    };

    const handleDeleteAcount = async () => {
        try {
            await deleteMe();
            logout();
            await queryClient.clear();
            showToast({
                message: '계정이 삭제되었어요',
                iconName: 'check',
                duration: 3000,
            });
            navigate('/', { replace: true });
        } catch {
            showToast({
                message: '계정 삭제에 실패했어요',
                iconName: 'error',
                duration: 3000,
            });
        }
    };

    const isActiveSettingSaveBtn = (): boolean => {
        if (!settings) return true;

        if (
            focusTime === settings.focus_min &&
            shortBreakTime === settings.short_break_min &&
            longBreakTime === settings.long_break_min
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

    const handleSaveSettings = async () => {
        try {
            await updateSettings({
                data: {
                    focus_min: focusTime,
                    short_break_min: shortBreakTime,
                    long_break_min: longBreakTime,
                },
            });
            void queryClient.invalidateQueries({ queryKey: getGetMySettingsQueryKey() });
            showToast({ message: '설정이 저장되었어요', iconName: 'check', duration: 3000 });
        } catch {
            showToast({ message: '설정 저장에 실패했습니다', iconName: 'error', duration: 3000 });
        }
    };

    const handleAutoCarryTodo = async () => {
        const newValue = !todoToggle;
        setTodoToggle(newValue);

        try {
            await updateSettings({
                data: {
                    auto_carry_todo: newValue,
                },
            });
            void queryClient.invalidateQueries({ queryKey: getGetMySettingsQueryKey() });
        } catch {
            setTodoToggle(!newValue);
            showToast({ message: '투두 설정 변경에 실패했습니다', iconName: 'error', duration: 3000 });
        }
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
            updateUser(mapUserDtoToAuthUser(nextUser));
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
            updateUser(mapUserDtoToAuthUser(nextUser));
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
