import { Icon } from '@/components/ui/Icon';

import { badgeIconClassName, cx, getBadgeClassName, getBadgeIconSize } from './styles';
import type { BadgeProps } from './types';

export const Badge = ({ label, iconName, size = 'md', className, ...props }: BadgeProps) => {
    return (
        <span {...props} className={cx(getBadgeClassName({ size }), className)}>
            {iconName ? (
                <Icon className={badgeIconClassName} color='white' name={iconName} size={getBadgeIconSize(size)} />
            ) : null}
            <span>{label}</span>
        </span>
    );
};
