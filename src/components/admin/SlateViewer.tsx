'use client';
import React, { Fragment } from 'react';
import { Text } from 'slate';

const serialize = (nodes: any[]): React.ReactNode => {
    if (!nodes || !Array.isArray(nodes)) {
        return null;
    }

    return nodes.map((node, i) => {
        if (Text.isText(node)) {
            let textEl: React.ReactNode = node.text;
            if (node.bold) {
                textEl = <strong key={`bold-${i}`}>{textEl}</strong>;
            }
            if (node.italic) {
                textEl = <em key={`italic-${i}`}>{textEl}</em>;
            }
            if (node.underline) {
                textEl = <u key={`underline-${i}`}>{textEl}</u>;
            }
            return <Fragment key={i}>{textEl}</Fragment>;
        }

        const children = serialize(node.children);
        const style = { textAlign: node.align } as React.CSSProperties;


        switch (node.type) {
            case 'heading-one':
                return <h1 key={i} className="text-3xl font-bold mb-4" style={style}>{children}</h1>;
            case 'heading-two':
                return <h2 key={i} className="text-2xl font-bold mb-3" style={style}>{children}</h2>;
            case 'paragraph':
                return <p key={i} className="mb-4 last:mb-0" style={style}>{children}</p>;
            case 'bulleted-list':
                return <ul key={i} className="list-disc pl-5 space-y-2 mb-4" style={style}>{children}</ul>;
            case 'numbered-list':
                return <ol key={i} className="list-decimal pl-5 space-y-2 mb-4" style={style}>{children}</ol>;
            case 'list-item':
                return <li key={i} style={style}>{children}</li>;
            default:
                return <p key={i} style={style}>{children}</p>;
        }
    });
};

export function SlateViewer({ value }: { value?: string | null }) {
    if (!value) {
        return null;
    }

    let parsedValue;
    try {
        parsedValue = JSON.parse(value);
        if (!Array.isArray(parsedValue)) {
            // It's probably an old plain string bio
            return <div className="text-balance whitespace-pre-wrap">{value}</div>;
        }
    } catch (e) {
        // If parsing fails, it's likely an old plain string bio
        return <div className="text-balance whitespace-pre-wrap">{value}</div>;
    }

    return <div className="text-balance prose prose-sm dark:prose-invert max-w-none">{serialize(parsedValue)}</div>;
}
