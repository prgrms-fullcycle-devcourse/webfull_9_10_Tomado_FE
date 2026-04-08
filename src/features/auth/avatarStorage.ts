import type { User } from '@/api/generated/model/user';
import { customInstance } from '@/api/mutator/custom-instance';

const avatarApiBasePath = '/api/v1/users/me/avatar';

export const uploadUserAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return customInstance<User>(avatarApiBasePath, {
        method: 'POST',
        body: formData,
    });
};

export const deleteUserAvatar = async () => customInstance<User>(avatarApiBasePath, { method: 'DELETE' });
