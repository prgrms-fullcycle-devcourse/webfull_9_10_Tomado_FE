import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

type MdEditorProps = {
    content: string;
    contentChange: (value?: string) => void;
};

export type MdEditorHandle = {
    focusContent: () => void;
};

const MdEditor = forwardRef<MdEditorHandle, MdEditorProps>((props, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(300);

    useImperativeHandle(ref, () => ({
        focusContent: () => {
            wrapperRef.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus();
        },
    }));

    useEffect(() => {
        if (!wrapperRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            setHeight(entry.contentRect.height);
        });

        observer.observe(wrapperRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className='w-full flex-1 min-h-0' ref={wrapperRef} data-color-mode='light'>
            <MDEditor
                height={height}
                autoFocus={false}
                value={props.content}
                onChange={props.contentChange}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
                textareaProps={{
                    placeholder: '마크다운 텍스트를 입력하세요.',
                }}
            />
        </div>
    );
});

MdEditor.displayName = 'MdEditor';

export default MdEditor;
