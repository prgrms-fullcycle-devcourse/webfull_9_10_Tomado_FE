import { Icon } from '@/components/ui/Icon';

import { cx, getTagClassName, getTagIconSize, tagIconClassName } from './styles';
import type { TagProps } from './types';

export const Tag = ({ label, iconName, size = 'md', className, ...props }: TagProps) => {
    return (
        <span {...props} className={cx(getTagClassName({ size }), className)}>
            {iconName ? <Icon className={tagIconClassName} name={iconName} size={getTagIconSize(size)} /> : null}
            <span>{label}</span>
        </span>
    );
};
