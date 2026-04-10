import { queryClient } from '@/api/queryClient';
import type { User } from '@/api/generated/model';
import { getGetMyProfileQueryKey, useDeleteMe, useGetMyProfile, useUpdateMyProfile } from '@/api/generated/users/users';
import { useModal, useToast } from '@/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAvatar, uploadUserAvatar } from './avatarStorage';
import { mapUserDtoToAuthUser } from './api';
import { useAuthStore } from './useAuthStore';

export const useMyProfileController = () => {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);
    const logout = useAuthStore((state) => state.logout);
    const [name, setName] = useState('');
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const avatarMenuRef = useRef<HTMLDivElement | null>(null);

    const { data: profile } = useGetMyProfile();
    const { mutateAsync: updateProfile, isPending: isProfileSaving } = useUpdateMyProfile();
    const { mutateAsync: deleteMe } = useDeleteMe();
    const { showToast } = useToast();
    const { showModal } = useModal();

    const profileAvatarSrc = user?.avatarSrc ?? null;
    const hasAvatar = Boolean(profileAvatarSrc);
    const canEditAvatar = Boolean(user?.id) && !isAvatarUploading;

    useEffect(() => {
        if (profile) {
            setName(profile.nickname ?? '');
        }
    }, [profile]);

    useEffect(() => {
        if (!isAvatarMenuOpen) {
            return;
        }

        const handleDocumentMouseDown = (event: MouseEvent) => {
            if (!avatarMenuRef.current?.contains(event.target as Node)) {
                setIsAvatarMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleDocumentMouseDown);
        };
    }, [isAvatarMenuOpen]);

    const isNameSaveDisabled = useMemo(() => {
        const currentNickname = profile?.nickname ?? '';
        return isProfileSaving || !(name.length >= 2 && name.length <= 20 && name !== currentNickname);
    }, [isProfileSaving, name, profile]);

    const syncProfileCache = (nextProfile: User) => {
        queryClient.setQueryData(getGetMyProfileQueryKey(), nextProfile);
        updateUser(mapUserDtoToAuthUser(nextProfile));
    };

    const handleNameSave = async () => {
        if (isNameSaveDisabled || !profile) {
            return;
        }

        const previousProfile = queryClient.getQueryData<User>(getGetMyProfileQueryKey()) ?? profile;
        const optimisticProfile: User = {
            ...previousProfile,
            nickname: name,
        };

        syncProfileCache(optimisticProfile);

        try {
            const nextProfile = await updateProfile({ data: { nickname: name } });
            syncProfileCache(nextProfile);
            showToast({ message: '닉네임이 저장되었어요', iconName: 'check', duration: 3000 });
        } catch {
            syncProfileCache(previousProfile);
            showToast({ message: '닉네임 저장에 실패했습니다', iconName: 'error', duration: 3000 });
        }
    };

    const handleDeleteAccount = async () => {
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

    const handleDeleteConfirm = () => {
        showModal({
            title: '계정 삭제',
            description: `삭제한 기록은 복구할 수 없어요\n그래도 삭제하시겠어요?`,
            tone: 'danger',
            confirmLabel: '삭제하기',
            onConfirm: handleDeleteAccount,
        });
    };

    const handleAvatarPickerOpen = () => {
        if (!user?.id || isAvatarUploading) {
            return;
        }

        setIsAvatarMenuOpen(false);
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
        setIsAvatarMenuOpen(false);
        showModal({
            title: '프로필 이미지 삭제',
            description: '현재 프로필 이미지를 삭제하고 기본 아이콘으로 되돌릴까요?',
            confirmLabel: '삭제하기',
            tone: 'danger',
            onConfirm: handleAvatarDelete,
        });
    };

    const handleAvatarEditClick = () => {
        if (!hasAvatar) {
            handleAvatarPickerOpen();
            return;
        }

        setIsAvatarMenuOpen((prev) => !prev);
    };

    return {
        profile: {
            avatarSrc: profileAvatarSrc,
            isNameSaveDisabled,
            isSaving: isProfileSaving,
            name,
            setName,
            save: handleNameSave,
        },
        avatar: {
            canEdit: canEditAvatar,
            confirmDelete: handleAvatarDeleteConfirm,
            fileInputRef,
            hasAvatar,
            isMenuOpen: isAvatarMenuOpen,
            isUploading: isAvatarUploading,
            menuRef: avatarMenuRef,
            onEditClick: handleAvatarEditClick,
            onFileChange: handleAvatarChange,
            openPicker: handleAvatarPickerOpen,
        },
        account: {
            confirmDelete: handleDeleteConfirm,
        },
    };
};
