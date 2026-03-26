import MDEditor from '@uiw/react-md-editor';

type MdEditorProps = {
    content: string;
    contentChange: (value?: string) => void;
};

const MdEditor = (props: MdEditorProps) => {
    return <MDEditor height={350} autoFocus={false} value={props.content} onChange={props.contentChange} />;
};

export default MdEditor;
