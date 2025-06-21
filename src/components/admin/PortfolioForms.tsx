'use client';

import { useFormStatus } from 'react-dom';
import { 
    updateAbout, addSkill, addProject, addAchievement, addCertification, 
    addEducation, addWorkExperience, addProfileLink, type AdminFormState 
} from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, useRef, useState, type ComponentProps } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { stringToIconMap } from '@/lib/icon-map';
import type { About } from '@/models/About';

type Client<T> = Omit<T, '_id' | 'collection'> & { _id?: string };

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  );
}

function ImageUpload({ fieldName, label, description, currentImage, error, ...props }: { 
    fieldName: string, label: string, description: string, currentImage?: string | null, error?: string[] 
} & ComponentProps<'input'>) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const file = e.clipboardData.items?.[0]?.getAsFile();
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            e.preventDefault();
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2 p-4 border-2 border-dashed rounded-lg text-center hover:border-primary" onPaste={handlePaste}>
                    <p className="text-xs text-muted-foreground">{description}</p>
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="text-sm file:mr-2 file:text-muted-foreground" />
                    <input type="hidden" name={fieldName} value={preview || ''} />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                {preview && (
                    <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-md border">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                    </div>
                )}
            </div>
        </div>
    )
}

function useFormFeedback(state: AdminFormState | null, formRef: React.RefObject<HTMLFormElement>, onReset?: () => void) {
  const { toast } = useToast();
  useEffect(() => {
    if (state?.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
      });
      if (state.success) {
        formRef.current?.reset();
        onReset?.();
      }
    }
  }, [state, toast, formRef, onReset]);
}

const availableIcons = Object.keys(stringToIconMap);

export function AboutForm({ about }: { about: Client<About> | null }) {
    const initialState: AdminFormState = { message: null, errors: {}, success: false };
    const [state, dispatch] = useActionState(updateAbout, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Manage About Section</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name</Label><Input name="name" defaultValue={about?.name} />{state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}</div>
                        <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" defaultValue={about?.email} />{state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}</div>
                        <div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={about?.phone} />{state?.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone}</p>}</div>
                        <div className="space-y-2"><Label>Location</Label><Input name="location" defaultValue={about?.location} />{state?.errors?.location && <p className="text-sm text-destructive">{state.errors.location}</p>}</div>
                    </div>
                    <div className="space-y-2"><Label>Bio</Label><Textarea name="bio" defaultValue={about?.bio} />{state?.errors?.bio && <p className="text-sm text-destructive">{state.errors.bio}</p>}</div>
                    <div className="space-y-2"><Label>Resume URL</Label><Input name="resumeUrl" type="url" defaultValue={about?.resumeUrl} />{state?.errors?.resumeUrl && <p className="text-sm text-destructive">{state.errors.resumeUrl}</p>}</div>
                    <ImageUpload fieldName="profileImage" label="Profile Image" description="Upload/paste your profile picture." currentImage={about?.profileImage} error={state?.errors?.profileImage} />
                    <SubmitButton>Update About Section</SubmitButton>
                </form>
            </CardContent>
        </Card>
    )
}

export function SkillForm() {
  const [state, dispatch] = useActionState(addSkill, { message: null, errors: {}, success: false });
  const formRef = useRef<HTMLFormElement>(null);
  useFormFeedback(state, formRef);
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader><CardTitle>Add New Skill</CardTitle></CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-4">
          <div className="space-y-2"><Label>Skill Title</Label><Input name="title" placeholder="e.g., React" />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</div>
          <ImageUpload fieldName="image" label="Skill Image/Icon" description="Upload or paste an image for the skill." error={state?.errors?.image} />
          <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" placeholder="e.g., 'react logo'" />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
          <SubmitButton>Add Skill</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectForm() {
    const [state, dispatch] = useActionState(addProject, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);

    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add New Project</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Project Title</Label><Input name="title" /><>{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea name="description" />{state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}</div>
                    <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input name="tags" />{state?.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags}</p>}</div>
                    <ImageUpload fieldName="projectImage" label="Project Image" description="Upload/paste a project image." error={state?.errors?.projectImage} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
                    <div className="space-y-2"><Label>Website URL</Label><Input name="websiteUrl" type="url" />{state?.errors?.websiteUrl && <p className="text-sm text-destructive">{state.errors.websiteUrl}</p>}</div>
                    <div className="space-y-2"><Label>GitHub URL</Label><Input name="githubUrl" type="url" />{state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}</div>
                    <SubmitButton>Add Project</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function AchievementForm() {
    const [state, dispatch] = useActionState(addAchievement, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add New Achievement</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Title</Label><Input name="title" />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</div>
                    <div className="space-y-2"><Label>Description</Label><Textarea name="description" />{state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}</div>
                    <ImageUpload fieldName="image" label="Achievement Image" description="Upload/paste an image." error={state?.errors?.image} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
                    <SubmitButton>Add Achievement</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function CertificationForm() {
    const [state, dispatch] = useActionState(addCertification, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add New Certification</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Title</Label><Input name="title" />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</div>
                    <div className="space-y-2"><Label>Issued By</Label><Input name="issuedBy" />{state?.errors?.issuedBy && <p className="text-sm text-destructive">{state.errors.issuedBy}</p>}</div>
                    <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" />{state?.errors?.date && <p className="text-sm text-destructive">{state.errors.date}</p>}</div>
                    <div className="space-y-2"><Label>Certificate URL</Label><Input name="certificateUrl" type="url" />{state?.errors?.certificateUrl && <p className="text-sm text-destructive">{state.errors.certificateUrl}</p>}</div>
                    <ImageUpload fieldName="image" label="Certificate Image" description="Upload/paste an image." error={state?.errors?.image} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
                    <SubmitButton>Add Certification</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function EducationForm() {
    const [state, dispatch] = useActionState(addEducation, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add Education</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>College Name</Label><Input name="collegeName" />{state?.errors?.collegeName && <p className="text-sm text-destructive">{state.errors.collegeName}</p>}</div>
                    <div className="space-y-2"><Label>Degree Name</Label><Input name="degreeName" />{state?.errors?.degreeName && <p className="text-sm text-destructive">{state.errors.degreeName}</p>}</div>
                    <div className="space-y-2"><Label>Period</Label><Input name="period" placeholder="e.g., 2020-2024" />{state?.errors?.period && <p className="text-sm text-destructive">{state.errors.period}</p>}</div>
                    <div className="space-y-2"><Label>CGPA</Label><Input name="cgpa" />{state?.errors?.cgpa && <p className="text-sm text-destructive">{state.errors.cgpa}</p>}</div>
                    <div className="space-y-2"><Label>Icon</Label><Input name="icon" placeholder="e.g., GraduationCap" /><p className="text-xs text-muted-foreground pt-1">Available: {availableIcons.join(', ')}</p>{state?.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon}</p>}</div>
                    <div className="space-y-2"><Label>Icon Hint</Label><Input name="iconHint" />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton>Add Education</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function WorkExperienceForm() {
    const [state, dispatch] = useActionState(addWorkExperience, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add Work Experience</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Role</Label><Input name="role" />{state?.errors?.role && <p className="text-sm text-destructive">{state.errors.role}</p>}</div>
                    <div className="space-y-2"><Label>Company Name</Label><Input name="companyName" />{state?.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName}</p>}</div>
                    <div className="space-y-2"><Label>Description</Label><Textarea name="description" />{state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}</div>
                    <div className="space-y-2"><Label>Icon</Label><Input name="icon" placeholder="e.g., Briefcase" /><p className="text-xs text-muted-foreground pt-1">Available: {availableIcons.join(', ')}</p>{state?.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon}</p>}</div>
                    <div className="space-y-2"><Label>Icon Hint</Label><Input name="iconHint" />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton>Add Work Experience</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function ProfileLinkForm() {
    const [state, dispatch] = useActionState(addProfileLink, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    useFormFeedback(state, formRef);
    return (
        <Card className="border-0 shadow-none">
            <CardHeader><CardTitle>Add Profile Link</CardTitle></CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Platform</Label><Input name="platform" placeholder="e.g., GitHub" />{state?.errors?.platform && <p className="text-sm text-destructive">{state.errors.platform}</p>}</div>
                    <div className="space-y-2"><Label>URL</Label><Input name="url" type="url" />{state?.errors?.url && <p className="text-sm text-destructive">{state.errors.url}</p>}</div>
                    <div className="space-y-2"><Label>Icon</Label><Input name="icon" placeholder="e.g., Github" /><p className="text-xs text-muted-foreground pt-1">Available: {availableIcons.join(', ')}</p>{state?.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon}</p>}</div>
                    <div className="space-y-2"><Label>Icon Hint</Label><Input name="iconHint" />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton>Add Profile Link</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}
