// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateLayout, type AdminFormState } from '@/app/dashboard/actions';
import type { Layout } from '@/models/Layout';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full mt-4" disabled={pending}>
            {pending ? 'Saving Layout...' : 'Save Layout'}
        </Button>
    );
}

const allPossibleSections = ['About', 'Skills', 'WorkExperience', 'Projects', 'Education', 'Achievements', 'Contact'];

export function LayoutManager({ layout }: { layout: Layout }) {
    const [navLinks, setNavLinks] = useState(layout.navLinks);
    const [sections, setSections] = useState(layout.sections);

    const [state, dispatch] = useActionState(updateLayout, { message: null, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Success!' : 'Error',
                description: state.message,
            });
        }
    }, [state, toast]);

    const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down') => {
        const newList = [...list];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return newList;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        return newList;
    };

    const toggleSectionVisibility = (sectionName: string) => {
        setSections(currentSections => {
            const isVisible = currentSections.includes(sectionName);
            if (isVisible) {
                // Hide: remove from list
                return currentSections.filter(s => s !== sectionName);
            } else {
                // Show: add to list while preserving order of other visible items
                const visibleSections = allPossibleSections.filter(s => currentSections.includes(s));
                const newVisibleSections = [...visibleSections, sectionName];
                
                // Sort the new list based on the canonical order of all possible sections
                return allPossibleSections.filter(s => newVisibleSections.includes(s));
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Website Structure</CardTitle>
                <CardDescription>
                    Reorder navigation links and homepage sections. Changes will be reflected on the live site after saving.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch}>
                    <input type="hidden" name="navLinks" value={JSON.stringify(navLinks)} />
                    <input type="hidden" name="sections" value={JSON.stringify(sections)} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2">Navigation Bar Order</h3>
                            <div className="space-y-2 rounded-lg border p-2">
                                {navLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                                        <span>{link.name}</span>
                                        <div className="flex gap-1">
                                            <Button type="button" size="icon" variant="ghost" disabled={index === 0} onClick={() => setNavLinks(moveItem(navLinks, index, 'up'))}><ArrowUp className="h-4 w-4" /></Button>
                                            <Button type="button" size="icon" variant="ghost" disabled={index === navLinks.length - 1} onClick={() => setNavLinks(moveItem(navLinks, index, 'down'))}><ArrowDown className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Homepage Sections Order & Visibility</h3>
                             <div className="space-y-2 rounded-lg border p-2">
                                {allPossibleSections.map((sectionName) => {
                                    const isVisible = sections.includes(sectionName);
                                    const currentIndex = isVisible ? sections.indexOf(sectionName) : -1;

                                    return (
                                        <div key={sectionName} className={`flex items-center justify-between rounded-md p-2 ${isVisible ? 'bg-muted/50' : 'bg-muted/20 opacity-60'}`}>
                                            <span>{sectionName}</span>
                                            <div className="flex gap-1">
                                                <Button type="button" size="icon" variant="ghost" onClick={() => toggleSectionVisibility(sectionName)}>
                                                    {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </Button>
                                                <Button type="button" size="icon" variant="ghost" disabled={!isVisible || currentIndex === 0} onClick={() => setSections(moveItem(sections, currentIndex, 'up'))}><ArrowUp className="h-4 w-4" /></Button>
                                                <Button type="button" size="icon" variant="ghost" disabled={!isVisible || currentIndex === sections.length - 1} onClick={() => setSections(moveItem(sections, currentIndex, 'down'))}><ArrowDown className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
