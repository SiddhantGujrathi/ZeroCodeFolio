'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addSkill, addProject, addAchievement, type AdminFormState } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { stringToIconMap } from '@/lib/icon-map';
import { Textarea } from '@/components/ui/textarea';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  );
}

const availableIcons = Object.keys(stringToIconMap);

export function SkillForm() {
  const initialState: AdminFormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(addSkill, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
      });
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Add New Skill</CardTitle>
        <CardDescription>Add a new skill to your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" name="name" placeholder="e.g., React" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name</Label>
            <Input id="icon" name="icon" placeholder="e.g., ReactIcon" required />
            <p className="text-xs text-muted-foreground pt-1">
              Available icons: {availableIcons.join(', ')}
            </p>
            {state.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon}</p>}
          </div>
          <SubmitButton>Add Skill</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectForm() {
    const initialState: AdminFormState = { message: null, errors: {}, success: false };
    const [state, dispatch] = useFormState(addProject, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
  
    useEffect(() => {
      if (state.message) {
        toast({
          variant: state.success ? 'default' : 'destructive',
          title: state.success ? 'Success!' : 'Error',
          description: state.message,
        });
        if (state.success) {
          formRef.current?.reset();
        }
      }
    }, [state, toast]);

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Showcase a new project in your portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title-project">Project Title</Label>
                        <Input id="title-project" name="title" placeholder="My Awesome Project" required />
                         {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description-project">Description</Label>
                        <Textarea id="description-project" name="description" placeholder="A brief description of the project." required />
                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags-project">Tags (comma-separated)</Label>
                        <Input id="tags-project" name="tags" placeholder="React, Next.js, Tailwind CSS" required />
                        {state.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image-project">Image URL</Label>
                        <Input id="image-project" name="image" type="url" placeholder="https://placehold.co/600x400.png" />
                        <p className="text-xs text-muted-foreground pt-1">Leave blank for a default placeholder.</p>
                        {state.errors?.image && <p className="text-sm text-destructive">{state.errors.image}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageAiHint-project">Image AI Hint</Label>
                        <Input id="imageAiHint-project" name="imageAiHint" placeholder="e.g., 'abstract code'" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="websiteUrl-project">Website URL</Label>
                        <Input id="websiteUrl-project" name="websiteUrl" type="url" placeholder="https://example.com" />
                         {state.errors?.websiteUrl && <p className="text-sm text-destructive">{state.errors.websiteUrl}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl-project">GitHub URL</Label>
                        <Input id="githubUrl-project" name="githubUrl" type="url" placeholder="https://github.com/user/repo" />
                         {state.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
                    </div>
                    <SubmitButton>Add Project</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function AchievementForm() {
    const initialState: AdminFormState = { message: null, errors: {}, success: false };
    const [state, dispatch] = useFormState(addAchievement, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
  
    useEffect(() => {
      if (state.message) {
        toast({
          variant: state.success ? 'default' : 'destructive',
          title: state.success ? 'Success!' : 'Error',
          description: state.message,
        });
        if (state.success) {
          formRef.current?.reset();
        }
      }
    }, [state, toast]);

    return (
         <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>Add New Achievement</CardTitle>
                <CardDescription>Log a new achievement or certification.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title-achievement">Title</Label>
                        <Input id="title-achievement" name="title" placeholder="e.g., 5-Star Coder on HackerRank" required />
                         {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description-achievement">Description</Label>
                        <Textarea id="description-achievement" name="description" placeholder="A brief description of the achievement." required />
                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <SubmitButton>Add Achievement</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}
