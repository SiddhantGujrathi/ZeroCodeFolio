// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import Image from 'next/image';
import React from 'react';
import { stringToIconMap } from '@/lib/icon-map';
import type { Skill } from '@/models/Skill';

// We need a client version of Skill for the preview component
type ClientSkill = Omit<Skill, '_id' | 'collection'> & { _id?: string };

interface SkillHexagonProps {
    skill: ClientSkill;
}

export function SkillHexagon({ skill }: SkillHexagonProps) {
    const IconComponent = skill.icon ? stringToIconMap[skill.icon] : null;

    return (
        <div className="hexagon-container">
            <div className="hexagon">
                <div className="relative h-12 w-12 flex items-center justify-center">
                {(() => {
                    if (skill.image && typeof skill.image === 'string') {
                        return <Image src={skill.image} alt={skill.title} fill className="object-contain" data-ai-hint={skill.imageAiHint || 'skill icon'} />;
                    }
                    if (IconComponent) {
                        return <IconComponent className="h-10 w-10 text-primary" />;
                    }
                    return <Image src={'https://placehold.co/100x100.png'} alt={skill.title} fill className="object-contain" data-ai-hint={skill.imageAiHint || 'skill icon'} />;
                })()}
                </div>
                <p className="mt-1 font-semibold text-sm">{skill.title}</p>
            </div>
        </div>
    );
}
