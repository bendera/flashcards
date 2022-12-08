import { FC, useEffect, useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import { Button } from '@blueprintjs/core';

const customStyleMap = {
  RED: {
    color: '#fff',
    backgroundColor: 'red',
  },
};

const CardEditor: FC = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const handleBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const handleItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const handleUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const handleRedClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'RED'));
  };

  useEffect(() => {
    const options = {
      inlineStyles: {
        RED: {
          attributes: {
            class: 'red',
          },
        },
      },
    };
    console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    console.log(stateToHTML(editorState.getCurrentContent(), options));
  }, [editorState]);

  return (
    <div>
      <Button icon="bold" minimal onClick={handleBoldClick}></Button>
      <Button icon="italic" minimal onClick={handleItalicClick}></Button>
      <Button icon="underline" minimal onClick={handleUnderlineClick}></Button>
      <Button minimal onClick={handleRedClick}>
        red
      </Button>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={customStyleMap}
      />
    </div>
  );
};

export default CardEditor;
