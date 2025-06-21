'use client';

import { useFormStatus } from 'react-dom';
import { addSkill, addProject, addAchievement, type AdminFormState } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { stringToIconMap } from '@/lib/icon-map';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

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
  const [state, dispatch] = useActionState(addSkill, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
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
            {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name</Label>
            <Input id="icon" name="icon" placeholder="e.g., ReactIcon" required />
            <p className="text-xs text-muted-foreground pt-1">
              Available icons: {availableIcons.join(', ')}
            </p>
            {state?.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon}</p>}
          </div>
          <SubmitButton>Add Skill</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectForm() {
    const initialState: AdminFormState = { message: null, errors: {}, success: false };
    const [state, dispatch] = useActionState(addProject, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    useEffect(() => {
      if (state?.message) {
        toast({
          variant: state.success ? 'default' : 'destructive',
          title: state.success ? 'Success!' : 'Error',
          description: state.message,
        });
        if (state.success) {
          formRef.current?.reset();
          setImagePreview(null);
        }
      }
    }, [state, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    e.preventDefault(); 
                    break;
                }
            }
        }
    };

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
                         {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description-project">Description</Label>
                        <Textarea id="description-project" name="description" placeholder="A brief description of the project." required />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags-project">Tags (comma-separated)</Label>
                        <Input id="tags-project" name="tags" placeholder="React, Next.js, Tailwind CSS" required />
                        {state?.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags}</p>}
                    </div>
                    <div 
                        className="space-y-2 rounded-lg border-2 border-dashed p-4 text-center hover:border-primary"
                        onPaste={handlePaste}
                    >
                        <Label htmlFor="image-project-file" className="cursor-pointer">Project Image</Label>
                        <p className="text-xs text-muted-foreground">Upload a file or paste an image here. Leave blank for a default placeholder.</p>
                        <Input 
                            id="image-project-file" 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange} 
                            className="text-sm file:mr-2 file:text-muted-foreground"
                        />
                        <input type="hidden" name="projectImage" value={imagePreview || ''} />
                         {state?.errors?.projectImage && <p className="text-sm text-destructive">{state.errors.projectImage}</p>}
                    </div>

                    {imagePreview && (
                        <div className="mt-4 space-y-2">
                            <Label>Image Preview</Label>
                            <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-md border">
                                <Image src={imagePreview} alt="Project preview" fill className="object-cover" />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="imageAiHint-project">Image AI Hint</Label>
                        <Input id="imageAiHint-project" name="imageAiHint" placeholder="e.g., 'abstract code'" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="websiteUrl-project">Website URL</Label>
                        <Input id="websiteUrl-project" name="websiteUrl" type="url" placeholder="https://example.com" />
                         {state?.errors?.websiteUrl && <p className="text-sm text-destructive">{state.errors.websiteUrl}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl-project">GitHub URL</Label>
                        <Input id="githubUrl-project" name="githubUrl" type="url" placeholder="https://github.com/user/repo" />
                         {state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
                    </div>
                    <SubmitButton>Add Project</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function AchievementForm() {
    const initialState: AdminFormState = { message: null, errors: {}, success: false };
    const [state, dispatch] = useActionState(addAchievement, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
  
    useEffect(() => {
      if (state?.message) {
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
                         {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description-achievement">Description</Label>
                        <Textarea id="description-achievement" name="description" placeholder="A brief description of the achievement." required />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <SubmitButton>Add Achievement</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}
