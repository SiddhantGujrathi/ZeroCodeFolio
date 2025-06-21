'use client';

import { useFormStatus } from 'react-dom';
import { 
    updateAbout, 
    addSkill, updateSkill, 
    addProject, updateProject, 
    addAchievement, updateAchievement, 
    addCertification, updateCertification, 
    addEducation, updateEducation,
    addWorkExperience, updateWorkExperience,
    addProfileLink, updateProfileLink,
    type AdminFormState 
} from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, useRef, useState, type ComponentProps, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { About } from '@/models/About';
import type { Skill } from '@/models/Skill';
import type { Project } from '@/models/Project';
import type { Achievement } from '@/models/Achievement';
import type { Certification } from '@/models/Certification';
import type { Education } from '@/models/Education';
import type { WorkExperience } from '@/models/WorkExperience';
import type { ProfileLink } from '@/models/ProfileLink';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';
import { RichTextEditor } from './RichTextEditor';


type Client<T> = Omit<T, '_id' | 'collection'> & { _id?: string };

// New function to generate cropped image data URL
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Failed to get canvas context'));
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    resolve(canvas.toDataURL('image/png'));
  });
}

// New component for the cropping dialog
function ImageCropDialog({
  imgSrc,
  aspect = 1,
  onCropComplete,
  onClose,
}: {
  imgSrc: string;
  aspect?: number;
  onCropComplete: (croppedImgDataUrl: string) => void;
  onClose: () => void;
}) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  }

  async function handleCrop() {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      const croppedImgDataUrl = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      onCropComplete(croppedImgDataUrl);
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function SubmitButton({ children, isUpdate }: { children: React.ReactNode, isUpdate?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending ? (isUpdate ? 'Updating...' : 'Adding...') : children}
    </Button>
  );
}

function ImageUpload({ fieldName, label, description, currentImage, error, aspect, ...props }: { 
    fieldName: string, label: string, description: string, currentImage?: string | null, error?: string[], aspect?: number 
} & ComponentProps<'input'>) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [imgSrcForCrop, setImgSrcForCrop] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setPreview(currentImage || null);
    }, [currentImage]);

    const handleFileChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (aspect) { // If an aspect ratio is provided, open the cropper
                setImgSrcForCrop(result);
            } else { // Otherwise, use the image directly
                setPreview(result);
                if (hiddenInputRef.current) {
                    hiddenInputRef.current.value = result;
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleCropComplete = (croppedImgDataUrl: string) => {
        setPreview(croppedImgDataUrl);
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = croppedImgDataUrl;
        }
        setImgSrcForCrop('');
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
                    handleFileChange(file);
                    e.preventDefault();
                    break;
                }
            }
        }
    };

    return (
        <div className="space-y-2">
             {imgSrcForCrop && (
                <ImageCropDialog
                imgSrc={imgSrcForCrop}
                aspect={aspect}
                onCropComplete={handleCropComplete}
                onClose={() => setImgSrcForCrop('')}
                />
            )}
            {label && <Label>{label}</Label>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2 p-4 border-2 border-dashed rounded-lg text-center hover:border-primary" onPaste={handlePaste}>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="text-sm file:mr-2 file:text-muted-foreground" ref={fileInputRef} />
                    <input type="hidden" name={fieldName} ref={hiddenInputRef} defaultValue={preview || ''} />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                {preview && (
                    <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-md border bg-muted/50">
                        <Image src={preview} alt="Preview" width={400} height={400} className="h-auto w-full object-contain" />
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

function AboutSubmitButton({ label, hasDefaultValue }: { label: string; hasDefaultValue: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="sm" className="w-full" disabled={pending}>
            {pending ? 'Saving...' : (hasDefaultValue ? `Update ${label}` : `Add ${label}`)}
        </Button>
    );
}

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
                <AboutSubmitButton label={label} hasDefaultValue={!!defaultValue} />
            </form>
        </div>
    )
}

function BioSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Saving Bio...' : 'Update Bio'}
        </Button>
    );
}


function BioEditorForm({ bio }: { bio?: string | null }) {
    const [state, dispatch] = useActionState(updateAbout, { message: null, success: false });
    const { toast } = useToast();

    const [editorValue, setEditorValue] = useState(bio || '');
    const [savedValue, setSavedValue] = useState(bio || '');

    const isDirty = useMemo(() => editorValue !== savedValue, [editorValue, savedValue]);

    useEffect(() => {
        if (state?.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Success!' : 'Error',
                description: state.message,
            });
            if (state.success) {
                setSavedValue(editorValue);
            }
        }
    }, [state, toast, editorValue]);

    return (
        <div className="space-y-3">
            <form action={dispatch} className="space-y-3">
                <div className="space-y-2">
                    <div className="flex justify-end items-center mb-1 h-4">
                        {isDirty && <span className="text-xs font-semibold text-yellow-500 animate-pulse">Unsaved changes</span>}
                    </div>
                    <RichTextEditor
                        value={editorValue}
                        onChange={setEditorValue}
                    />
                    <input type="hidden" name="bio" value={editorValue} />
                </div>
                {state?.errors?.bio && <p className="text-sm text-destructive mt-1">{state.errors.bio[0]}</p>}
                <BioSubmitButton />
            </form>
        </div>
    );
}

export function AboutForm({ about }: { about: Client<About> | null }) {
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
                    <AboutFieldForm fieldName="tagline" label="Professional Line" defaultValue={about?.tagline}>
                        <Input name="tagline" placeholder="e.g. Full Stack Developer" defaultValue={about?.tagline ?? ''} />
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
                
                <div>
                  <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">Bio</h3>
                  <BioEditorForm bio={about?.bio} />
                </div>

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
                            aspect={1 / 1}
                        />
                    </AboutFieldForm>
                </div>
            </CardContent>
        </Card>
    );
}

export function SkillForm({ skill, onSuccess }: { skill?: Client<Skill>, onSuccess?: () => void }) {
  const action = skill ? updateSkill : addSkill;
  const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!state?.message) return;
    toast({
        variant: state.success ? 'default' : 'destructive',
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
    });
    if (state.success) {
        if (onSuccess) {
            onSuccess();
        } else {
            formRef.current?.reset();
            const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
            if(removeButton) removeButton.click();
        }
    }
  }, [state, toast, onSuccess]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</CardTitle>
        <CardDescription>{skill ? 'Edit the details of this skill.' : 'Add a new skill to be displayed.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-4">
          {skill && <input type="hidden" name="id" value={skill._id} />}
          <div className="space-y-2">
            <Label>Skill Title</Label>
            <Input name="title" placeholder="e.g., React" defaultValue={skill?.title ?? ''} />
            {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label>Icon Name</Label>
            <Input name="icon" placeholder="e.g., 'ReactIcon', 'Github'" defaultValue={skill?.icon ?? ''} />
            <p className="text-xs text-muted-foreground">
                Enter an icon name from the library (e.g., `PythonIcon`, `Github`). This is used if no custom image is uploaded.
            </p>
            {state?.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon[0]}</p>}
          </div>

          <ImageUpload fieldName="image" label="OR Upload Custom Image" description="Upload a custom image. This will override the Icon Name." currentImage={skill?.image} error={state?.errors?.image} aspect={1 / 1} />
          
          <div className="space-y-2">
             <Label>Image AI Hint</Label>
             <Input name="imageAiHint" placeholder="e.g., 'java icon' or 'python logo'" defaultValue={skill?.imageAiHint ?? ''} />
             {state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint[0]}</p>}
          </div>
          <SubmitButton isUpdate={!!skill}>{skill ? 'Update Skill' : 'Add Skill'}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ProjectForm({ project, onSuccess }: { project?: Client<Project>, onSuccess?: () => void }) {
    const action = project ? updateProject : addProject;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [description, setDescription] = useState(project?.description ?? '');

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                setDescription('');
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
                <CardDescription>{project ? 'Edit the details of this project.' : 'Showcase a new project you\'ve worked on.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {project && <input type="hidden" name="id" value={project._id} />}
                    <div className="space-y-2"><Label>Project Title</Label><Input name="title" defaultValue={project?.title ?? ''} />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}</div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <RichTextEditor value={description} onChange={setDescription} />
                        <input type="hidden" name="description" value={description} />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                    </div>
                    <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input name="tags" defaultValue={project?.tags?.join(', ') ?? ''} />{state?.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags[0]}</p>}</div>
                    <ImageUpload fieldName="projectImage" label="Project Image" description="Upload/paste a project image." currentImage={project?.projectImage} error={state?.errors?.projectImage} aspect={16 / 9} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" defaultValue={project?.imageAiHint ?? ''} />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint[0]}</p>}</div>
                    <div className="space-y-2"><Label>Website URL</Label><Input name="websiteUrl" type="url" defaultValue={project?.websiteUrl ?? ''} />{state?.errors?.websiteUrl && <p className="text-sm text-destructive">{state.errors.websiteUrl[0]}</p>}</div>
                    <div className="space-y-2"><Label>GitHub URL</Label><Input name="githubUrl" type="url" defaultValue={project?.githubUrl ?? ''} />{state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl[0]}</p>}</div>
                    <SubmitButton isUpdate={!!project}>{project ? 'Update Project' : 'Add Project'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function AchievementForm({ achievement, onSuccess }: { achievement?: Client<Achievement>, onSuccess?: () => void }) {
    const action = achievement ? updateAchievement : addAchievement;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [description, setDescription] = useState(achievement?.description ?? '');

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                setDescription('');
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>{achievement ? 'Edit Achievement' : 'Add New Achievement'}</CardTitle>
                <CardDescription>{achievement ? 'Edit this accomplishment.' : 'Highlight a new accomplishment.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {achievement && <input type="hidden" name="id" value={achievement._id} />}
                    <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={achievement?.title ?? ''} />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <RichTextEditor value={description} onChange={setDescription} />
                        <input type="hidden" name="description" value={description} />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <ImageUpload fieldName="image" label="Achievement Image" description="Upload/paste an image." currentImage={achievement?.image} error={state?.errors?.image} aspect={16 / 9} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" defaultValue={achievement?.imageAiHint ?? ''} />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
                    <SubmitButton isUpdate={!!achievement}>{achievement ? 'Update Achievement' : 'Add Achievement'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function CertificationForm({ certification, onSuccess }: { certification?: Client<Certification>, onSuccess?: () => void }) {
    const action = certification ? updateCertification : addCertification;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{certification ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
                <CardDescription>{certification ? 'Edit this certification.' : 'Add a new certification or credential.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {certification && <input type="hidden" name="id" value={certification._id} />}
                    <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={certification?.title ?? ''} />{state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}</div>
                    <div className="space-y-2"><Label>Issued By</Label><Input name="issuedBy" defaultValue={certification?.issuedBy ?? ''} />{state?.errors?.issuedBy && <p className="text-sm text-destructive">{state.errors.issuedBy}</p>}</div>
                    <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" defaultValue={certification?.date ?? ''} />{state?.errors?.date && <p className="text-sm text-destructive">{state.errors.date}</p>}</div>
                    <div className="space-y-2"><Label>Certificate URL</Label><Input name="certificateUrl" type="url" defaultValue={certification?.certificateUrl ?? ''} />{state?.errors?.certificateUrl && <p className="text-sm text-destructive">{state.errors.certificateUrl}</p>}</div>
                    <ImageUpload fieldName="image" label="Certificate Image" description="Upload/paste an image." currentImage={certification?.image} error={state?.errors?.image} aspect={16 / 9} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="imageAiHint" defaultValue={certification?.imageAiHint ?? ''} />{state?.errors?.imageAiHint && <p className="text-sm text-destructive">{state.errors.imageAiHint}</p>}</div>
                    <SubmitButton isUpdate={!!certification}>{certification ? 'Update Certification' : 'Add Certification'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function EducationForm({ education, onSuccess }: { education?: Client<Education>, onSuccess?: () => void }) {
    const action = education ? updateEducation : addEducation;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{education ? 'Edit Education' : 'Add Education'}</CardTitle>
                <CardDescription>{education ? 'Edit this education entry.' : 'Detail your academic background.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {education && <input type="hidden" name="id" value={education._id} />}
                    <div className="space-y-2"><Label>College Name</Label><Input name="collegeName" defaultValue={education?.collegeName ?? ''} />{state?.errors?.collegeName && <p className="text-sm text-destructive">{state.errors.collegeName}</p>}</div>
                    <div className="space-y-2"><Label>Degree Name</Label><Input name="degreeName" defaultValue={education?.degreeName ?? ''} />{state?.errors?.degreeName && <p className="text-sm text-destructive">{state.errors.degreeName}</p>}</div>
                    <div className="space-y-2"><Label>Period</Label><Input name="period" placeholder="e.g., 2020-2024" defaultValue={education?.period ?? ''} />{state?.errors?.period && <p className="text-sm text-destructive">{state.errors.period}</p>}</div>
                    <div className="space-y-2"><Label>CGPA</Label><Input name="cgpa" defaultValue={education?.cgpa ?? ''} />{state?.errors?.cgpa && <p className="text-sm text-destructive">{state.errors.cgpa}</p>}</div>
                    <ImageUpload fieldName="icon" label="Education Icon / Image" description="Upload/paste an image for the school/college." currentImage={education?.icon} error={state?.errors?.icon} aspect={1 / 1} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="iconHint" placeholder="e.g., 'university logo' or 'graduation cap'" defaultValue={education?.iconHint ?? ''} />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton isUpdate={!!education}>{education ? 'Update Education' : 'Add Education'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function WorkExperienceForm({ experience, onSuccess }: { experience?: Client<WorkExperience>, onSuccess?: () => void }) {
    const action = experience ? updateWorkExperience : addWorkExperience;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [description, setDescription] = useState(experience?.description ?? '');

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                setDescription('');
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{experience ? 'Edit Work Experience' : 'Add Work Experience'}</CardTitle>
                <CardDescription>{experience ? 'Edit this work experience.' : 'Add a new role to your professional journey.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {experience && <input type="hidden" name="id" value={experience._id} />}
                    <div className="space-y-2"><Label>Role</Label><Input name="role" defaultValue={experience?.role ?? ''} />{state?.errors?.role && <p className="text-sm text-destructive">{state.errors.role}</p>}</div>
                    <div className="space-y-2"><Label>Company Name</Label><Input name="companyName" defaultValue={experience?.companyName ?? ''} />{state?.errors?.companyName && <p className="text-sm text-destructive">{state.errors.companyName}</p>}</div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <RichTextEditor value={description} onChange={setDescription} />
                        <input type="hidden" name="description" value={description} />
                        {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
                    </div>
                    <ImageUpload fieldName="icon" label="Company Icon / Logo" description="Upload/paste a company logo." currentImage={experience?.icon} error={state?.errors?.icon} aspect={1 / 1} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="iconHint" placeholder="e.g., 'company logo' or 'briefcase'" defaultValue={experience?.iconHint ?? ''} />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton isUpdate={!!experience}>{experience ? 'Update Experience' : 'Add Experience'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}

export function ProfileLinkForm({ link, onSuccess }: { link?: Client<ProfileLink>, onSuccess?: () => void }) {
    const action = link ? updateProfileLink : addProfileLink;
    const [state, dispatch] = useActionState(action, { message: null, errors: {}, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!state?.message) return;
        toast({
            variant: state.success ? 'default' : 'destructive',
            title: state.success ? 'Success!' : 'Error',
            description: state.message,
        });
        if (state.success) {
            if (onSuccess) {
                onSuccess();
            } else {
                formRef.current?.reset();
                const removeButton = formRef.current?.querySelector('button[variant="destructive"].absolute') as HTMLButtonElement;
                if(removeButton) removeButton.click();
            }
        }
    }, [state, toast, onSuccess]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{link ? 'Edit Profile Link' : 'Add Profile Link'}</CardTitle>
                <CardDescription>{link ? 'Edit this profile link.' : 'Add a link to your social or professional profiles.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={dispatch} className="space-y-4">
                    {link && <input type="hidden" name="id" value={link._id} />}
                    <div className="space-y-2"><Label>Platform</Label><Input name="platform" placeholder="e.g., GitHub" defaultValue={link?.platform ?? ''} />{state?.errors?.platform && <p className="text-sm text-destructive">{state.errors.platform}</p>}</div>
                    <div className="space-y-2"><Label>URL</Label><Input name="url" type="url" defaultValue={link?.url ?? ''} />{state?.errors?.url && <p className="text-sm text-destructive">{state.errors.url}</p>}</div>
                    <ImageUpload fieldName="icon" label="Platform Icon / Logo" description="Upload/paste an icon for the platform." currentImage={link?.icon} error={state?.errors?.icon} aspect={1 / 1} />
                    <div className="space-y-2"><Label>Image AI Hint</Label><Input name="iconHint" placeholder="e.g., 'github logo'" defaultValue={link?.iconHint ?? ''} />{state?.errors?.iconHint && <p className="text-sm text-destructive">{state.errors.iconHint}</p>}</div>
                    <SubmitButton isUpdate={!!link}>{link ? 'Update Link' : 'Add Link'}</SubmitButton>
                </form>
            </CardContent>
        </Card>
    );
}
