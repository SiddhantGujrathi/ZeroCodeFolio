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
import { Trash2 } from 'lucide-react';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setPreview(currentImage || null);
    }, [currentImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                if (hiddenInputRef.current) {
                    hiddenInputRef.current.value = result;
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = '';
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
                        const result = reader.result as string;
                        setPreview(result);
                        if (hiddenInputRef.current) {
                            hiddenInputRef.current.value = result;
                        }
                    };
                    reader.readAsDataURL(file);
                    e.preventDefault();
                    break;
                }
            }
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2 p-4 border-2 border-dashed rounded-lg text-center hover:border-primary" onPaste={handlePaste}>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="text-sm file:mr-2 file:text-muted-foreground" ref={fileInputRef} />
                    <input type="hidden" name={fieldName} ref={hiddenInputRef} defaultValue={preview || ''} />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                {preview && (
                    <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-md border">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 opacity-80 hover:opacity-100"
                            onClick={handleRemoveImage}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function useFormFeedback(state: AdminFormState | null, formRef: React.RefObject<HTMLFormElement>, onReset?: () => void) {
  const { toast } = useToast();
  useEffect(() => {
    if (!state) return;
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
      });
      if (state.success) {
        formRef.current?.reset();
        if (onReset) onReset();
      }
    }
  }, [state, toast, formRef, onReset]);
}

const availableIcons = Object.keys(stringToIconMap);


function AboutFieldForm({ fieldName, label, defaultValue, children }: {
    fieldName: keyof Client<About>,
    label: string,
    defaultValue?: string | null,
    children: React.ReactNode,
}) {
    const [state, dispatch] = useActionState(updateAbout, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
      if (!state) return;
      if (state.message) {
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
      }
    }, [state, toast]);

    return (
        <div className="space-y-3">
            <form ref={formRef} action={dispatch} className="space-y-3">
                <div className="space-y-2">
                    <Label className="font-semibold">{label}</Label>
                    {children}
                </div>
                {state?.errors?.[fieldName] && <p className="text-sm text-destructive mt-1">{state.errors[fieldName][0]}</p>}
                <Button type="submit" size="sm" className="w-full" disabled={useFormStatus().pending}>
                    {useFormStatus().pending ? 'Saving...' : (defaultValue ? `Update ${label}` : `Add ${label}`)}
                </Button>
            </form>
        </div>
    )
}

export function AboutForm({ about }: { about: Client<About> | null }) {
    const [imagePreview, setImagePreview] = useState(about?.profileImage || null);
    
    const handleImageReset = () => {
        const removeButton = document.querySelector('#about-image-form button[variant="destructive"]') as HTMLButtonElement;
        if (removeButton) removeButton.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage About Section</CardTitle>
                <CardDescription>Update each field individually. Changes are saved one by one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <AboutFieldForm fieldName="name" label="Name" defaultValue={about?.name}>
                        <Input name="name" defaultValue={about?.name ?? ''} />
                    </AboutFieldForm>
                    <AboutFieldForm fieldName="email" label="Email" defaultValue={about?.email}>
                        <Input name="email" type="email" defaultValue={about?.email ?? ''} />
                    </AboutFieldForm>
                    <AboutFieldForm fieldName="phone" label="Phone" defaultValue={about?.phone}>
                        <Input name="phone" defaultValue={about?.phone ?? ''} />
                    </AboutFieldForm>
                    <AboutFieldForm fieldName="location" label="Location" defaultValue={about?.location}>
                        <Input name="location" defaultValue={about?.location ?? ''} />
                    </AboutFieldForm>
                </div>
                
                <AboutFieldForm fieldName="bio" label="Bio" defaultValue={about?.bio}>
                    <Textarea name="bio" defaultValue={about?.bio ?? ''} className="min-h-[120px]" />
                </AboutFieldForm>

                <AboutFieldForm fieldName="resumeUrl" label="Resume URL" defaultValue={about?.resumeUrl}>
                    <Input name="resumeUrl" type="url" defaultValue={about?.resumeUrl ?? ''} />
                </AboutFieldForm>

                <div id="about-image-form">
                    <AboutFieldForm fieldName="profileImage" label="Profile Image" defaultValue={about?.profileImage}>
                        <ImageUpload 
                            fieldName="profileImage" 
                            label="" 
                            description="Upload or paste a new profile image to update it." 
                            currentImage={about?.profileImage}
                        />
                    </AboutFieldForm>
                </div>
            </CardContent>
        </Card>
    );
}

export function SkillForm() {
  const [state, dispatch] = useActionState(addSkill, { message: null, errors: {}, success: false });
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleReset = () => {
    const removeButton = formRef.current?.querySelector('button[type="button"][variant="destructive"]') as HTMLButtonElement;
    if (removeButton) removeButton.click();
  };
  
  useFormFeedback(state, formRef, handleReset);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Skill</CardTitle>
        <CardDescription>Add a new skill to be displayed in your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Title</Label>
            <Input name="title" placeholder="e.g., React" />
            {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
          </div>
          <ImageUpload fieldName="image" label="Skill Icon / Image" description="Upload/paste an image for the skill." error={state?.errors?.image} />
          <div className="space-y-2">
             <Label>Image AI Hint</Label>
             <Input name="imageAiHint" placeholder="e.g., 'java icon' or 'python logo'" />
             {state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint[0]}</p>}
          </div>
          <SubmitButton>Add Skill</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectForm() {
    const [state, dispatch] = useActionState(addProject, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const handleReset = () => {
        const removeButton = formRef.current?.querySelector('button[type="button"][variant="destructive"]') as HTMLButtonElement;
        if (removeButton) removeButton.click();
    };
    useFormFeedback(state, formRef, handleReset);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Showcase a new project you've worked on.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    <div className="space-y-2"><Label>Project Title</Label><Input name="title" />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}</div>
                    <div className="space-y-2"><Label>Description</Label><Textarea name="description" />{state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}</div>
                    <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input name="tags" />{state?.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags[0]}</p>}</div>
                    <ImageUpload fieldName="projectImage" label="Project Image" description="Upload/paste a project image." error={state?.errors?.projectImage} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint[0]}</p>}</div>
                    <div className="space-y-2"><Label>Website URL</Label><Input name="websiteUrl" type="url" />{state?.errors?.websiteUrl && <p className="text-sm text-destructive">{state.errors.websiteUrl[0]}</p>}</div>
                    <div className="space-y-2"><Label>GitHub URL</Label><Input name="githubUrl" type="url" />{state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl[0]}</p>}</div>
                    <SubmitButton>Add Project</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function AchievementForm() {
    const [state, dispatch] = useActionState(addAchievement, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const handleReset = () => {
        const removeButton = formRef.current?.querySelector('button[type="button"][variant="destructive"]') as HTMLButtonElement;
        if (removeButton) removeButton.click();
    };
    useFormFeedback(state, formRef, handleReset);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Achievement</CardTitle>
                <CardDescription>Highlight a new accomplishment.</CardDescription>
            </CardHeader>
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
    const handleReset = () => {
        const removeButton = formRef.current?.querySelector('button[type="button"][variant="destructive"]') as HTMLButtonElement;
        if (removeButton) removeButton.click();
    };
    useFormFeedback(state, formRef, handleReset);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Certification</CardTitle>
                <CardDescription>Add a new certification or credential.</CardDescription>
            </CardHeader>
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
        <Card>
            <CardHeader>
                <CardTitle>Add Education</CardTitle>
                <CardDescription>Detail your academic background.</CardDescription>
            </CardHeader>
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
        <Card>
            <CardHeader>
                <CardTitle>Add Work Experience</CardTitle>
                <CardDescription>Add a new role to your professional journey.</CardDescription>
            </CardHeader>
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
        <Card>
            <CardHeader>
                <CardTitle>Add Profile Link</CardTitle>
                <CardDescription>Add a link to your social or professional profiles.</CardDescription>
            </CardHeader>
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
