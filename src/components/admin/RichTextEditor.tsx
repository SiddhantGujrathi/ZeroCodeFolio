'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Pilcrow, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';

// TypeScript Definitions
type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
type AlignableElement = { align?: 'left' | 'center' | 'right' | 'justify' };
type ParagraphElement = { type: 'paragraph'; children: CustomText[] } & AlignableElement;
type HeadingOneElement = { type: 'heading-one'; children: CustomText[] } & AlignableElement;
type HeadingTwoElement = { type: 'heading-two'; children: CustomText[] } & AlignableElement;
type BulletedListElement = { type: 'bulleted-list'; children: ListItemElement[] } & AlignableElement;
type NumberedListElement = { type: 'numbered-list'; children: ListItemElement[] } & AlignableElement;
type ListItemElement = { type: 'list-item'; children: CustomText[] } & AlignableElement;
type CustomElement = ParagraphElement | HeadingOneElement | HeadingTwoElement | BulletedListElement | NumberedListElement | ListItemElement;
type FormattedText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };
type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const toggleMark = (editor: CustomEditor, format: 'bold' | 'italic' | 'underline') => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: CustomEditor, format: 'bold' | 'italic' | 'underline') => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as Partial<SlateElement>;
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<SlateElement>;
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as SlateElement;
    Transforms.wrapNodes(editor, block);
  }
};


const isBlockActive = (editor: CustomEditor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} style={style}>{children}</h1>;
    case 'heading-two':
        return <h2 {...attributes} style={style}>{children}</h2>;
    case 'bulleted-list':
      return <ul {...attributes} style={style}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} style={style}>{children}</ol>;
    case 'list-item':
      return <li {...attributes} style={style}>{children}</li>;
    default:
      return <p {...attributes} style={style}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const MarkButton = ({ format, icon: Icon }: { format: 'bold' | 'italic' | 'underline', icon: React.ElementType }) => {
  const editor = useSlate();
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-8 w-8", {
        'bg-muted': isMarkActive(editor, format),
      })}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

const BlockButton = ({ format, icon: Icon }: { format: string, icon: React.ElementType }) => {
    const editor = useSlate();
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("h-8 w-8", {
          'bg-muted': isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'),
        })}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };


export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  
  const parsedValue = useMemo(() => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // Not valid JSON, treat as plain text
      return [{ type: 'paragraph', children: [{ text: value || '' }] }];
    }
    return initialValue;
  }, [value]);


  return (
    <div className="border rounded-md">
      <Slate
        editor={editor}
        initialValue={parsedValue}
        onChange={(newValue) => {
          const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
          if (isAstChange) {
            const content = JSON.stringify(newValue);
            onChange(content);
          }
        }}
      >
        <div className="flex flex-wrap items-center gap-1 p-2 border-b">
            <MarkButton format="bold" icon={Bold} />
            <MarkButton format="italic" icon={Italic} />
            <MarkButton format="underline" icon={Underline} />
            <div className="mx-1 h-6 w-px bg-border" />
            <BlockButton format="heading-one" icon={Heading1} />
            <BlockButton format="heading-two" icon={Heading2} />
            <BlockButton format="paragraph" icon={Pilcrow} />
            <div className="mx-1 h-6 w-px bg-border" />
            <BlockButton format="numbered-list" icon={ListOrdered} />
            <BlockButton format="bulleted-list" icon={List} />
            <div className="mx-1 h-6 w-px bg-border" />
            <BlockButton format="left" icon={AlignLeft} />
            <BlockButton format="center" icon={AlignCenter} />
            <BlockButton format="right" icon={AlignRight} />
            <BlockButton format="justify" icon={AlignJustify} />
        </div>
        <div className="p-4 prose prose-sm dark:prose-invert max-w-none focus-within:outline-none">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter your bio..."
              spellCheck
              autoFocus
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event as any)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(editor, mark as 'bold' | 'italic' | 'underline');
                  }
                }
              }}
            />
        </div>
      </Slate>
    </div>
  );
}
