import type { ChangeEvent } from 'react';

import { TextArea } from '@@/form';
import { RETRO_CATEGORY_NAME, RETRO_FORM } from '@/features/log/retroQueryString';

type RetroKey =
    | typeof RETRO_CATEGORY_NAME.TECH
    | typeof RETRO_CATEGORY_NAME.DECISION
    | typeof RETRO_CATEGORY_NAME.COMMUNICATION
    | typeof RETRO_CATEGORY_NAME.EMOTION;

interface Props {
    content: Record<string, Record<string, string>>;
    selectedCategory: string;
    onChangeTextarea: (e: ChangeEvent<HTMLTextAreaElement>, type: RetroKey, key: string) => void;
}

const isRetroKey = (value: string): value is RetroKey => Object.values(RETRO_CATEGORY_NAME).includes(value as RetroKey);

function RetroItem({ content, selectedCategory, onChangeTextarea }: Props) {
    const categoryKey = isRetroKey(selectedCategory) ? selectedCategory : undefined;
    const retroItems = categoryKey
        ? Object.entries(RETRO_FORM[categoryKey.toUpperCase() as keyof typeof RETRO_FORM] ?? {})
        : [];

    return (
        <div className='grid grid-cols-2 gap-3 w-full h-full auto-rows-fr'>
            {categoryKey &&
                retroItems.map(([fieldKey, field]) => (
                    <TextArea
                        key={fieldKey}
                        className='h-full flex flex-col min-h-0 [&_label+div]:flex-1 [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:resize-none [&_textarea]:overflow-y-auto'
                        label={field.label}
                        placeholder={field.placeholder}
                        value={content[categoryKey]?.[fieldKey]}
                        onChange={(e) => onChangeTextarea(e, categoryKey, fieldKey)}
                    />
                ))}
        </div>
    );
}

export default RetroItem;
